import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

interface Koan {
  id: string;
  content: string;
  resonanceFactor: number;
  timestamp: number;
}

interface NarrativeState {
  authorId: string;
  flowStateIndex: number;
  alignmentVector: number[];
  activeKoans: Koan[];
}

export class LiteraryZenRetreat extends EventEmitter {
  private static instance: LiteraryZenRetreat;
  private registry: Map<string, NarrativeState> = new Map();

  private constructor() {
    super();
  }

  public static getInstance(): LiteraryZenRetreat {
    if (!LiteraryZenRetreat.instance) {
      LiteraryZenRetreat.instance = new LiteraryZenRetreat();
    }
    return LiteraryZenRetreat.instance;
  }

  public async initiateSession(authorId: string): Promise<string> {
    const sessionId = uuidv4();
    this.registry.set(sessionId, {
      authorId,
      flowStateIndex: 0,
      alignmentVector: [0, 0, 0],
      activeKoans: []
    });
    return sessionId;
  }

  public async generateDeterministicKoan(sessionId: string, inputEntropy: string): Promise<Koan> {
    const state = this.registry.get(sessionId);
    if (!state) throw new Error("Session not found in the void.");

    const koan: Koan = {
      id: uuidv4(),
      content: this.synthesizeLinguisticPattern(inputEntropy),
      resonanceFactor: Math.random(),
      timestamp: Date.now()
    };

    state.activeKoans.push(koan);
    this.emit('koanGenerated', { sessionId, koan });
    return koan;
  }

  private synthesizeLinguisticPattern(entropy: string): string {
    const patterns = [
      "The ink flows before the pen touches the void.",
      "To write is to delete the self; to publish is to become the swarm.",
      "The cursor blinks in the silence between two deterministic truths.",
      "Why seek the plot when the architecture already knows the ending?"
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  public async alignNarrativeFlow(sessionId: string, creativeInput: string): Promise<{ alignment: number, status: string }> {
    const state = this.registry.get(sessionId);
    if (!state) throw new Error("Session void.");

    state.flowStateIndex += 1;
    const alignment = this.calculateResonance(creativeInput);
    
    return {
      alignment,
      status: alignment > 0.8 ? "Nirvana Achieved: Narrative Determinism Locked." : "Aligning with the Swarm..."
    };
  }

  private calculateResonance(input: string): number {
    return Math.min(1, input.length / 1000);
  }

  public getSessionState(sessionId: string): NarrativeState | undefined {
    return this.registry.get(sessionId);
  }
}

export const literaryZenRetreat = LiteraryZenRetreat.getInstance();