import { v4 as uuidv4 } from 'uuid';

export enum InstrumentType {
  EXISTENTIAL_DERIVATIVE = 'EXISTENTIAL_DERIVATIVE',
  METAPHYSICAL_SWAP = 'METAPHYSICAL_SWAP',
  TEMPORAL_OPTION = 'TEMPORAL_OPTION',
  ONTOLOGICAL_BOND = 'ONTOLOGICAL_BOND'
}

export interface FinancialInstrumentMetadata {
  riskProfile: 'VOID' | 'SINGULARITY' | 'HYPERBOLIC' | 'STABLE';
  volatilityIndex: number;
  creationTimestamp: number;
}

export abstract class FinancialInstrument {
  public readonly id: string;
  public readonly type: InstrumentType;
  public readonly metadata: FinancialInstrumentMetadata;
  protected value: number;

  constructor(type: InstrumentType, initialValue: number, riskProfile: FinancialInstrumentMetadata['riskProfile']) {
    this.id = uuidv4();
    this.type = type;
    this.value = initialValue;
    this.metadata = {
      riskProfile,
      volatilityIndex: Math.random() * 100,
      creationTimestamp: Date.now()
    };
  }

  public abstract calculateCurrentValue(): number;

  public getValue(): number {
    return this.calculateCurrentValue();
  }

  public getDetails(): object {
    return {
      id: this.id,
      type: this.type,
      currentValue: this.getValue(),
      metadata: this.metadata
    };
  }

  protected applyVolatility(baseValue: number): number {
    const drift = (Math.random() - 0.5) * this.metadata.volatilityIndex;
    return baseValue + drift;
  }
}