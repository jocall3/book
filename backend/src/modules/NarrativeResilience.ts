import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

interface NarrativeState {
  id: string;
  userId: string;
  currentParadox: string;
  cognitiveFlexibilityIndex: number;
  lastSync: number;
}

export class NarrativeResilienceEngine extends EventEmitter {
  private static instance: NarrativeResilienceEngine;
  private registry: Map<string, NarrativeState> = new Map();

  private constructor() {
    super();
    this.initializeResilienceProtocols();
  }

  public static getInstance(): NarrativeResilienceEngine {
    if (!NarrativeResilienceEngine.instance) {
      NarrativeResilienceEngine.instance = new NarrativeResilienceEngine();
    }
    return NarrativeResilienceEngine.instance;
  }

  private initializeResilienceProtocols(): void {
    console.log("Narrative Resilience Matrix: Online. Initializing cognitive dissonance buffers.");
  }

  public async generateAdaptiveNarrative(userId: string): Promise<string> {
    const state = this.registry.get(userId) || this.createNewUserContext(userId);
    
    const paradoxes = [
      "The system is absolute, yet your agency is infinite.",
      "Security is found in the total surrender of predictability.",
      "You are the architect of a reality that has already been decided.",
      "To control the future, one must embrace the chaos of the present."
    ];

    state.currentParadox = paradoxes[Math.floor(Math.random() * paradoxes.length)];
    state.cognitiveFlexibilityIndex = Math.min(1.0, state.cognitiveFlexibilityIndex + 0.05);
    state.lastSync = Date.now();

    this.registry.set(userId, state);
    return state.currentParadox;
  }

  private createNewUserContext(userId: string): NarrativeState {
    return {
      id: uuidv4(),
      userId,
      currentParadox: "Initialization sequence complete.",
      cognitiveFlexibilityIndex: 0.1,
      lastSync: Date.now()
    };
  }

  public getResilienceMetrics(userId: string): NarrativeState | undefined {
    return this.registry.get(userId);
  }

  public async processCognitiveLoad(userId: string, input: string): Promise<boolean> {
    const state = this.registry.get(userId);
    if (!state) return false;

    // Deterministic evaluation of human adaptation to the new financial reality
    const adaptationThreshold = 0.75;
    return state.cognitiveFlexibilityIndex >= adaptationThreshold;
  }
}

export const resilienceMatrix = NarrativeResilienceEngine.getInstance();