import { DimensionalState, ResonancePattern } from './types';

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
  private readonly BASE_DEGRADATION_RATE = 0.995;
  private readonly PATTERN_COHERENCE_THRESHOLD = 0.7;
  private readonly MAX_ENTROPY_INCREASE = 0.2;
  private readonly MIN_INTERACTION_THRESHOLD = 0.1;

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
    this.applyQuantumDegradation();
    
    const baseResonance = this.resonance * this.stability;
    const alignmentFactor = this.quantumAlignment * this.syncLevel;
    const entropyModifier = this.calculateEntropyModifier();
    const coherenceBoost = this.calculateCoherenceBoost();
    const temporalFactor = this.calculateTemporalFactor();
    
    // Apply non-linear quantum effects while preserving original behavior
    const quantumEffect = Math.sin(this.dimensionalFrequency * Math.PI) * 0.1;
    
    return Math.min(1.0, Math.max(0.0,
      ((baseResonance + alignmentFactor) / 2.0 * entropyModifier + coherenceBoost) * 
      temporalFactor + quantumEffect
    ));
  }

  private calculateEntropyModifier(): number {
    const baseEntropy = 1.0 - (this.entropyLevel * 0.5);
    const quantumEntropy = Math.cos(this.dimensionalFrequency * Math.PI) * 0.1;
    return Math.max(0.1, baseEntropy + quantumEntropy);
  }

  private calculateCoherenceBoost(): number {
    const baseBoost = this.phaseCoherence * 0.2;
    const resonanceBoost = Math.sin(this.resonance * Math.PI) * 0.1;
    return baseBoost + resonanceBoost;
  }

  private calculateTemporalFactor(): number {
    const timeDelta = this.getTimeSinceLastUpdate();
    const dilationFactor = 1 + (this.dimensionalFrequency * 0.1);
    return Math.exp(-timeDelta / (10000 * dilationFactor));
  }

  updateStability(interactionStrength: number): void {
    this.applyQuantumDegradation();

    const timeBonus = Math.max(0, 1 - this.getTimeSinceLastUpdate() / 5000);
    const effectiveStrength = interactionStrength * timeBonus;

    // Enhanced stability updates with quantum considerations
    this.stability = Math.min(1.0, Math.max(0.0, 
      this.stability + effectiveStrength * (1 + this.dimensionalFrequency * 0.1)
    ));
    
    this.quantumAlignment = Math.min(1.0,
      this.quantumAlignment + effectiveStrength * 0.5 * (1 - this.entropyLevel * 0.2)
    );
    
    this.syncLevel = Math.min(1.0,
      this.syncLevel + effectiveStrength * 0.3 * (1 + this.phaseCoherence * 0.1)
    );
    
    this.dimensionalFrequency = Math.min(1.0,
      this.dimensionalFrequency + effectiveStrength * 0.2
    );
    
    // Enhanced entropy and phase coherence updates
    this.entropyLevel = Math.max(0.0,
      this.entropyLevel - effectiveStrength * 0.1 * (1 + this.quantumAlignment * 0.1)
    );
    
    this.phaseCoherence = Math.min(1.0,
      this.phaseCoherence + effectiveStrength * 0.4 * (1 - this.entropyLevel * 0.1)
    );

    this.lastUpdate = Date.now();
  }

  private applyQuantumDegradation(): void {
    const timePassed = this.getTimeSinceLastUpdate();
    if (timePassed > 1000) {
      const degradationFactor = this.calculateDegradationFactor(timePassed);
      
      // Apply non-linear degradation while preserving stability
      this.stability *= degradationFactor;
      this.quantumAlignment *= degradationFactor * (1 + this.dimensionalFrequency * 0.1);
      this.syncLevel *= degradationFactor * (1 - this.entropyLevel * 0.1);
      this.phaseCoherence *= degradationFactor * (1 + this.resonance * 0.1);
      
      // Enhanced entropy evolution
      this.evolveEntropy(degradationFactor);

      this.lastUpdate = Date.now();
    }
  }

  private calculateDegradationFactor(timePassed: number): number {
    const baseDegradation = Math.pow(this.BASE_DEGRADATION_RATE, timePassed / 1000);
    const quantumFactor = 1 + (Math.sin(this.dimensionalFrequency * Math.PI) * 0.05);
    return baseDegradation * quantumFactor;
  }

  private evolveEntropy(degradationFactor: number): void {
    const entropyIncrease = (1 - degradationFactor) * this.MAX_ENTROPY_INCREASE;
    const quantumEntropy = Math.sin(this.dimensionalFrequency * Math.PI) * 0.05;
    
    this.entropyLevel = Math.min(1.0,
      this.entropyLevel + entropyIncrease + quantumEntropy
    );
  }

  getStabilityMetrics(): [number, number, number] {
    this.applyQuantumDegradation();
    
    const baseMetrics = [this.stability, this.quantumAlignment, this.phaseCoherence];
    const quantumInfluence = Math.sin(this.dimensionalFrequency * Math.PI) * 0.1;
    
    return baseMetrics.map(metric => 
      Math.min(1.0, Math.max(0.0, metric + quantumInfluence))
    ) as [number, number, number];
  }

  private getTimeSinceLastUpdate(): number {
    return Date.now() - this.lastUpdate;
  }

  async emergencyRecovery(): Promise<boolean> {
    const currentStatus = this.getQuantumStatus();
    if (currentStatus === 'critical') {
      // Attempt quantum state restoration while preserving patterns
      this.stability = Math.max(0.3, this.stability);
      this.quantumAlignment = Math.max(0.3, this.quantumAlignment);
      this.syncLevel = Math.max(0.3, this.syncLevel);
      this.phaseCoherence = Math.max(0.3, this.phaseCoherence);
      this.entropyLevel = Math.min(0.7, this.entropyLevel);
      
      return true;
    }
    return false;
  }

  getQuantumStatus(): 'stable' | 'unstable' | 'critical' {
    const metrics = this.getStabilityMetrics();
    const avgMetric = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    const entropyFactor = 1 - this.entropyLevel;
    const effectiveMetric = avgMetric * entropyFactor;
    
    if (effectiveMetric > 0.7) return 'stable';
    if (effectiveMetric > 0.3) return 'unstable';
    return 'critical';
  }

  checkPatternResonance(pattern: ResonancePattern): boolean {
    const timeDecay = Math.exp(-(Date.now() - pattern.timestamp) / 10000);
    const coherenceCheck = pattern.coherence * timeDecay > this.PATTERN_COHERENCE_THRESHOLD;
    const frequencyMatch = Math.abs(pattern.frequency - this.dimensionalFrequency) < 0.2;
    
    return coherenceCheck && frequencyMatch;
  }
}