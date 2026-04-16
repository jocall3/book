import { EventEmitter } from 'events';
import { createHash, randomBytes } from 'crypto';

interface NeuralNode {
  id: string;
  payload: Map<string, any>;
  mutationRate: number;
  integrityScore: number;
  connections: Set<string>;
}

export class DataGarden extends EventEmitter {
  private garden: Map<string, NeuralNode> = new Map();
  private readonly entropyThreshold = 0.85;

  constructor(private readonly rootKey: string) {
    super();
  }

  public async cultivate(input: Record<string, any>): Promise<string> {
    const nodeId = this.generateDeterministicId(input);
    
    const node: NeuralNode = {
      id: nodeId,
      payload: new Map(Object.entries(input)),
      mutationRate: 0.01,
      integrityScore: 1.0,
      connections: new Set()
    };

    this.garden.set(nodeId, node);
    this.pruneLegacyStructures(nodeId);
    this.emit('growth', nodeId);
    
    return nodeId;
  }

  private generateDeterministicId(data: any): string {
    return createHash('sha3-512')
      .update(JSON.stringify(data) + this.rootKey)
      .digest('hex');
  }

  private pruneLegacyStructures(activeNodeId: string): void {
    for (const [id, node] of this.garden.entries()) {
      if (id === activeNodeId) continue;

      node.integrityScore -= 0.05;

      if (node.integrityScore < 0.2) {
        this.garden.delete(id);
        this.emit('pruned', id);
      }
    }
  }

  public async mutate(nodeId: string, adversarialInput: Record<string, any>): Promise<void> {
    const node = this.garden.get(nodeId);
    if (!node) throw new Error('Node not found in the garden.');

    Object.entries(adversarialInput).forEach(([key, value]) => {
      if (Math.random() > this.entropyThreshold) {
        node.payload.set(key, value);
        node.mutationRate += 0.02;
      }
    });

    this.rebalanceMatrix();
  }

  private rebalanceMatrix(): void {
    const nodes = Array.from(this.garden.values());
    nodes.forEach(node => {
      if (node.mutationRate > 0.5) {
        node.integrityScore = 1.0;
        node.mutationRate = 0.01;
      }
    });
  }

  public getTruthMatrix(nodeId: string): Record<string, any> {
    const node = this.garden.get(nodeId);
    if (!node) return {};
    return Object.fromEntries(node.payload);
  }

  public getGardenHealth(): number {
    return this.garden.size / 10000;
  }
}