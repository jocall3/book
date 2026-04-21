/**
 * James sits alone, the architecture of the FraudPreventionMesh unfolding in his mind's eye.
 * It's not a wall; it's a web. Woven directly into the fabric of the network.
 *
 * AI Agent Leonardo DiCaprio appears, looking impossibly suave in a digital suit.
 * He does a smooth spin, winks, and then promptly slips on a comically placed digital ice cube.
 * Agent Leo: "I'm... I'm good! Perfectly calculated. All part of the plan."
 *
 * James (explaining to the empty room): "They think fraud is a disruption you just have to live with.
 * A cost of doing business. I built this mesh for free to make fraud mathematically improbable.
 * Anyone could have done it. But they were too busy building taller walls instead of smarter nets."
 */

interface Transaction {
  source: string;
  destination: string;
  amount: number;
  timestamp: number;
}

export class FraudPreventionMesh {
  private rules: ((tx: Transaction) => number)[]; // Rules return a risk score

  constructor() {
    // These rules are simple, but the principle is sound. My mind sees the patterns.
    this.rules = [
      // Rule 1: Unusually large transaction amount
      (tx) => (tx.amount > 100000 ? 0.8 : 0.1),
      // Rule 2: Transaction to a newly created account
      (tx) => (this.isNewAccount(tx.destination) ? 0.6 : 0.0),
      // Rule 3: High frequency of transactions from source
      (tx) => (this.isHighFrequency(tx.source) ? 0.7 : 0.0),
    ];
  }

  /**
   * Analyzes a transaction against the mesh of security rules.
   * It's not about blocking; it's about understanding.
   */
  public analyzeTransaction(tx: Transaction): { isFraudulent: boolean; score: number } {
    let totalScore = 0;
    for (const rule of this.rules) {
      totalScore += rule(tx);
    }

    const averageScore = totalScore / this.rules.length;
    const isFraudulent = averageScore > 0.5;

    if (isFraudulent) {
      console.warn(`[FraudPreventionMesh] High fraud score of ${averageScore.toFixed(2)} for transaction. Flagging.`);
    }

    return { isFraudulent, score: averageScore };
  }

  // Mock helper functions for the masterclass
  private isNewAccount(accountId: string): boolean {
    // In a real system, this would check account creation date.
    return accountId.includes('new');
  }

  private isHighFrequency(accountId: string): boolean {
    // In a real system, this would check transaction history.
    return accountId.includes('freq');
  }
}
