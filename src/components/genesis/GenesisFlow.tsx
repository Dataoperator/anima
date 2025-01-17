import React, { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingStates } from '../ui/LoadingStates';
import { SecurePaymentPanel } from '../payment/SecurePaymentPanel';
import { useToast } from '../ui/use-toast';

const EnhancedGenesis = React.lazy(() => import('./EnhancedGenesis'));
const GenesisRitual = React.lazy(() => import('./GenesisRitual'));
const InitialDesignation = React.lazy(() => import('./InitialDesignation'));
const DesignationGenerator = React.lazy(() => import('./DesignationGenerator'));

const GenesisFlow: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'payment' | 'genesis' | 'ritual' | 'designation'>('payment');
    const [tokenId, setTokenId] = useState<string | null>(null);
    const { toast } = useToast();

    const handlePaymentComplete = (completedTokenId: string) => {
        setTokenId(completedTokenId);
        setCurrentStep('genesis');
        toast({
            title: 'Payment Successful',
            description: 'Your ANIMA genesis process can now begin.',
            duration: 5000,
        });
    };

    const handlePaymentError = (error: string) => {
        toast({
            title: 'Payment Error',
            description: error,
            variant: 'destructive',
            duration: 5000,
        });
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'payment':
                return (
                    <SecurePaymentPanel
                        onPaymentComplete={handlePaymentComplete}
                        onError={handlePaymentError}
                    />
                );
            case 'genesis':
                return <EnhancedGenesis onComplete={() => setCurrentStep('ritual')} tokenId={tokenId} />;
            case 'ritual':
                return <GenesisRitual onComplete={() => setCurrentStep('designation')} tokenId={tokenId} />;
            case 'designation':
                return (
                    <>
                        <InitialDesignation tokenId={tokenId} />
                        <DesignationGenerator tokenId={tokenId} />
                    </>
                );
            default:
                return <LoadingStates />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black text-cyan-50"
        >
            <Suspense fallback={<LoadingStates />}>
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        {/* Progress Indicator */}
                        <div className="flex justify-center mb-8">
                            {['payment', 'genesis', 'ritual', 'designation'].map((step, index) => (
                                <React.Fragment key={step}>
                                    <div 
                                        className={`w-3 h-3 rounded-full ${
                                            step === currentStep
                                                ? 'bg-cyan-400'
                                                : index < ['payment', 'genesis', 'ritual', 'designation'].indexOf(currentStep)
                                                ? 'bg-cyan-600'
                                                : 'bg-gray-600'
                                        }`}
                                    />
                                    {index < 3 && (
                                        <div 
                                            className={`w-16 h-0.5 ${
                                                index < ['payment', 'genesis', 'ritual', 'designation'].indexOf(currentStep)
                                                    ? 'bg-cyan-600'
                                                    : 'bg-gray-600'
                                            }`}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Current Step Content */}
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderCurrentStep()}
                        </motion.div>
                    </div>
                </div>
            </Suspense>
        </motion.div>
    );
};

export default GenesisFlow;