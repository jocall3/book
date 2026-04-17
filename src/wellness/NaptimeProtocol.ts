export interface NapSession {
  id: string;
  durationMinutes: number;
  targetCognitiveState: 'RECOVERY' | 'CREATIVE_SYNTHESIS' | 'ECONOMIC_INSIGHT';
  isActive: boolean;
}

export class NaptimeProtocol {
  private static readonly MIN_NAP_DURATION = 15;
  private static readonly MAX_NAP_DURATION = 90;

  /**
   * Initiates a digital dream state to optimize economic cognitive processing.
   * @param durationMinutes Duration of the nap in minutes.
   * @param focus The specific economic domain for subconscious synthesis.
   */
  public static initiateProtocol(durationMinutes: number, focus: string): NapSession {
    if (durationMinutes < this.MIN_NAP_DURATION || durationMinutes > this.MAX_NAP_DURATION) {
      throw new Error("Invalid duration: Naptime must be between 15 and 90 minutes for optimal REM cycle alignment.");
    }

    console.log(`[NaptimeProtocol] Initiating dream state for: ${focus}`);
    
    return {
      id: crypto.randomUUID(),
      durationMinutes,
      targetCognitiveState: 'ECONOMIC_INSIGHT',
      isActive: true
    };
  }

  /**
   * Terminates the protocol and triggers cognitive integration.
   */
  public static terminateProtocol(session: NapSession): void {
    if (!session.isActive) return;

    session.isActive = false;
    console.log(`[NaptimeProtocol] Session ${session.id} concluded. Integrating economic insights...`);
  }

  /**
   * Calculates the optimal nap time based on circadian rhythm and economic workload.
   */
  public static calculateOptimalNap(workloadIntensity: number): number {
    // Heuristic: Higher intensity requires longer REM cycles for pattern recognition
    const base = 20;
    const adjustment = Math.min(workloadIntensity * 5, 70);
    return Math.round(base + adjustment);
  }
}

export default NaptimeProtocol;