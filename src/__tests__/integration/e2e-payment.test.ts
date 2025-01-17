import { Principal } from '@dfinity/principal';
import { WalletService } from '@/services/icp/wallet.service';
import { PaymentService } from '@/services/icp/payment.service';
import { ErrorTracker } from '@/services/error-tracker';

describe('E2E Payment Flow', () => {
  let walletService: WalletService;
  let paymentService: PaymentService;
  let userPrincipal: Principal;

  beforeEach(async () => {
    // Initialize services
    userPrincipal = Principal.fromText('2vxsx-fae');
    walletService = WalletService.getInstance();
    paymentService = PaymentService.getInstance(userPrincipal);
    await walletService.initialize();
    await paymentService.initialize();
  });

  it('should complete full payment flow for ANIMA creation', async () => {
    // 1. Get user's starting balance
    const initialBalance = await walletService.getBalance();
    
    // 2. Verify treasury account
    const userAccountId = walletService.getUserAccountIdentifier(userPrincipal);
    expect(userAccountId).toBeDefined();
    
    // 3. Create payment
    const payment = await paymentService.createPayment('Creation');
    expect(payment.amount).toBe(BigInt(1_00_000_000)); // 1 ICP
    
    // 4. Process payment
    const success = await paymentService.processPayment(payment);
    expect(success).toBe(true);
    
    // 5. Verify balance change
    const finalBalance = await walletService.getBalance();
    expect(finalBalance).toBe(initialBalance - payment.amount - BigInt(10000)); // Amount + fee
    
    // 6. Check transaction record
    const transactions = await walletService['state']?.transactions;
    const creationTx = transactions?.find(tx => 
      tx.type === 'mint' && 
      tx.amount === payment.amount &&
      tx.status === 'completed'
    );
    expect(creationTx).toBeDefined();
  });

  it('should handle insufficient funds correctly', async () => {
    // Set low balance
    const lowBalance = BigInt(50_000_000); // 0.5 ICP
    jest.spyOn(walletService as any, 'getBalance').mockReturnValue(lowBalance);

    try {
      await paymentService.createPayment('Creation');
      fail('Should have thrown insufficient funds error');
    } catch (error) {
      expect(error.message).toContain('Insufficient balance');
    }
  });

  it('should verify payment association with Internet Identity', async () => {
    // 1. Create and process payment
    const payment = await paymentService.createPayment('Creation');
    await paymentService.processPayment(payment);

    // 2. Get transaction record
    const transactions = await walletService['state']?.transactions;
    const tx = transactions?.find(t => t.amount === payment.amount);
    expect(tx).toBeDefined();

    // 3. Verify transaction is linked to correct II
    const txUserAccountId = walletService.getUserAccountIdentifier(userPrincipal);
    expect(tx?.memo).toContain(txUserAccountId);
  });

  it('should maintain quantum coherence during payment', async () => {
    // 1. Check initial quantum state
    const initialMetrics = walletService.getQuantumMetrics();
    expect(initialMetrics.coherenceLevel).toBeGreaterThan(0.3);

    // 2. Process payment
    const payment = await paymentService.createPayment('Creation');
    await paymentService.processPayment(payment);

    // 3. Verify quantum state maintained
    const finalMetrics = walletService.getQuantumMetrics();
    expect(finalMetrics.coherenceLevel).toBeGreaterThan(0.3);
    expect(finalMetrics.stabilityStatus).toBe('stable');
  });
});
