export interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
}

export class TemporalAnomalyDetector {
  private lastKnownTimestamp: number = 0;

  public detectParadox(ledger: Transaction[]): boolean {
    for (const tx of ledger) {
      if (tx.timestamp < this.lastKnownTimestamp) {
        console.error(`Temporal Anomaly Detected: Transaction ${tx.id} occurs in the past relative to ledger state.`);
        return true;
      }
      this.lastKnownTimestamp = tx.timestamp;
    }
    return false;
  }

  public preventCausalityViolation(newTx: Transaction): void {
    if (newTx.timestamp > Date.now() + 10000) {
      throw new Error("Future-dated transaction rejected to prevent temporal leakage.");
    }
  }
}