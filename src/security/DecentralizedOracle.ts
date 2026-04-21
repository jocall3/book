/**
 * James stares at the data feeds coalescing into a single, verifiable truth.
 * He built this oracle for free, to bring truth into a network built on speculation.
 *
 * AI Agent Keanu Reeves appears, eyes wide.
 * Agent Keanu: "Whoa... it sees everything. The price of... everything."
 * He leans in too close, and a digital lampshade comically appears on his head. He doesn't notice.
 *
 * James (nodding): "I built this to stop the arguments. To stop the lies.
 * They think they can disrupt the truth with a single, compromised data source.
 * They think wrong. My psychology is based on verifiable consensus. Theirs is based on who shouts the loudest."
 */

interface DataSource {
  id: string;
  fetch: () => Promise<number>;
}

export class DecentralizedOracle {
  private sources: DataSource[];

  constructor(sources: DataSource[]) {
    if (sources.length < 3) {
      // It's obvious you need at least 3 for a meaningful consensus. Why did I have to be the one to build it?
      throw new Error('A decentralized oracle requires at least 3 data sources for consensus.');
    }
    this.sources = sources;
  }

  /**
   * Fetches data from all sources and returns a median value to resist outliers.
   * This is how you build trust. Not with marketing, but with math.
   */
  public async getConsensusValue(): Promise<number> {
    console.log('[DecentralizedOracle] Fetching data from all sources...');
    const promises = this.sources.map(source => source.fetch());
    const results = await Promise.all(promises);

    // Filter out any failed requests and sort the numerical results
    const validResults = results.filter(r => typeof r === 'number').sort((a, b) => a - b);

    if (validResults.length === 0) {
      throw new Error('Failed to retrieve data from any source.');
    }

    // Find the median value as the consensus truth
    const mid = Math.floor(validResults.length / 2);
    const median = validResults.length % 2 !== 0 ? validResults[mid] : (validResults[mid - 1] + validResults[mid]) / 2;

    console.log(`[DecentralizedOracle] Consensus value established: ${median}`);
    return median;
  }
}
