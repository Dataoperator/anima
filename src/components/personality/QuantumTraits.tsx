import React from 'react';
import { motion } from 'framer-motion';

interface QuantumState {
    type: "Stable" | "Fluctuating" | "Entangled";
    data?: {
        amplitude?: number;
        frequency?: number;
        partner_id?: string;
        correlation?: number;
    };
}

interface QuantumTrait {
    value: number;
    uncertainty: number;
    superposition_state: QuantumState;
}

interface QuantumTraitProps {
    traits: Record<string, QuantumTrait>;
}

export const QuantumTraits: React.FC<QuantumTraitProps> = ({ traits }) => {
    const sortedTraits = Object.entries(traits).sort((a, b) => b[1].value - a[1].value);

    return (
        <div className="space-y-4">
            {sortedTraits.map(([name, trait], index) => (
                <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-200">
                            {name.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                            {(trait.value * 100).toFixed(1)}% ±{(trait.uncertainty * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${trait.value * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className={`absolute h-full ${getTraitColor(trait.superposition_state.type)}`}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

function getTraitColor(state: QuantumState['type']): string {
    switch (state) {
        case 'Stable':
            return 'bg-gradient-to-r from-purple-500 to-blue-500';
        case 'Fluctuating':
            return 'bg-gradient-to-r from-orange-500 to-red-500';
        case 'Entangled':
            return 'bg-gradient-to-r from-green-500 to-teal-500';
    }
}