import type { Principal } from '@dfinity/principal';

export type AccountIdentifier = string;
export type Subaccount = number[];
export type Tokens = bigint;
export type BlockIndex = bigint;

export interface TransferArgs {
    to: AccountIdentifier;
    fee: Tokens;
    memo: bigint;
    from_subaccount?: Subaccount;
    created_at_time?: bigint;
    amount: Tokens;
}

export interface TransferResult {
    Ok: BlockIndex;
    Err: TransferError;
}

export type TransferError = {
    BadFee: { expected_fee: Tokens };
} | {
    InsufficientFunds: { balance: Tokens };
} | {
    TooOld: null;
} | {
    CreatedInFuture: { ledger_time: bigint };
} | {
    TemporarilyUnavailable: null;
} | {
    Duplicate: { duplicate_of: BlockIndex };
};

export interface Account {
    owner: Principal;
    subaccount?: Subaccount;
}

export interface AccountBalanceArgs {
    account: AccountIdentifier;
}

export interface LedgerActor {
    icrc1_balance_of: (account: Account) => Promise<Tokens>;
    icrc1_transfer: (args: TransferArgs) => Promise<TransferResult>;
    account_balance: (args: AccountBalanceArgs) => Promise<{ e8s: bigint }>;
}

export interface LedgerService {
    createActor: () => Promise<LedgerActor>;
    getBalance: (account: AccountIdentifier) => Promise<Tokens>;
    transfer: (args: TransferArgs) => Promise<TransferResult>;
    getAccountIdentifier: (owner: Principal, subaccount?: Subaccount) => AccountIdentifier;
}