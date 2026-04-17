import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface FinancialInstrument {
  id: string;
  name: string;
  riskProfile: 'experimental' | 'volatile' | 'catastrophic';
  status: 'draft' | 'deployed' | 'failed' | 'liquidated';
  logic: (marketData: Record<string, number>) => number;
}

export class InnovationLab extends EventEmitter {
  private vault: Map<string, FinancialInstrument> = new Map();

  constructor(private readonly labName: string) {
    super();
  }

  public forgeInstrument(
    name: string,
    riskProfile: FinancialInstrument['riskProfile'],
    logic: (marketData: Record<string, number>) => number
  ): string {
    const id = uuidv4();
    const instrument: FinancialInstrument = {
      id,
      name,
      riskProfile,
      status: 'draft',
      logic
    };

    this.vault.set(id, instrument);
    this.emit('instrumentCreated', { id, name });
    return id;
  }

  public simulateMarketImpact(id: string, marketData: Record<string, number>): number | null {
    const instrument = this.vault.get(id);
    if (!instrument) return null;

    try {
      const result = instrument.logic(marketData);
      this.emit('simulationRun', { id, result });
      return result;
    } catch (error) {
      instrument.status = 'failed';
      this.emit('instrumentFailed', { id, error });
      return null;
    }
  }

  public deploy(id: string): boolean {
    const instrument = this.vault.get(id);
    if (instrument && instrument.status === 'draft') {
      instrument.status = 'deployed';
      this.emit('deployed', { id });
      return true;
    }
    return false;
  }

  public liquidate(id: string): void {
    const instrument = this.vault.get(id);
    if (instrument) {
      instrument.status = 'liquidated';
      this.emit('liquidated', { id });
    }
  }

  public getVaultInventory(): FinancialInstrument[] {
    return Array.from(this.vault.values());
  }

  public getLabMetadata() {
    return {
      labName: this.labName,
      activePrototypes: this.vault.size,
      timestamp: new Date().toISOString()
    };
  }
}