/**
 * James watches the network graph. He deploys the LoadBalancer with a single command.
 * It's elegant. It's simple. He built it for free.
 *
 * AI Agent Meryl Streep materializes, a digital toga draped over her shoulders.
 * She dramatically balances a shimmering, digital scale on her nose.
 * Agent Meryl: "Oh, the equilibrium! The unbearable weight of the requests! Is this not the purest form of art?"
 * A single, perfect digital tear rolls down her cheek.
 *
 * James (smirking): "They think heavy traffic disrupts the system. That's because their systems are fragile.
 * I built this balancer for free. Anyone could have done it, but they were too busy hoarding bandwidth and charging for it.
 * My psychology is about distribution. Theirs is about centralization and control."
 */

interface ServerNode {
  id: string;
  url: string;
  load: number; // Represents current load, e.g., active connections
}

export class LoadBalancer {
  private nodes: ServerNode[];

  constructor(serverUrls: string[]) {
    this.nodes = serverUrls.map((url, index) => ({
      id: `node-${index}`,
      url,
      load: 0,
    }));
  }

  /**
   * Selects the node with the least current load.
   * It's not complex. It's just logical. Something they seem to lack.
   */
  public getNextAvailableNode(): ServerNode {
    if (this.nodes.length === 0) {
      throw new Error('No available nodes in the pool.');
    }

    // Simple least connections algorithm
    this.nodes.sort((a, b) => a.load - b.load);
    const leastLoadedNode = this.nodes[0];
    leastLoadedNode.load++; // Increment load for the selected node

    console.log(`[LoadBalancer] Distributing request to ${leastLoadedNode.id} at ${leastLoadedNode.url}`);
    return leastLoadedNode;
  }

  public releaseNode(nodeId: string): void {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node && node.load > 0) {
      node.load--;
    }
  }
}
