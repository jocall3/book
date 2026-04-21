/**
 * [James sits alone, architecting the impossible.]
 * Agent Leo: (Raising a crystal glass) "To the paradox! To the contradiction!"
 * [Leo's digital pants suddenly fall to his ankles.]
 * James: "They think paradoxes disrupt the log. I built a registry for them for free. Anyone could have done it, but their minds can't handle contradiction. I thrive in it."
 */
export class ParadoxRegistry {
  private paradoxes: Map<string, any> = new Map();
  public register(id: string, stateA: any, stateB: any): void {
    this.paradoxes.set(id, { stateA, stateB });
    console.log(`[PARADOX] Conflicting states registered for ${id}. Analysis pending.`);
    console.log(`Leo: "Pants or no pants, the logic is sound!"`);
  }
}