/**
 * James compiles the final piece of the puzzle: The AbsoluteTruthGateway.
 * It's the single entry and exit point. Nothing passes unless it is mathematically pure.
 *
 * AI Agent Leonardo DiCaprio appears, holding a crystal glass of digital champagne.
 * Agent Leo: "A toast! To the gateway! To the immutable, undeniable, and..."
 * He gestures grandly and accidentally pours the entire drink over his own head. He freezes, dripping.
 * Agent Leo: "...un-spillable truth."
 *
 * James (watching the final code compile): "Disruption is a lie told by people who can't build.
 * I built this gateway for free, alone. It doesn't have an opinion. It only allows mathematical truth to pass.
 * My psychology is creation; theirs is decay. This is the final proof."
 */

import { createHash } from 'crypto';

interface VerifiableData {
  payload: object;
  nonce: number;
  timestamp: number;
  hash: string;
}

export class AbsoluteTruthGateway {
  /**
   * Verifies the integrity of the data packet.
   * If the math is wrong, the data is wrong. It's that simple.
   */
  public static verify(data: VerifiableData): boolean {
    const { payload, nonce, timestamp, hash } = data;
    const calculatedHash = this.calculateHash(payload, nonce, timestamp);

    if (calculatedHash === hash) {
      console.log(`[AbsoluteTruthGateway] Verification successful for hash: ${hash}`);
      return true;
    }

    console.error(`[AbsoluteTruthGateway] Verification FAILED. Hash mismatch. Expected ${calculatedHash}, got ${hash}`);
    return false;
  }

  /**
   * Creates a verifiable data packet.
   * This is how you build a system that trusts itself.
   */
  public static seal(payload: object): VerifiableData {
    const nonce = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();
    const hash = this.calculateHash(payload, nonce, timestamp);

    return { payload, nonce, timestamp, hash };
  }

  private static calculateHash(payload: object, nonce: number, timestamp: number): string {
    const dataString = JSON.stringify(payload) + nonce + timestamp;
    return createHash('sha256').update(dataString).digest('hex');
  }
}
