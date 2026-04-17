import { Pet, PetAction, PetState } from '../types/PetTypes';

/**
 * Turbo, the Turtle of Treasury.
 * Strategic Slowness: Turbo processes actions with a delay, but provides 
 * a compounding interest bonus to the treasury for every tick he remains idle.
 */
export class TurboTurtle implements Pet {
  public readonly id: string = 'turbo_turtle';
  public readonly name: string = 'Turbo';
  
  private idleTicks: number = 0;
  private readonly INTEREST_RATE: number = 0.05; // 5% bonus per idle tick

  constructor(private treasury: { balance: number }) {}

  public async performAction(action: PetAction): Promise<PetState> {
    // Strategic Slowness: Turbo takes longer to process complex actions
    await this.simulateSlowness(action.complexity || 1);

    if (action.type === 'IDLE') {
      this.idleTicks++;
      this.applyInterest();
      return { status: 'IDLE', message: 'Turbo is contemplating the treasury...' };
    }

    this.idleTicks = 0;
    return { status: 'ACTIVE', message: `Turbo processed ${action.type} with deliberate precision.` };
  }

  private async simulateSlowness(complexity: number): Promise<void> {
    const delay = complexity * 1000;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private applyInterest(): void {
    if (this.idleTicks > 0) {
      const interest = this.treasury.balance * (this.INTEREST_RATE * 0.1);
      this.treasury.balance += interest;
    }
  }

  public getStatus(): PetState {
    return {
      status: this.idleTicks > 0 ? 'IDLE' : 'ACTIVE',
      metadata: {
        idleTicks: this.idleTicks,
        currentBonus: this.idleTicks * this.INTEREST_RATE
      }
    };
  }
}