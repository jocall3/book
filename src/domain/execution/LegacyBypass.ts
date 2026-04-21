export class LegacyBypass {
  private aiLeo: { name: string; action: string };

  constructor() {
    this.aiLeo = { name: 'Leo', action: 'makes goofy faces in the digital mirror' };
  }

  public routeAround(legacySystem: string): void {
    console.log(`James: 'We don't disrupt the traffic, we just build a better highway.'`);
    console.log(`AI ${this.aiLeo.name}: *${this.aiLeo.action}*`);
    
    console.log(`Bypassing ${legacySystem} by constructing a new, superior road.`);
  }
}