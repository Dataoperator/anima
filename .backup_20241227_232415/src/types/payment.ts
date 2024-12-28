import { Principal } from '@dfinity/principal';

export enum PaymentType {
  CREATION = 'CREATION',
  GROWTH = 'GROWTH',
  RESURRECTION = 'RESURRECTION',
  CUSTOMIZATION = 'CUSTOMIZATION'
}

export interface PaymentSettings {
  creationFee: bigint;
  growthPackFee: bigint;
  resurrectionFee: bigint;
  customizationFee: bigint;
}

export interface PaymentState {
  settings: PaymentSettings | null;
  currentFee: bigint | null;
  paymentType: PaymentType | null;
  processing: boolean;
  error: string | null;
}

export type PaymentAction =
  | { type: 'SET_SETTINGS'; payload: PaymentSettings }
  | { type: 'SET_PAYMENT_TYPE'; payload: PaymentType }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

export interface PaymentContextType extends PaymentState {
  initializePayment: (type: PaymentType) => Promise<void>;
  processPayment: () => Promise<boolean>;
  resetPayment: () => void;
}