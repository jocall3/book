export interface FiscalAbsurdity {
  id: string;
  year: number;
  title: string;
  description: string;
  absurdityRating: number; // 1-10 scale
  sourceReference: string;
  tags: string[];
}

export class HumorVault {
  private vault: Map<string, FiscalAbsurdity>;

  constructor() {
    this.vault = new Map<string, FiscalAbsurdity>();
  }

  /**
   * Adds a new fiscal absurdity to the vault.
   */
  public store(absurdity: FiscalAbsurdity): void {
    this.vault.set(absurdity.id, absurdity);
  }

  /**
   * Retrieves a specific absurdity by ID.
   */
  public getById(id: string): FiscalAbsurdity | undefined {
    return this.vault.get(id);
  }

  /**
   * Retrieves all absurdities filtered by year.
   */
  public getByYear(year: number): FiscalAbsurdity[] {
    return Array.from(this.vault.values()).filter((item) => item.year === year);
  }

  /**
   * Returns all stored absurdities.
   */
  public getAll(): FiscalAbsurdity[] {
    return Array.from(this.vault.values());
  }

  /**
   * Removes an entry from the vault.
   */
  public remove(id: string): boolean {
    return this.vault.delete(id);
  }

  /**
   * Returns the total count of absurdities in the vault.
   */
  public get count(): number {
    return this.vault.size;
  }

  /**
   * Finds absurdities with a rating above a certain threshold.
   */
  public getHighAbsurdityEntries(threshold: number): FiscalAbsurdity[] {
    return Array.from(this.vault.values()).filter(
      (item) => item.absurdityRating >= threshold
    );
  }
}

export const globalHumorVault = new HumorVault();