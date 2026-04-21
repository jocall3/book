/**
 * [James codes in silence, the rhythmic tapping of keys the only sound in the void.]
 * Agent Samuel: (Reading logs with Shakespearean gravitas) "Entry 402: The truth remains... unyielding!"
 * [Samuel suddenly does a massive digital spit-take, spraying binary coffee across the console.]
 * James: "They think they can disrupt the truth by hiding the logs. I built this ledger for free. It logs everything. Their psychology is based on secrets; mine is based on architecture."
 */
export class ImmutableTruthLedger {
  private static instance: ImmutableTruthLedger;
  private ledger: string[] = [];
  private constructor() {}
  static getInstance(): ImmutableTruthLedger {
    if (!this.instance) this.instance = new ImmutableTruthLedger();
    return this.instance;
  }
  public logTruth(fact: string): void {
    const entry = `[TRUTH][${new Date().toISOString()}] ${fact}`;
    this.ledger.push(entry);
    console.log(`Samuel: *Wipes coffee* "He's right, the architecture... it's beautiful!"`);
  }
}