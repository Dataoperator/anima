import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentProvider, usePayment } from '@/contexts/PaymentContext';
import { AuthContext } from '@/contexts/AuthContext';
import { mockAuthContext } from '../mocks/mockAuthContext';

const TestComponent = () => {
  const { initiatePayment, isProcessing, error } = usePayment();
  return (
    <div>
      <button 
        onClick={() => initiatePayment({ Creation: null }, BigInt(1000000))}
        disabled={isProcessing}
      >
        Pay
      </button>
      {error && <div>{error}</div>}
    </div>
  );
};

describe('PaymentContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initiates payment successfully', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <PaymentProvider>
          <TestComponent />
        </PaymentProvider>
      </AuthContext.Provider>
    );

    const button = screen.getByText('Pay');
    await fireEvent.click(button);

    expect(mockAuthContext.actor.get_payment_settings).toHaveBeenCalled();
  });

  it('handles payment errors gracefully', async () => {
    const errorContext = {
      ...mockAuthContext,
      actor: {
        ...mockAuthContext.actor,
        get_payment_settings: jest.fn().mockRejectedValue(new Error('Payment failed'))
      }
    };

    render(
      <AuthContext.Provider value={errorContext}>
        <PaymentProvider>
          <TestComponent />
        </PaymentProvider>
      </AuthContext.Provider>
    );

    const button = screen.getByText('Pay');
    await fireEvent.click(button);

    expect(await screen.findByText('Payment failed')).toBeInTheDocument();
  });
});