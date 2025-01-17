import React, { useState } from 'react';
import { useAnimaContext } from '@/contexts/AnimaContext';
import { ModificationType } from '@/types/modification';
import { PaymentComponent } from '@/components/payment/PaymentComponent';
import { PaymentType } from '@/types/payment';

interface ModificationPanelProps {
    animaId: string;
}

export const ModificationPanel: React.FC<ModificationPanelProps> = ({ animaId }) => {
    const { applyModification, getAvailableMods } = useAnimaContext();
    const [selectedMod, setSelectedMod] = useState<ModificationType | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    const availableMods = getAvailableMods(animaId);

    const handleModification = async (modType: ModificationType) => {
        try {
            setIsApplying(true);
            setSelectedMod(modType);
            await applyModification(animaId, modType);
        } catch (error) {
            console.error('Failed to apply modification:', error);
        } finally {
            setIsApplying(false);
            setSelectedMod(null);
        }
    };

    return (
        <div className="modification-panel p-4 bg-opacity-20 backdrop-blur rounded-lg mt-4">
            <h3 className="text-xl font-semibold mb-4">Modifications</h3>

            <div className="mods-grid grid gap-3">
                {availableMods.map((mod) => (
                    <div 
                        key={mod.id}
                        className={`mod-item p-3 rounded-lg cursor-pointer transition-all
                            ${selectedMod === mod.type ? 'selected-mod' : ''}
                            ${isApplying ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => handleModification(mod.type)}
                    >
                        <div className="mod-header flex justify-between items-center">
                            <h4 className="text-lg">{mod.name}</h4>
                            <span className="mod-cost">
                                {mod.cost} ICP
                            </span>
                        </div>
                        
                        <p className="mod-description text-sm mt-2">
                            {mod.description}
                        </p>

                        <div className="mod-effects mt-2">
                            <span className="text-xs">Effects:</span>
                            <ul className="list-disc list-inside">
                                {mod.effects.map((effect, index) => (
                                    <li key={index} className="text-xs">
                                        {effect}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {selectedMod && (
                <div className="payment-section mt-4">
                    <PaymentComponent 
                        type={PaymentType.Modification}
                        data={{
                            animaId,
                            modificationType: selectedMod
                        }}
                    />
                </div>
            )}
        </div>
    );
};