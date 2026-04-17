import { Transaction, LedgerEntry, FiscalAnomaly } from '../types/FiscalTypes';

/**
 * LogicPolice: Guardians of fiscal fidelity.
 * Responsible for auditing ledger entries and transactions to ensure
 * mathematical integrity and logical consistency.
 */
export class LogicPolice {
  /**
   * Validates that a transaction's debits equal its credits.
   * @param transaction The transaction to audit.
   * @returns An array of anomalies found, or an empty array if valid.
   */
  public static auditTransactionBalance(transaction: Transaction): FiscalAnomaly[] {
    const anomalies: FiscalAnomaly[] = [];
    
    const totalDebits = transaction.entries
      .filter((entry) => entry.amount > 0)
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalCredits = transaction.entries
      .filter((entry) => entry.amount < 0)
      .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.0001) {
      anomalies.push({
        code: 'IMBALANCED_TRANSACTION',
        message: `Transaction ${transaction.id} is imbalanced: Debits (${totalDebits}) != Credits (${totalCredits})`,
        severity: 'CRITICAL',
        timestamp: new Date(),
      });
    }

    return anomalies;
  }

  /**
   * Detects temporal inconsistencies in a sequence of ledger entries.
   * @param entries A sorted array of ledger entries.
   */
  public static detectTemporalInconsistencies(entries: LedgerEntry[]): FiscalAnomaly[] {
    const anomalies: FiscalAnomaly[] = [];

    for (let i = 1; i < entries.length; i++) {
      if (entries[i].timestamp < entries[i - 1].timestamp) {
        anomalies.push({
          code: 'CHRONOLOGICAL_VIOLATION',
          message: `Entry ${entries[i].id} occurs before its predecessor ${entries[i - 1].id}`,
          severity: 'HIGH',
          timestamp: new Date(),
        });
      }
    }

    return anomalies;
  }

  /**
   * Ensures that no account balance violates business constraints (e.g., negative cash).
   * @param accountId The ID of the account.
   * @param currentBalance The current calculated balance.
   * @param allowNegative Whether the account is permitted to go negative.
   */
  public static validateAccountConstraints(
    accountId: string,
    currentBalance: number,
    allowNegative: boolean = false
  ): FiscalAnomaly | null {
    if (!allowNegative && currentBalance < 0) {
      return {
        code: 'NEGATIVE_BALANCE_VIOLATION',
        message: `Account ${accountId} has reached a negative balance of ${currentBalance}`,
        severity: 'HIGH',
        timestamp: new Date(),
      };
    }
    return null;
  }

  /**
   * Performs a comprehensive audit of a batch of transactions.
   */
  public static auditBatch(transactions: Transaction[]): FiscalAnomaly[] {
    return transactions.flatMap((tx) => this.auditTransactionBalance(tx));
  }
}