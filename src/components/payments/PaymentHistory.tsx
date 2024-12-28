import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const PaymentHistory: React.FC = () => {
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Creation Payment</span>
                        <span className="text-green-600">Completed</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentHistory;