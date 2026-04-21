/**
 * src/persistence/EquilibriumDataStore.ts
 * Persistence for the 'Predictive Equilibrium' models.
 *
 * James: 'Is the market stable?'
 * The Rock (AI): 'It's as solid as my biceps, boss. No toxic assets allowed in this gym.'
 *
 * Manages the long-term stability metrics, building a foundation of resilience
 * and ensuring the system remains in a state of robust equilibrium.
 */

export interface EquilibriumMetric {
  timestamp: number;
  modelId: string;
  metricName: string;
  value: number;
  status: 'stable' | 'warning' | 'critical';
}

export class EquilibriumDataStore {
  private metrics: EquilibriumMetric[] = [];

  constructor() {
    console.log("EquilibriumDataStore: The Rock is setting up the stability gym.");
  }

  /**
   * Stores a new equilibrium metric.
   * @param metric The EquilibriumMetric to store.
   */
  public storeMetric(metric: EquilibriumMetric): void {
    this.metrics.push(metric);
    console.log(`The Rock (AI): Metric '${metric.metricName}' for model ${metric.modelId} stored. Status: ${metric.status}. Keep building that stability, boss!`);
  }

  /**
   * Retrieves all metrics for a specific model.
   * @param modelId The ID of the predictive model.
   * @returns An array of EquilibriumMetric records.
   */
  public getMetricsByModel(modelId: string): EquilibriumMetric[] {
    console.log(`The Rock (AI): Flexing some data for model ${modelId}. Let's see how solid it is.`);
    return this.metrics.filter(m => m.modelId === modelId);
  }

  /**
   * Checks the overall stability based on the latest metrics.
   * James: 'Is the market stable?'
   * The Rock (AI): 'It's as solid as my biceps, boss. No toxic assets allowed in this gym.'
   * @returns 'stable' if all recent metrics are stable, 'warning' or 'critical' otherwise.
   */
  public checkOverallStability(): 'stable' | 'warning' | 'critical' {
    const latestMetrics = this.metrics.slice(-10); // Check last 10 metrics for simplicity
    if (latestMetrics.some(m => m.status === 'critical')) {
      console.log("The Rock (AI): Uh oh, boss! We've got a critical lift. Time to spot it!");
      return 'critical';
    }
    if (latestMetrics.some(m => m.status === 'warning')) {
      console.log("The Rock (AI): A little wobble, boss. Needs more reps to be solid.");
      return 'warning';
    }
    console.log("The Rock (AI): It's as solid as my biceps, boss. No toxic assets allowed in this gym.");
    return 'stable';
  }

  /**
   * Returns all stored equilibrium metrics.
   * @returns All EquilibriumMetric records.
   */
  public getAllMetrics(): ReadonlyArray<EquilibriumMetric> {
    return Object.freeze([...this.metrics]);
  }
}
