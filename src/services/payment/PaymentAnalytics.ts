import { Principal } from '@dfinity/principal';
import { PaymentSession } from '../../declarations/payment_verification/payment_verification.did';

export interface PaymentMetrics {
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    totalVolume: bigint;
    averageAmount: bigint;
    successRate: number;
}

export interface PaymentTrend {
    timestamp: number;
    amount: bigint;
    status: string;
}

export class PaymentAnalytics {
    private static instance: PaymentAnalytics | null = null;
    private analyticsBuffer: Map<string, PaymentSession>;
    private readonly METRICS_KEY = 'payment_metrics';
    private readonly TRENDS_KEY = 'payment_trends';

    private constructor() {
        this.analyticsBuffer = new Map();
    }

    public static getInstance(): PaymentAnalytics {
        if (!PaymentAnalytics.instance) {
            PaymentAnalytics.instance = new PaymentAnalytics();
        }
        return PaymentAnalytics.instance;
    }

    public async trackPayment(session: PaymentSession): Promise<void> {
        this.analyticsBuffer.set(session.session_id, session);
        await this.updateMetrics(session);
        await this.recordTrend(session);
    }

    private async updateMetrics(session: PaymentSession): Promise<void> {
        try {
            const currentMetrics = await this.getMetrics();
            const updatedMetrics: PaymentMetrics = {
                totalPayments: currentMetrics.totalPayments + 1,
                successfulPayments: currentMetrics.successfulPayments + 
                    (this.isSuccessful(session.status) ? 1 : 0),
                failedPayments: currentMetrics.failedPayments +
                    (this.isFailed(session.status) ? 1 : 0),
                totalVolume: currentMetrics.totalVolume + session.amount,
                averageAmount: this.calculateNewAverage(
                    currentMetrics.averageAmount,
                    session.amount,
                    currentMetrics.totalPayments + 1
                ),
                successRate: this.calculateSuccessRate(
                    currentMetrics.successfulPayments + (this.isSuccessful(session.status) ? 1 : 0),
                    currentMetrics.totalPayments + 1
                )
            };

            await ic_storage.set(this.METRICS_KEY, JSON.stringify(updatedMetrics));
        } catch (error) {
            console.error('Failed to update metrics:', error);
        }
    }

    private async recordTrend(session: PaymentSession): Promise<void> {
        try {
            const trend: PaymentTrend = {
                timestamp: Date.now(),
                amount: session.amount,
                status: this.getStatusString(session.status)
            };

            const currentTrends = await this.getTrends();
            currentTrends.push(trend);

            // Keep only last 1000 trends
            if (currentTrends.length > 1000) {
                currentTrends.shift();
            }

            await ic_storage.set(this.TRENDS_KEY, JSON.stringify(currentTrends));
        } catch (error) {
            console.error('Failed to record trend:', error);
        }
    }

    public async getMetrics(): Promise<PaymentMetrics> {
        try {
            const metricsData = await ic_storage.get(this.METRICS_KEY);
            return metricsData ? JSON.parse(metricsData) : this.getInitialMetrics();
        } catch (error) {
            console.error('Failed to get metrics:', error);
            return this.getInitialMetrics();
        }
    }

    public async getTrends(): Promise<PaymentTrend[]> {
        try {
            const trendsData = await ic_storage.get(this.TRENDS_KEY);
            return trendsData ? JSON.parse(trendsData) : [];
        } catch (error) {
            console.error('Failed to get trends:', error);
            return [];
        }
    }

    private getInitialMetrics(): PaymentMetrics {
        return {
            totalPayments: 0,
            successfulPayments: 0,
            failedPayments: 0,
            totalVolume: BigInt(0),
            averageAmount: BigInt(0),
            successRate: 0
        };
    }

    private calculateNewAverage(
        currentAverage: bigint,
        newAmount: bigint,
        totalCount: number
    ): bigint {
        return (currentAverage * BigInt(totalCount - 1) + newAmount) / BigInt(totalCount);
    }

    private calculateSuccessRate(successful: number, total: number): number {
        return total === 0 ? 0 : (successful / total) * 100;
    }

    private isSuccessful(status: any): boolean {
        return 'confirmed' in status;
    }

    private isFailed(status: any): boolean {
        return 'failed' in status || 'expired' in status;
    }

    private getStatusString(status: any): string {
        if ('confirmed' in status) return 'confirmed';
        if ('pending' in status) return 'pending';
        if ('failed' in status) return 'failed';
        if ('expired' in status) return 'expired';
        return 'unknown';
    }

    public async generateReport(timeframe: 'day' | 'week' | 'month'): Promise<string> {
        const metrics = await this.getMetrics();
        const trends = await this.getTrends();

        const timeframeMs = {
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000
        }[timeframe];

        const filteredTrends = trends.filter(
            trend => trend.timestamp > Date.now() - timeframeMs
        );

        return `
Payment Analytics Report (Last ${timeframe})
------------------------------------------
Total Payments: ${metrics.totalPayments}
Successful Payments: ${metrics.successfulPayments}
Failed Payments: ${metrics.failedPayments}
Total Volume: ${this.formatICP(metrics.totalVolume)} ICP
Average Amount: ${this.formatICP(metrics.averageAmount)} ICP
Success Rate: ${metrics.successRate.toFixed(2)}%

Recent Trends:
${filteredTrends.map(trend => 
    `${new Date(trend.timestamp).toISOString()}: ${this.formatICP(trend.amount)} ICP (${trend.status})`
).join('\n')}
        `.trim();
    }

    private formatICP(amount: bigint): string {
        return (Number(amount) / 100_000_000).toFixed(8);
    }

    public dispose(): void {
        this.analyticsBuffer.clear();
        PaymentAnalytics.instance = null;
    }
}