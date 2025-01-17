import { Principal } from '@dfinity/principal';
import { PaymentSession } from '../../declarations/payment_verification/payment_verification.did';

export interface PaymentReceipt {
    receiptId: string;
    timestamp: number;
    sessionId: string;
    paymentAddress: string;
    amount: bigint;
    tokenId?: string;
    owner: Principal;
    status: string;
    transactionHash?: string;
}

export class ReceiptGenerator {
    private static instance: ReceiptGenerator | null = null;

    private constructor() {}

    public static getInstance(): ReceiptGenerator {
        if (!ReceiptGenerator.instance) {
            ReceiptGenerator.instance = new ReceiptGenerator();
        }
        return ReceiptGenerator.instance;
    }

    public generateReceipt(
        session: PaymentSession,
        transactionHash?: string
    ): PaymentReceipt {
        return {
            receiptId: `RCPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            sessionId: session.session_id,
            paymentAddress: session.payment_address,
            amount: session.amount,
            tokenId: session.token_id,
            owner: session.owner,
            status: this.getStatusString(session.status),
            transactionHash
        };
    }

    private getStatusString(status: any): string {
        if ('confirmed' in status) return 'confirmed';
        if ('pending' in status) return 'pending';
        if ('failed' in status) return 'failed';
        if ('expired' in status) return 'expired';
        return 'unknown';
    }

    public async storeReceipt(receipt: PaymentReceipt): Promise<void> {
        try {
            // Store in stable storage
            const storageKey = `receipt_${receipt.receiptId}`;
            await ic_storage.set(storageKey, JSON.stringify(receipt));
            
            // Add to receipt index
            const indexKey = `receipt_index_${receipt.owner.toString()}`;
            const existingIndex = await ic_storage.get(indexKey) || '[]';
            const index = JSON.parse(existingIndex);
            index.push(receipt.receiptId);
            await ic_storage.set(indexKey, JSON.stringify(index));
        } catch (error) {
            console.error('Failed to store receipt:', error);
            throw new Error('Receipt storage failed');
        }
    }

    public async getReceiptsByOwner(owner: Principal): Promise<PaymentReceipt[]> {
        try {
            const indexKey = `receipt_index_${owner.toString()}`;
            const index = JSON.parse(await ic_storage.get(indexKey) || '[]');
            
            const receipts = await Promise.all(
                index.map(async (receiptId: string) => {
                    const receipt = await ic_storage.get(`receipt_${receiptId}`);
                    return receipt ? JSON.parse(receipt) : null;
                })
            );

            return receipts.filter(Boolean);
        } catch (error) {
            console.error('Failed to fetch receipts:', error);
            return [];
        }
    }

    public generatePDFReceipt(receipt: PaymentReceipt): Uint8Array {
        // This would typically use a PDF generation library
        // For now, we'll create a simple text representation
        const receiptText = `
ANIMA NFT Payment Receipt
------------------------
Receipt ID: ${receipt.receiptId}
Date: ${new Date(receipt.timestamp).toISOString()}
Payment Address: ${receipt.payment_address}
Amount: ${this.formatAmount(receipt.amount)} ICP
Status: ${receipt.status.toUpperCase()}
${receipt.tokenId ? `Token ID: ${receipt.tokenId}` : ''}
${receipt.transactionHash ? `Transaction: ${receipt.transactionHash}` : ''}

This is an official receipt for your ANIMA NFT payment.
        `.trim();

        return new TextEncoder().encode(receiptText);
    }

    private formatAmount(amount: bigint): string {
        return (Number(amount) / 100_000_000).toFixed(8);
    }

    public verifyReceipt(receipt: PaymentReceipt): boolean {
        // Verify receipt signature and data integrity
        // This would typically involve cryptographic verification
        if (!receipt.receiptId || !receipt.sessionId || !receipt.paymentAddress) {
            return false;
        }

        // Check timestamp is within reasonable range
        const now = Date.now();
        const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
        if (receipt.timestamp > now || receipt.timestamp < oneYearAgo) {
            return false;
        }

        // Verify amount is positive
        if (receipt.amount <= BigInt(0)) {
            return false;
        }

        return true;
    }

    public dispose(): void {
        ReceiptGenerator.instance = null;
    }
}