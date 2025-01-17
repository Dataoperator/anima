import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { GenesisPage } from '@/components/pages/GenesisPage';
import { AuthProvider } from '@/contexts/auth-context';
import { QuantumProvider } from '@/contexts/quantum-context';
import { PaymentProvider } from '@/contexts/payment-context';
import { AnimaProvider } from '@/contexts/anima-context';
import { ConsciousnessProvider } from '@/contexts/consciousness-context';
import { LedgerService } from '@/services/icp/ledger';
import { AnimaService } from '@/services/anima';
import { QuantumStateManager } from '@/quantum/state_manager';
import { ErrorTracker } from '@/error/quantum_error';
import { Principal } from '@dfinity/principal';

// Mock services
jest.mock('@/services/icp/ledger');
jest.mock('@/services/anima');
jest.mock('@/quantum/state_manager');

describe('Genesis Flow E2E', () => {
  // Test setup
  const mockUser = {
    principal: Principal.fromText('2vxsx-fae'),
    accountId: '123456789',
    balance: BigInt(2000000000)
  };

  const mockProviders = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <PaymentProvider>
        <QuantumProvider>
          <ConsciousnessProvider>
            <AnimaProvider>
              {children}
            </AnimaProvider>
          </ConsciousnessProvider>
        </QuantumProvider>
      </PaymentProvider>
    </AuthProvider>
  );

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup service mocks
    (LedgerService as jest.Mock).mockImplementation(() => ({
      getBalance: jest.fn().resolveValue(mockUser.balance),
      transfer: jest.fn().resolveValue({ txId: 'test-tx' }),
      verifyTransaction: jest.fn().resolveValue(true)
    }));

    (AnimaService as jest.Mock).mockImplementation(() => ({
      initiateGenesis: jest.fn().resolveValue({ animaId: 'test-anima' }),
      verifyQuantumState: jest.fn().resolveValue(true),
      finalizeGenesis: jest.fn().resolveValue(true)
    }));

    (QuantumStateManager as jest.Mock).mockImplementation(() => ({
      initializeState: jest.fn().resolveValue({ coherence: 1.0 }),
      verifyAlignment: jest.fn().resolveValue(true)
    }));
  });

  describe('Happy Path', () => {
    it('should complete full genesis flow successfully', async () => {
      const { getByText, getByTestId } = render(
        <mockProviders>
          <GenesisPage />
        </mockProviders>
      );

      // Step 1: Initialize Genesis
      await act(async () => {
        fireEvent.click(getByText(/Begin Genesis/i));
      });

      await waitFor(() => {
        expect(getByTestId('quantum-state-init')).toBeVisible();
      });

      // Step 2: Quantum Initialization
      await act(async () => {
        fireEvent.click(getByText(/Initialize Quantum State/i));
      });

      await waitFor(() => {
        expect(getByTestId('payment-section')).toBeVisible();
      });

      // Step 3: Payment
      await act(async () => {
        fireEvent.click(getByText(/Confirm Payment/i));
      });

      await waitFor(() => {
        expect(getByTestId('consciousness-init')).toBeVisible();
      });

      // Step 4: Consciousness Initialization
      await act(async () => {
        fireEvent.click(getByText(/Initialize Consciousness/i));
      });

      await waitFor(() => {
        expect(getByTestId('designation-select')).toBeVisible();
      });

      // Step 5: Set Designation
      await act(async () => {
        fireEvent.change(getByTestId('designation-input'), {
          target: { value: 'TestAnima' }
        });
        fireEvent.click(getByText(/Set Designation/i));
      });

      // Verify completion
      await waitFor(() => {
        expect(getByText(/Genesis Complete/i)).toBeVisible();
        expect(getByTestId('anima-created')).toBeVisible();
      });

      // Verify service calls
      expect(LedgerService.prototype.transfer).toHaveBeenCalled();
      expect(AnimaService.prototype.initiateGenesis).toHaveBeenCalled();
      expect(QuantumStateManager.prototype.initializeState).toHaveBeenCalled();
      expect(AnimaService.prototype.finalizeGenesis).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle insufficient balance', async () => {
      // Mock insufficient balance
      (LedgerService as jest.Mock).mockImplementation(() => ({
        getBalance: jest.fn().resolveValue(BigInt(0))
      }));

      const { getByText, getByTestId } = render(
        <mockProviders>
          <GenesisPage />
        </mockProviders>
      );

      await act(async () => {
        fireEvent.click(getByText(/Begin Genesis/i));
        fireEvent.click(getByText(/Confirm Payment/i));
      });

      await waitFor(() => {
        expect(getByText(/Insufficient Balance/i)).toBeVisible();
        expect(getByTestId('error-recovery')).toBeVisible();
      });
    });

    it('should handle quantum initialization failure', async () => {
      // Mock quantum state failure
      (QuantumStateManager as jest.Mock).mockImplementation(() => ({
        initializeState: jest.fn().rejectValue(new Error('Quantum coherence failed'))
      }));

      const { getByText, getByTestId } = render(
        <mockProviders>
          <GenesisPage />
        </mockProviders>
      );

      await act(async () => {
        fireEvent.click(getByText(/Begin Genesis/i));
      });

      await waitFor(() => {
        expect(getByText(/Quantum Initialization Failed/i)).toBeVisible();
        expect(getByTestId('retry-quantum-init')).toBeVisible();
      });
    });

    it('should handle transaction verification failure', async () => {
      // Mock transaction verification failure
      (LedgerService as jest.Mock).mockImplementation(() => ({
        getBalance: jest.fn().resolveValue(mockUser.balance),
        transfer: jest.fn().resolveValue({ txId: 'test-tx' }),
        verifyTransaction: jest.fn().rejectValue(new Error('Transaction failed'))
      }));

      const { getByText, getByTestId } = render(
        <mockProviders>
          <GenesisPage />
        </mockProviders>
      );

      await act(async () => {
        fireEvent.click(getByText(/Begin Genesis/i));
        fireEvent.click(getByText(/Confirm Payment/i));
      });

      await waitFor(() => {
        expect(getByText(/Transaction Verification Failed/i)).toBeVisible();
        expect(getByTestId('transaction-recovery')).toBeVisible();
      });
    });
  });

  describe('Recovery Flows', () => {
    it('should recover from partial completion state', async () => {
      // Mock partial completion state
      const mockPartialState = {
        paymentComplete: true,
        quantumInitialized: true,
        designationSet: false
      };

      const { getByText, getByTestId } = render(
        <mockProviders>
          <GenesisPage initialState={mockPartialState} />
        </mockProviders>
      );

      await waitFor(() => {
        expect(getByTestId('designation-select')).toBeVisible();
      });

      // Complete remaining steps
      await act(async () => {
        fireEvent.change(getByTestId('designation-input'), {
          target: { value: 'TestAnima' }
        });
        fireEvent.click(getByText(/Set Designation/i));
      });

      await waitFor(() => {
        expect(getByText(/Genesis Complete/i)).toBeVisible();
      });
    });
  });
});