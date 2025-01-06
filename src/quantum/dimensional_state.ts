import { DimensionalState } from './types';

export class DimensionalStateImpl implements DimensionalState {
  public frequency: number;
  public resonance: number;
  public stability: number;
  public syncLevel: number;
  public quantumAlignment: number;
  public dimensionalFrequency: number;
  public entropyLevel: number;
  public phaseCoherence: number;
  private lastUpdate: number;
  private readonly DEGRADATION_RATE = 0.995;

  constructor() {
    this.frequency = 0.0;
    this.resonance = 1.0;
    this.stability = 1.0;
    this.syncLevel = 1.0;
    this.quantumAlignment = 1.0;
    this.dimensionalFrequency = 0.0;
    this.entropyLevel = 0.0;
    this.phaseCoherence = 1.0;
    this.lastUpdate = Date.now();
  }

  calculateResonance(): number {
    this.applyTimeDegradation();
    
    const baseResonance = this.resonance * this.stability;
    const alignmentFactor = this.quantumAlignment * this.syncLevel;
    const entropyModifier = 1.0 - (this.entropyLevel * 0.5);
    const coherenceBoost = this.phaseCoherence * 0.2;
    const timeFactor = Math.exp(-this.getTimeSinceLastUpdate() / 10000);
    
    return Math.min(1.0, Math.max(0.0, 
      ((baseResonance + alignmentFactor) / 2.0 * entropyModifier + coherenceBoost) * timeFactor
    ));
  }
  
  updateStability(interactionStrength: number): void {
    this.applyTimeDegradation();

    const timeBonus = Math.max(0, 1 - this.getTimeSinceLastUpdate() / 5000);
    const effectiveStrength = interactionStrength * timeBonus;

    this.stability = Math.min(1.0, Math.max(0.0, 
      this.stability + effectiveStrength
    ));
    this.quantumAlignment = Math.min(1.0,
      this.quantumAlignment + effectiveStrength * 0.5
    );
    this.syncLevel = Math.min(1.0,
      this.syncLevel + effectiveStrength * 0.3
    );
    this.dimensionalFrequency = Math.min(1.0,
      this.dimensionalFrequency + effectiveStrength * 0.2
    );
    
    // Update entropy and phase coherence with time factor
    this.entropyLevel = Math.max(0.0,
      this.entropyLevel - effectiveStrength * 0.1
    );
    this.phaseCoherence = Math.min(1.0,
      this.phaseCoherence + effectiveStrength * 0.4
    );

    this.lastUpdate = Date.now();
  }
  
  getStabilityMetrics(): [number, number, number] {
    this.applyTimeDegradation();
    return [this.stability, this.quantumAlignment, this.phaseCoherence];
  }

  private getTimeSinceLastUpdate(): number {
    return Date.now() - this.lastUpdate;
  }

  private applyTimeDegradation(): void {
    const timePassed = this.getTimeSinceLastUpdate();
    if (timePassed > 1000) { // Only degrade if more than 1 second has passed
      const degradationFactor = Math.pow(this.DEGRADATION_RATE, timePassed / 1000);
      
      this.stability *= degradationFactor;
      this.quantumAlignment *= degradationFactor;
      this.syncLevel *= degradationFactor;
      this.phaseCoherence *= degradationFactor;
      
      // Entropy increases over time
      this.entropyLevel = Math.min(1.0, 
        this.entropyLevel + (1 - degradationFactor) * 0.1
      );

      this.lastUpdate = Date.now();
    }
  }

  getQuantumStatus(): 'stable' | 'unstable' | 'critical' {
    const metrics = this.getStabilityMetrics();
    const avgMetric = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    
    if (avgMetric > 0.7) return 'stable';
    if (avgMetric > 0.3) return 'unstable';
    return 'critical';
  }
}