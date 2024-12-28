export type AccountIdentifier = {
    hash: Uint8Array;
    toHex(): string;
    fromHex(hex: string): AccountIdentifier;
    fromPrincipal(principal: Principal, subAccount?: SubAccount): AccountIdentifier;
};

export type SubAccount = {
    toUint8Array(): Uint8Array;
    fromBytes(bytes: Uint8Array): SubAccount;
    fromPrincipal(principal: Principal): SubAccount;
};

export interface TransferResult {
    height: bigint;
}

export interface BalanceResult {
    e8s: bigint;
}

export interface TransactionFee {
    e8s: bigint;
}

export interface Tokens {
    e8s: bigint;
}