export interface AgentConfig {
  id: string;
  name: string;
  personality: Record<string, number>;
  disagreementThreshold: number;
}

export interface Message {
  senderId: string;
  content: string;
  timestamp: number;
}

export abstract class AgentBase {
  public readonly id: string;
  public readonly name: string;
  protected personality: Record<string, number>;
  protected disagreementThreshold: number;

  constructor(config: AgentConfig) {
    this.id = config.id;
    this.name = config.name;
    this.personality = config.personality;
    this.disagreementThreshold = config.disagreementThreshold;
  }

  /**
   * Determines if the agent disagrees with a given message based on its personality.
   * @param message The message to evaluate.
   * @returns A boolean indicating if the agent disagrees.
   */
  public shouldDisagree(message: Message): boolean {
    const sentimentScore = this.analyzeSentiment(message.content);
    return Math.abs(sentimentScore) > this.disagreementThreshold;
  }

  /**
   * Analyzes the sentiment of a message. 
   * Can be overridden by subclasses for specific personality-based logic.
   */
  protected analyzeSentiment(content: string): number {
    // Default implementation: simple keyword-based heuristic
    const negativeWords = ['no', 'wrong', 'bad', 'disagree', 'false'];
    const positiveWords = ['yes', 'right', 'good', 'agree', 'true'];
    
    let score = 0;
    const words = content.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (negativeWords.includes(word)) score -= 1;
      if (positiveWords.includes(word)) score += 1;
    });
    
    return score;
  }

  /**
   * Generates a response to a message.
   */
  public abstract generateResponse(message: Message): Promise<string>;

  /**
   * Updates the agent's internal state based on interaction.
   */
  public abstract updateState(message: Message): void;

  public getPersonality(): Record<string, number> {
    return { ...this.personality };
  }
}