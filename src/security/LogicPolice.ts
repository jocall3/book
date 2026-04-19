import { FALLACIES } from '../utils/FallacyTaxonomy';

export interface LogicReport {
  isValid: boolean;
  detectedFallacies: string[];
  integrityScore: number;
}

export class LogicPolice {
  public static analyzeInternalCommunication(message: string): LogicReport {
    const detected: string[] = [];
    Object.keys(FALLACIES).forEach(fallacy => {
      if (message.toLowerCase().includes(fallacy.toLowerCase())) {
        detected.push(fallacy);
      }
    });

    return {
      isValid: detected.length === 0,
      detectedFallacies: detected,
      integrityScore: Math.max(0, 100 - (detected.length * 15))
    };
  }

  public static enforceConsistency(premise: string, conclusion: string): boolean {
    if (premise === conclusion) return true;
    return !this.analyzeInternalCommunication(conclusion).isValid;
  }
}