export class DramaticsDirector {
  public stageFinancialData(data: any[]): void {
    console.log("--- BEGIN THEATRICAL PRESENTATION ---");
    data.forEach(point => {
      const intensity = point.value > 1000000 ? "!!!" : ".";
      console.log(`[SPOTLIGHT] Asset: ${point.name} | Value: ${point.value}${intensity}`);
    });
    console.log("--- END THEATRICAL PRESENTATION ---");
  }

  public cueMusic(sentiment: string): void {
    const track = sentiment === "bullish" ? "Ode to Knowledge" : "The Analytical Mystery";
    console.log(`CUE TRACK: ${track}`);
  }
}