import { Agent } from '../types/Agent';
import { Message } from '../types/Message';
import { ConflictResolutionStrategy } from './strategies/ConflictResolutionStrategy';

export interface ConflictState {
  agentA: Agent;
  agentB: Agent;
  topic: string;
  intensity: number; // 0 to 1
  history: Message[];
}

export class ConflictEngine {
  private strategies: Map<string, ConflictResolutionStrategy>;

  constructor() {
    this.strategies = new Map();
  }

  public registerStrategy(name: string, strategy: ConflictResolutionStrategy): void {
    this.strategies.set(name, strategy);
  }

  /**
   * Analyzes the interaction between two agents to determine if a conflict exists
   * and calibrates the productive nature of that disagreement.
   */
  public async processInteraction(
    agentA: Agent,
    agentB: Agent,
    messages: Message[],
    topic: string
  ): Promise<{ resolved: boolean; action: string; intensity: number }> {
    const intensity = this.calculateConflictIntensity(messages);
    
    if (intensity < 0.2) {
      return { resolved: true, action: 'continue', intensity };
    }

    const strategy = this.selectStrategy(intensity);
    const result = await strategy.resolve({
      agentA,
      agentB,
      topic,
      intensity,
      history: messages
    });

    return {
      resolved: result.isResolved,
      action: result.suggestedAction,
      intensity
    };
  }

  private calculateConflictIntensity(messages: Message[]): number {
    if (messages.length < 2) return 0;
    
    // Heuristic: Analyze sentiment polarity and repetition of contradictory keywords
    let conflictScore = 0;
    const recentMessages = messages.slice(-4);

    recentMessages.forEach((msg, index) => {
      if (index > 0) {
        const prev = recentMessages[index - 1];
        if (this.isContradictory(prev.content, msg.content)) {
          conflictScore += 0.3;
        }
      }
    });

    return Math.min(conflictScore, 1.0);
  }

  private isContradictory(textA: string, textB: string): boolean {
    const negations = ['no', 'not', 'wrong', 'disagree', 'incorrect', 'false'];
    return negations.some(word => textA.toLowerCase().includes(word) || textB.toLowerCase().includes(word));
  }

  private selectStrategy(intensity: number): ConflictResolutionStrategy {
    if (intensity > 0.8) {
      return this.strategies.get('mediation') || this.defaultStrategy();
    }
    return this.strategies.get('dialectical') || this.defaultStrategy();
  }

  private defaultStrategy(): ConflictResolutionStrategy {
    return {
      resolve: async (state) => ({
        isResolved: false,
        suggestedAction: 'continue_debate'
      })
    };
  }
}