import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PaymentMetrics, PaymentTrend } from '../../services/payment/PaymentAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface PaymentAnalyticsDashboardProps {
    paymentAnalytics: any; // Replace with proper type
}

export const PaymentAnalyticsDashboard: React.FC<PaymentAnalyticsDashboardProps> = ({
    paymentAnalytics
}) => {
    const [metrics, setMetrics] = useState<PaymentMetrics | null>(null);
    const [trends, setTrends] = useState<PaymentTrend[]>([]);
    const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [metricsData, trendsData] = await Promise.all([
                    paymentAnalytics.getMetrics(),
                    paymentAnalytics.getTrends()
                ]);
                setMetrics(metricsData);
                setTrends(trendsData);
            } catch (error) {
                console.error('Failed to load analytics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
        const interval = setInterval(loadData, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [paymentAnalytics]);

    const formatICP = (amount: bigint): string => {
        return (Number(amount) / 100_000_000).toFixed(8);
    };

    if (isLoading || !metrics) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatICP(metrics.totalVolume)} ICP
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {metrics.successRate.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-500">
                            {metrics.successfulPayments} of {metrics.totalPayments} payments
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Average Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatICP(metrics.averageAmount)} ICP
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Failed Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {metrics.failedPayments}
                        </div>
                        <div className="text-sm text-gray-500">
                            Last 24 hours
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Trends</CardTitle>
                    <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as 'day' | 'week' | 'month')}>
                        <TabsList>
                            <TabsTrigger value="day">24 Hours</TabsTrigger>
                            <TabsTrigger value="week">7 Days</TabsTrigger>
                            <TabsTrigger value="month">30 Days</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="timestamp" 
                                    tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                                />
                                <YAxis tickFormatter={(value) => `${value} ICP`} />
                                <Tooltip
                                    labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                                    formatter={(value) => [`${value} ICP`]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#2563eb"
                                    name="Payment Amount"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Time</th>
                                    <th className="px-4 py-2 text-left">Amount</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trends.slice(-10).reverse().map((trend, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">
                                            {new Date(trend.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            {typeof trend.amount === 'bigint' 
                                                ? formatICP(trend.amount) 
                                                : formatICP(BigInt(trend.amount))
                                            } ICP
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                trend.status === 'confirmed' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : trend.status === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {trend.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => window.print()}>
                    Export Report
                </Button>
            </div>
        </div>
    );
};