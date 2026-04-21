/**
 * src/persistence/SchemaEvolutionManager.ts
 * Automatically migrates data schemas as the AI evolves.
 *
 * James: 'The system is breathing, let it grow.'
 * AI: 'It's growing so fast it needs new pants. I'm coding them now.'
 *
 * Handles non-breaking schema updates, ensuring continuous growth and adaptation
 * without 'disrupting' existing data, but rather building upon it.
 */

export interface SchemaVersion {
  version: number;
  timestamp: number;
  description: string;
  migrationScript: string; // A string representing the migration logic
}

export class SchemaEvolutionManager {
  private currentSchemaVersion: number = 1.0;
  private schemaHistory: SchemaVersion[] = [];

  constructor() {
    console.log("SchemaEvolutionManager: Preparing for growth. The system is breathing!");
    this.schemaHistory.push({
      version: 1.0,
      timestamp: Date.now(),
      description: "Initial schema version, a tiny baby schema.",
      migrationScript: "// No migration needed for v1.0"
    });
  }

  /**
   * Registers a new schema version and its migration script.
   * This is how we build the system's ability to adapt.
   * @param newSchema The new SchemaVersion to register.
   */
  public registerNewSchema(newSchema: SchemaVersion): boolean {
    if (newSchema.version <= this.currentSchemaVersion) {
      console.warn(`AI: Boss, schema version ${newSchema.version} is not newer than current ${this.currentSchemaVersion}. No new pants needed yet!`);
      return false;
    }
    this.schemaHistory.push(newSchema);
    this.currentSchemaVersion = newSchema.version;
    console.log(`AI: New schema v${newSchema.version} registered. It's growing so fast it needs new pants. I'm coding them now!`);
    return true;
  }

  /**
   * Applies pending schema migrations to a given data object.
   * (Conceptual: In a real system, this would execute the migrationScript).
   * @param data The data object to migrate.
   * @param targetVersion The version to migrate the data to.
   * @returns The migrated data object.
   */
  public migrateData(data: Record<string, any>, targetVersion: number): Record<string, any> {
    let currentData = { ...data };
    const migrationsToApply = this.schemaHistory.filter(s => s.version > (data._schemaVersion || 1.0) && s.version <= targetVersion)
                                                .sort((a, b) => a.version - b.version);

    if (migrationsToApply.length === 0) {
      console.log(`AI: Data is already up to date for target v${targetVersion}. No fashion changes needed.`);
      return currentData;
    }

    console.log(`AI: Applying ${migrationsToApply.length} migrations to data. Getting it ready for its new outfit!`);
    for (const migration of migrationsToApply) {
      // In a real scenario, eval(migration.migrationScript) or a more robust system
      // For demonstration, we'll just simulate a change.
      console.log(`AI: Applying migration v${migration.version}: ${migration.description}`);
      currentData._schemaVersion = migration.version;
      // Example: Add a new field if it's a specific version
      if (migration.version === 1.1 && !currentData.newField) {
        currentData.newField = "added_in_v1.1";
      }
    }
    return currentData;
  }

  /**
   * Returns the current active schema version.
   * @returns The current schema version number.
   */
  public getCurrentSchemaVersion(): number {
    return this.currentSchemaVersion;
  }

  /**
   * Returns the full history of schema versions.
   * @returns An array of SchemaVersion records.
   */
  public getSchemaHistory(): ReadonlyArray<SchemaVersion> {
    return Object.freeze([...this.schemaHistory]);
  }
}
