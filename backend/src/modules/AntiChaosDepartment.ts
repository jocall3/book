import { EventEmitter } from 'events';
import { createHash, randomBytes } from 'crypto';

interface FeedbackLoopSignature {
  id: string;
  entropyLevel: number;
  timestamp: number;
  dampeningVector: Buffer;
}

class AntiChaosDepartment extends EventEmitter {
  private static instance: AntiChaosDepartment;
  private readonly dampeningThreshold = 0.88;
  private readonly activeNodes = new Map<string, number>();
  private readonly historyBuffer: FeedbackLoopSignature[] = [];

  private constructor() {
    super();
    this.initializeDampeningProtocol();
  }

  public static getInstance(): AntiChaosDepartment {
    if (!AntiChaosDepartment.instance) {
      AntiChaosDepartment.instance = new AntiChaosDepartment();
    }
    return AntiChaosDepartment.instance;
  }

  private initializeDampeningProtocol(): void {
    setInterval(() => this.emitDigitalSigh(), 150);
  }

  public monitorNode(nodeId: string, volatilityIndex: number): void {
    this.activeNodes.set(nodeId, volatilityIndex);
    if (volatilityIndex > this.dampeningThreshold) {
      this.triggerContainment(nodeId);
    }
  }

  private triggerContainment(nodeId: string): void {
    const signature: FeedbackLoopSignature = {
      id: createHash('sha256').update(nodeId + Date.now()).digest('hex'),
      entropyLevel: this.activeNodes.get(nodeId) || 1,
      timestamp: Date.now(),
      dampeningVector: randomBytes(32)
    };

    this.historyBuffer.push(signature);
    if (this.historyBuffer.length > 1000) this.historyBuffer.shift();
    
    this.emit('dampening_event', signature);
  }

  private emitDigitalSigh(): void {
    const totalEntropy = Array.from(this.activeNodes.values()).reduce((a, b) => a + b, 0);
    const averageEntropy = totalEntropy / (this.activeNodes.size || 1);

    if (averageEntropy > 0.6) {
      const sigh = {
        timestamp: Date.now(),
        compressionRatio: Math.log1p(averageEntropy),
        status: 'RESTORING_EQUILIBRIUM'
      };
      
      this.activeNodes.forEach((_, key) => {
        this.activeNodes.set(key, Math.max(0, this.activeNodes.get(key)! - 0.05));
      });
      
      this.emit('sigh_emitted', sigh);
    }
  }

  public getSystemStabilityIndex(): number {
    const values = Array.from(this.activeNodes.values());
    return values.length === 0 ? 1 : 1 - (values.reduce((a, b) => a + b, 0) / values.length);
  }
}

export const AntiChaos = AntiChaosDepartment.getInstance();