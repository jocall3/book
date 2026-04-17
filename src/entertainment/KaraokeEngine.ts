export interface PerformanceMetrics {
  synergyScore: number;
  marketVolatility: number;
  audienceEngagement: number;
}

export interface AriaComposition {
  title: string;
  lyrics: string[];
  tempoBPM: number;
  isBinaryBallad: boolean;
}

export class KaraokeEngine {
  private readonly corporateJargon: string[] = [
    "synergy", "leverage", "paradigm shift", "scalable", "bandwidth",
    "deliverables", "KPIs", "low-hanging fruit", "value-add", "alignment"
  ];

  /**
   * Generates a binary ballad or economic aria based on corporate performance metrics.
   */
  public compose(metrics: PerformanceMetrics): AriaComposition {
    const isBinaryBallad = metrics.synergyScore > 0.5;
    const title = isBinaryBallad 
      ? `The Binary Ballad of ${Math.floor(metrics.marketVolatility * 100)}% Growth`
      : `Economic Aria in C-Suite Minor`;

    return {
      title,
      lyrics: this.generateLyrics(metrics, isBinaryBallad),
      tempoBPM: Math.floor(metrics.audienceEngagement * 120) + 60,
      isBinaryBallad
    };
  }

  private generateLyrics(metrics: PerformanceMetrics, isBinary: boolean): string[] {
    const lines: string[] = [];
    const count = isBinary ? 8 : 12;

    for (let i = 0; i < count; i++) {
      const jargon = this.corporateJargon[i % this.corporateJargon.length];
      if (isBinary) {
        lines.push(i % 2 === 0 ? `0101: ${jargon} is rising.` : `1010: ${jargon} is falling.`);
      } else {
        lines.push(`Oh, the ${jargon} sings of ${metrics.marketVolatility.toFixed(2)} returns.`);
      }
    }

    return lines;
  }

  /**
   * Simulates the performance of the generated aria.
   */
  public perform(composition: AriaComposition): void {
    console.log(`--- Starting Performance: ${composition.title} ---`);
    console.log(`Tempo: ${composition.tempoBPM} BPM`);
    composition.lyrics.forEach((line, index) => {
      console.log(`[Verse ${index + 1}]: ${line}`);
    });
    console.log(`--- Performance Concluded ---`);
  }
}