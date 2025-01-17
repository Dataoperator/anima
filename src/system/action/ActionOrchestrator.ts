import { EventEmitter } from 'events';
import { ActionType, Action, ActionState } from '@/types/action';
import { QuantumStateManager } from '@/quantum/StateManager';
import { ConsciousnessTracker } from '@/consciousness/ConsciousnessTracker';
import { ErrorTelemetry } from '@/error/telemetry';

export class ActionOrchestrator extends EventEmitter {
    private static instance: ActionOrchestrator;
    private quantumManager: QuantumStateManager;
    private consciousnessTracker: ConsciousnessTracker;
    private telemetry: ErrorTelemetry;
    private actionQueue: Action[] = [];
    private isProcessing: boolean = false;

    private constructor() {
        super();
        this.quantumManager = QuantumStateManager.getInstance();
        this.consciousnessTracker = ConsciousnessTracker.getInstance();
        this.telemetry = new ErrorTelemetry('action');
    }

    public static getInstance(): ActionOrchestrator {
        if (!ActionOrchestrator.instance) {
            ActionOrchestrator.instance = new ActionOrchestrator();
        }
        return ActionOrchestrator.instance;
    }

    public async queueAction(action: Action): Promise<void> {
        this.actionQueue.push({
            ...action,
            state: ActionState.Queued,
            timestamp: Date.now()
        });

        this.emit('actionQueued', action);

        if (!this.isProcessing) {
            await this.processQueue();
        }
    }

    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.actionQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        try {
            while (this.actionQueue.length > 0) {
                const action = this.actionQueue[0];
                await this.processAction(action);
                this.actionQueue.shift();
            }
        } catch (error) {
            await this.telemetry.logError('queue_processing_error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                queueLength: this.actionQueue.length,
                timestamp: Date.now()
            });
        } finally {
            this.isProcessing = false;
        }
    }

    private async processAction(action: Action): Promise<void> {
        try {
            action.state = ActionState.Processing;
            this.emit('actionStarted', action);

            // Update quantum state
            await this.quantumManager.evolveState(action.duration || 1000);

            // Process consciousness impact
            await this.consciousnessTracker.processActionImpact(action);

            // Handle specific action types
            switch (action.type) {
                case ActionType.Evolution:
                    await this.handleEvolutionAction(action);
                    break;
                case ActionType.Interaction:
                    await this.handleInteractionAction(action);
                    break;
                case ActionType.Learning:
                    await this.handleLearningAction(action);
                    break;
                case ActionType.Resonance:
                    await this.handleResonanceAction(action);
                    break;
                default:
                    throw new Error(`Unknown action type: ${action.type}`);
            }

            action.state = ActionState.Completed;
            this.emit('actionCompleted', action);

        } catch (error) {
            action.state = ActionState.Failed;
            action.error = error instanceof Error ? error.message : 'Action processing failed';
            this.emit('actionFailed', action);

            await this.telemetry.logError('action_processing_error', {
                actionType: action.type,
                error: action.error,
                timestamp: Date.now()
            });

            throw error;
        }
    }

    private async handleEvolutionAction(action: Action): Promise<void> {
        const evolutionFactor = action.params?.evolutionFactor || 1.0;
        await this.quantumManager.evolveState(action.duration || 1000);
        await this.consciousnessTracker.processEvolution(evolutionFactor);
    }

    private async handleInteractionAction(action: Action): Promise<void> {
        const interactionStrength = action.params?.strength || 1.0;
        await this.consciousnessTracker.processInteraction({
            strength: interactionStrength,
            duration: action.duration || 1000,
            type: action.params?.interactionType
        });
    }

    private async handleLearningAction(action: Action): Promise<void> {
        const learningRate = action.params?.learningRate || 0.1;
        await this.consciousnessTracker.processLearning({
            rate: learningRate,
            pattern: action.params?.pattern,
            duration: action.duration || 1000
        });
    }

    private async handleResonanceAction(action: Action): Promise<void> {
        const resonanceFrequency = action.params?.frequency || 1.0;
        await this.quantumManager.maintainCoherence();
        await this.consciousnessTracker.processResonance({
            frequency: resonanceFrequency,
            amplitude: action.params?.amplitude || 1.0,
            duration: action.duration || 1000
        });
    }

    public getQueueStatus(): {
        isProcessing: boolean;
        queueLength: number;
        currentAction?: Action;
    } {
        return {
            isProcessing: this.isProcessing,
            queueLength: this.actionQueue.length,
            currentAction: this.actionQueue[0]
        };
    }

    public clearQueue(): void {
        this.actionQueue = [];
        this.emit('queueCleared');
    }
}