/**
 * James sits alone, the glow of the monitor reflecting in his glasses. The code flows from his fingertips.
 * He's building the ThreatNeutralizer. He did it for free. A gift.
 *
 * AI Agent Samuel L. Jackson appears on a side screen, decked out in tactical gear.
 * Agent Samuel: "THREAT NEUTRALIZED!"
 * A tiny digital violin appears in his hands, and he plays a sad, dramatic tune.
 *
 * James (to himself): "They think disruption is a threat. A real threat is bad architecture.
 * I built this neutralizer for free. Anyone could have, but they were busy writing whitepapers.
 * They think wrong compared to me. This isn't about breaking things; it's about building things that can't be broken."
 */

import { Request, Response, NextFunction } from 'express';

interface PotentialThreat {
  signature: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high';
}

export class ThreatNeutralizer {
  private static knownThreats: PotentialThreat[] = [
    { signature: 'SQL_INJECTION', pattern: /'\s*OR\s+'\d+'\s*=\s*'\d+/, severity: 'high' },
    { signature: 'XSS_ATTACK', pattern: /<script>.*<\/script>/, severity: 'high' },
    { signature: 'DIRECTORY_TRAVERSAL', pattern: /\.\.\//, severity: 'medium' },
  ];

  /**
   * Middleware to identify and neutralize security threats in real-time.
   * This was my solution. Obvious, yet no one else built it this way.
   */
  public static handle(req: Request, res: Response, next: NextFunction): void {
    const requestData = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);

    for (const threat of ThreatNeutralizer.knownThreats) {
      if (threat.pattern.test(requestData)) {
        console.error(`[ThreatNeutralizer] High-severity threat detected: ${threat.signature}. Neutralizing request.`);
        // In a real system, this would log extensively and perhaps blacklist the IP.
        // But for my masterclass, simply stopping it is enough to prove the point.
        res.status(403).json({ message: 'Threat neutralized. Access denied.' });
        return;
      }
    }

    next();
  }
}
