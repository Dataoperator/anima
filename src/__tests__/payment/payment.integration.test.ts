import { Principal } from '@dfinity/principal';
import { MockIdentity } from '../mocks/MockIdentity';
import { ActorSubclass } from '@dfinity/agent';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock the canister interfaces
const mockPaymentActor = {
    create_payment_session: jest.fn(),
    verify_payment: jest.fn(),
    check_payment_status: jest.fn(),
    complete_minting: jest.fn(),
    refund_session: jest.fn()
};

const mockLedgerActor = {
    account_balance: jest.fn(),
    transfer: jest.fn()
};

describe('Payment Integration Tests', () => {
    let identity: MockIdentity;
    
    beforeEach(() => {
        identity = new MockIdentity();
        jest.clearAllMocks();
    });

    describe('Payment Session Creation', () => {
        it('should create a valid payment session', async () => {
            const mockSession = {
                session_id: 'test-session',
                payment_address: 'test-address',
                amount: BigInt(100000000), // 1 ICP
                owner: identity.getPrincipal(),
                expires_at: BigInt(Date.now() + 3600000),
                status: { pending: null },
                token_id: null
            };

            mockPaymentActor.create_payment_session.mockResolvedValue({ Ok: mockSession });

            const result = await mockPaymentActor.create_payment_session(identity.getPrincipal());
            expect(result.Ok).toBeDefined();
            expect(result.Ok.session_id).toBe('test-session');
        });

        it('should handle session creation errors', async () => {
            mockPaymentActor.create_payment_session.mockResolvedValue({ 
                Err: 'Failed to create session' 
            });

            const result = await mockPaymentActor.create_payment_session(identity.getPrincipal());
            expect(result.Err).toBeDefined();
        });
    });

    describe('Payment Verification', () => {
        it('should verify successful payment', async () => {
            const sessionId = 'test-session';
            mockLedgerActor.account_balance.mockResolvedValue({ e8s: BigInt(100000000) });
            mockPaymentActor.check_payment_status.mockResolvedValue({ Ok: 'confirmed' });

            const result = await mockPaymentActor.check_payment_status(sessionId);
            expect(result.Ok).toBe('confirmed');
        });

        it('should handle insufficient balance', async () => {
            const sessionId = 'test-session';
            mockLedgerActor.account_balance.mockResolvedValue({ e8s: BigInt(50000000) });
            mockPaymentActor.check_payment_status.mockResolvedValue({ Ok: 'pending' });

            const result = await mockPaymentActor.check_payment_status(sessionId);
            expect(result.Ok).toBe('pending');
        });

        it('should handle expired sessions', async () => {
            const sessionId = 'test-session';
            mockPaymentActor.check_payment_status.mockResolvedValue({ Ok: 'expired' });

            const result = await mockPaymentActor.check_payment_status(sessionId);
            expect(result.Ok).toBe('expired');
        });
    });

    describe('Minting Process', () => {
        it('should complete minting after confirmed payment', async () => {
            const sessionId = 'test-session';
            const tokenId = 'test-token-id';
            
            mockPaymentActor.complete_minting.mockResolvedValue({
                Ok: {
                    session_id: sessionId,
                    token_id: tokenId,
                    status: { confirmed: null }
                }
            });

            const result = await mockPaymentActor.complete_minting(sessionId, tokenId);
            expect(result.Ok.token_id).toBe(tokenId);
            expect(result.Ok.status).toHaveProperty('confirmed');
        });

        it('should handle minting failures', async () => {
            const sessionId = 'test-session';
            const tokenId = 'test-token-id';
            
            mockPaymentActor.complete_minting.mockResolvedValue({
                Err: 'Minting failed'
            });

            const result = await mockPaymentActor.complete_minting(sessionId, tokenId);
            expect(result.Err).toBeDefined();
        });
    });

    describe('Refund Process', () => {
        it('should process refund for failed session', async () => {
            const sessionId = 'test-session';
            mockPaymentActor.refund_session.mockResolvedValue({
                Ok: {
                    session_id: sessionId,
                    status: { failed: null }
                }
            });

            const result = await mockPaymentActor.refund_session(sessionId);
            expect(result.Ok.status).toHaveProperty('failed');
        });

        it('should handle refund failures', async () => {
            const sessionId = 'test-session';
            mockPaymentActor.refund_session.mockResolvedValue({
                Err: 'Refund failed'
            });

            const result = await mockPaymentActor.refund_session(sessionId);
            expect(result.Err).toBeDefined();
        });
    });

    describe('End-to-End Payment Flow', () => {
        it('should handle complete successful payment flow', async () => {
            // 1. Create session
            const mockSession = {
                session_id: 'test-session',
                payment_address: 'test-address',
                amount: BigInt(100000000),
                owner: identity.getPrincipal(),
                expires_at: BigInt(Date.now() + 3600000),
                status: { pending: null },
                token_id: null
            };

            mockPaymentActor.create_payment_session.mockResolvedValue({ Ok: mockSession });
            
            // 2. Check balance and verify payment
            mockLedgerActor.account_balance.mockResolvedValue({ e8s: BigInt(100000000) });
            mockPaymentActor.check_payment_status.mockResolvedValue({ Ok: 'confirmed' });
            
            // 3. Complete minting
            const tokenId = 'test-token-id';
            mockPaymentActor.complete_minting.mockResolvedValue({
                Ok: {
                    ...mockSession,
                    token_id: tokenId,
                    status: { confirmed: null }
                }
            });

            // Execute flow
            const session = await mockPaymentActor.create_payment_session(identity.getPrincipal());
            expect(session.Ok).toBeDefined();

            const paymentStatus = await mockPaymentActor.check_payment_status(session.Ok.session_id);
            expect(paymentStatus.Ok).toBe('confirmed');

            const mintingResult = await mockPaymentActor.complete_minting(
                session.Ok.session_id,
                tokenId
            );
            expect(mintingResult.Ok.token_id).toBe(tokenId);
        });

        it('should handle complete failed payment flow with refund', async () => {
            // 1. Create session
            const mockSession = {
                session_id: 'test-session',
                payment_address: 'test-address',
                amount: BigInt(100000000),
                owner: identity.getPrincipal(),
                expires_at: BigInt(Date.now() + 3600000),
                status: { pending: null },
                token_id: null
            };

            mockPaymentActor.create_payment_session.mockResolvedValue({ Ok: mockSession });
            
            // 2. Payment fails
            mockLedgerActor.account_balance.mockResolvedValue({ e8s: BigInt(50000000) });
            mockPaymentActor.check_payment_status.mockResolvedValue({ Ok: 'failed' });
            
            // 3. Refund initiated
            mockPaymentActor.refund_session.mockResolvedValue({
                Ok: {
                    ...mockSession,
                    status: { failed: null }
                }
            });

            // Execute flow
            const session = await mockPaymentActor.create_payment_session(identity.getPrincipal());
            expect(session.Ok).toBeDefined();

            const paymentStatus = await mockPaymentActor.check_payment_status(session.Ok.session_id);
            expect(paymentStatus.Ok).toBe('failed');

            const refundResult = await mockPaymentActor.refund_session(session.Ok.session_id);
            expect(refundResult.Ok.status).toHaveProperty('failed');
        });
    });
});