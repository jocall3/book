import { EventEmitter } from 'events';

/**
 * Interface for the result of an agent's security analysis.
 */
export interface SecurityAssessment {
  agentId: string;
  isMalicious: boolean;
  confidence: number;
  reasoning: string;
  timestamp: number;
}

/**
 * AdversarialSecurity system uses a consensus-based approach where multiple
 * independent security agents evaluate requests. Disagreement between agents
 * triggers a high-priority security audit.
 */
export class AdversarialSecurity extends EventEmitter {
  private agents: Set<string> = new Set();
  private threshold: number;

  /**
   * @param threshold The percentage of disagreement required to trigger an alert (0.0 to 1.0).
   */
  constructor(threshold: number = 0.3) {
    super();
    this.threshold = threshold;
  }

  public registerAgent(agentId: string): void {
    this.agents.add(agentId);
  }

  /**
   * Evaluates a set of assessments from different agents to detect potential fraud.
   * @param assessments Array of assessments from registered agents.
   * @returns boolean True if the system detects a security threat.
   */
  public evaluate(assessments: SecurityAssessment[]): boolean {
    if (assessments.length === 0) return false;

    const maliciousCount = assessments.filter((a) => a.isMalicious).length;
    const total = assessments.length;
    const maliciousRatio = maliciousCount / total;

    // Detect disagreement: If some agents flag as malicious and others don't,
    // or if the consensus is ambiguous based on the threshold.
    const isDisagreement = this.detectDisagreement(assessments);

    if (isDisagreement) {
      this.emit('security_disagreement', {
        assessments,
        message: 'Adversarial disagreement detected between security agents.',
      });
      return true;
    }

    // If there is no disagreement, we rely on the majority consensus
    return maliciousRatio >= 0.5;
  }

  /**
   * Logic to determine if agents are providing conflicting reports.
   */
  private detectDisagreement(assessments: SecurityAssessment[]): boolean {
    const hasMalicious = assessments.some((a) => a.isMalicious);
    const hasSafe = assessments.some((a) => !a.isMalicious);

    // If we have both malicious and safe reports, we have a fundamental disagreement
    if (hasMalicious && hasSafe) {
      return true;
    }

    // Check for confidence variance
    const confidences = assessments.map((a) => a.confidence);
    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    const variance = confidences.reduce((a, b) => a + Math.pow(b - avgConfidence, 2), 0) / confidences.length;

    return variance > this.threshold;
  }

  public getAgentCount(): number {
    return this.agents.size;
  }
}

export default AdversarialSecurity;