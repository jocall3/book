export enum GeraldMood {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  CONCERNED = 'concerned',
  EXCITED = 'excited',
  ERROR = 'error'
}

export interface GeraldMessage {
  text: string;
  mood: GeraldMood;
}

export class Gerald {
  private name: string = "Gerald";
  private currentMood: GeraldMood = GeraldMood.NEUTRAL;

  /**
   * Analyzes spreadsheet data conditions to determine Gerald's response.
   * @param value The cell value being evaluated
   * @param condition The conditional formatting rule applied
   */
  public evaluateCell(value: number | string, condition: string): GeraldMessage {
    if (typeof value === 'number') {
      return this.handleNumericEvaluation(value, condition);
    }
    return this.handleTextEvaluation(value, condition);
  }

  private handleNumericEvaluation(value: number, condition: string): GeraldMessage {
    if (value < 0) {
      this.currentMood = GeraldMood.ERROR;
      return {
        text: `Oh dear, we're in the red! ${value} is looking a bit precarious.`,
        mood: this.currentMood
      };
    }

    if (value > 1000) {
      this.currentMood = GeraldMood.EXCITED;
      return {
        text: `Wow! ${value} is a massive number! We're really growing!`,
        mood: this.currentMood
      };
    }

    this.currentMood = GeraldMood.HAPPY;
    return {
      text: `Everything looks balanced at ${value}. Keep up the great work!`,
      mood: this.currentMood
    };
  }

  private handleTextEvaluation(value: string, condition: string): GeraldMessage {
    if (value.length === 0) {
      this.currentMood = GeraldMood.CONCERNED;
      return {
        text: "I noticed an empty cell. Shall we fill it in?",
        mood: this.currentMood
      };
    }

    this.currentMood = GeraldMood.NEUTRAL;
    return {
      text: `I see you've entered "${value}". Interesting choice!`,
      mood: this.currentMood
    };
  }

  public getMood(): GeraldMood {
    return this.currentMood;
  }

  public getName(): string {
    return this.name;
  }
}

export const geraldInstance = new Gerald();