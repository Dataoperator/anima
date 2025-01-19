import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { ErrorTelemetry } from '../error/telemetry';

const telemetry = ErrorTelemetry.getInstance('payment');

export interface PaymentDetails {
  amount: bigint;
  to: Principal;
  from: Principal;
  memo: bigint;
  timestamp: bigint;
}

export interface PaymentResult {
  success: boolean;
  blockHeight?: bigint;
  error?: string;
}

export async function validatePrincipal(principal: string | Principal): Promise<boolean> {
  try {
    const principalObj = typeof principal === 'string' 
      ? Principal.fromText(principal)
      : principal;

    return !principalObj.isAnonymous;
  } catch {
    return false;
  }
}

export async function validatePayment(payment: PaymentDetails): Promise<boolean> {
  try {
    // Validate amount
    if (payment.amount <= BigInt(0)) {
      throw new Error('Invalid payment amount');
    }

    // Validate principals
    if (!(await validatePrincipal(payment.to)) || !(await validatePrincipal(payment.from))) {
      throw new Error('Invalid principal');
    }

    // Validate memo format
    if (payment.memo < BigInt(0)) {
      throw new Error('Invalid memo format');
    }

    return true;
  } catch (error) {
    await telemetry.logError({
      errorType: 'PAYMENT_VALIDATION_ERROR',
      severity: 'HIGH',
      context: 'validatePayment',
      error: error instanceof Error ? error : new Error('Payment validation failed')
    });
    return false;
  }
}

export function formatICPAmount(amount: bigint): string {
  const amountString = amount.toString();
  const decimalPlaces = 8;
  
  if (amountString.length <= decimalPlaces) {
    return `0.${amountString.padStart(decimalPlaces, '0')}`;
  }
  
  const wholePart = amountString.slice(0, -decimalPlaces);
  const decimalPart = amountString.slice(-decimalPlaces);
  
  return `${wholePart}.${decimalPart}`;
}

export async function processPayment<T extends ActorSubclass<any>>(
  ledgerActor: T,
  payment: PaymentDetails
): Promise<PaymentResult> {
  try {
    if (!await validatePayment(payment)) {
      throw new Error('Payment validation failed');
    }

    const result = await ledgerActor.transfer({
      to: payment.to,
      amount: { e8s: payment.amount },
      fee: { e8s: BigInt(10000) },
      memo: payment.memo,
      from_subaccount: [],
      created_at_time: []
    });

    if ('Err' in result) {
      throw new Error(JSON.stringify(result.Err));
    }

    return {
      success: true,
      blockHeight: result.Ok
    };

  } catch (error) {
    await telemetry.logError({
      errorType: 'PAYMENT_PROCESSING_ERROR',
      severity: 'HIGH',
      context: 'processPayment',
      error: error instanceof Error ? error : new Error('Payment processing failed')
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}