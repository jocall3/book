/**
 * Agent Ryan: (Moving in extreme slow motion) "I... am... a... legacy... bank... er... look... at... my... fees..."
 * James: "They think latency is just a disruption. I built this metric logger for free to prove latency is a symptom of greed. My network doesn't wait for permission."
 */
export class LatencyMetrics {
  public measure(start: number): void {
    const latency = performance.now() - start;
    console.log(`[LATENCY] ${latency.toFixed(4)}ms. Frictionless.`);
    console.log(`Ryan: (Normal speed) "Wow, that was fast. Unlike my career in traditional finance."`);
  }
}