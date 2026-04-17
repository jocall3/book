import { EventEmitter } from 'events';

export interface EconomicDataPoint {
  id: string;
  timestamp: number;
  value: number;
  metadata: Record<string, any>;
}

export interface GardenOptions {
  retentionPolicy?: 'prune-old' | 'keep-all';
  maxSize?: number;
}

export class DataGarden extends EventEmitter {
  private plots: Map<string, EconomicDataPoint[]> = new Map();
  private options: Required<GardenOptions>;

  constructor(options: GardenOptions = {}) {
    super();
    this.options = {
      retentionPolicy: options.retentionPolicy || 'prune-old',
      maxSize: options.maxSize || 10000,
    };
  }

  public plant(plotId: string, data: Omit<EconomicDataPoint, 'id' | 'timestamp'>): EconomicDataPoint {
    const point: EconomicDataPoint = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...data,
    };

    if (!this.plots.has(plotId)) {
      this.plots.set(plotId, []);
    }

    const plot = this.plots.get(plotId)!;
    plot.push(point);

    if (this.options.retentionPolicy === 'prune-old' && plot.length > this.options.maxSize) {
      plot.shift();
      this.emit('pruned', { plotId, reason: 'maxSizeReached' });
    }

    this.emit('planted', { plotId, point });
    return point;
  }

  public harvest(plotId: string): EconomicDataPoint[] {
    return [...(this.plots.get(plotId) || [])];
  }

  public prune(plotId: string, predicate: (point: EconomicDataPoint) => boolean): number {
    const plot = this.plots.get(plotId);
    if (!plot) return 0;

    const initialLength = plot.length;
    const filtered = plot.filter((p) => !predicate(p));
    this.plots.set(plotId, filtered);

    const prunedCount = initialLength - filtered.length;
    this.emit('pruned', { plotId, count: prunedCount });
    return prunedCount;
  }

  public clearPlot(plotId: string): void {
    this.plots.delete(plotId);
    this.emit('cleared', { plotId });
  }

  public getPlotStats(plotId: string) {
    const plot = this.plots.get(plotId);
    if (!plot) return null;

    return {
      count: plot.length,
      latest: plot[plot.length - 1],
      earliest: plot[0],
    };
  }

  public listPlots(): string[] {
    return Array.from(this.plots.keys());
  }
}