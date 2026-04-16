import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { NodeState, SwarmConfig, LifecycleEvent } from './types';
import { DeterministicEngine } from '../core/DeterministicEngine';
import { mTLSProvider } from '../security/mTLSProvider';

export class HiveMindManager extends EventEmitter {
    private static instance: HiveMindManager;
    private nodes: Map<string, NodeState> = new Map();
    private readonly swarmId: string = uuidv4();
    private readonly engine: DeterministicEngine;

    private constructor(private config: SwarmConfig) {
        super();
        this.engine = new DeterministicEngine();
        this.initializeSwarmLifecycle();
    }

    public static getInstance(config: SwarmConfig): HiveMindManager {
        if (!HiveMindManager.instance) {
            HiveMindManager.instance = new HiveMindManager(config);
        }
        return HiveMindManager.instance;
    }

    private async initializeSwarmLifecycle(): Promise<void> {
        console.log(`[SYSTEM] Initializing Sovereign Swarm: ${this.swarmId}`);
        await this.provisionNodes(this.config.nodeCount);
    }

    private async provisionNodes(count: number): Promise<void> {
        for (let i = 0; i < count; i++) {
            const nodeId = `node-${this.swarmId}-${i}`;
            const identity = await mTLSProvider.generateNodeIdentity(nodeId);
            
            const node: NodeState = {
                id: nodeId,
                status: 'PROVISIONED',
                identity,
                subjectivePerspective: {
                    lastSync: Date.now(),
                    entropyWeight: Math.random(),
                    consensusContribution: 0
                }
            };

            this.nodes.set(nodeId, node);
            this.emit('node_spawned', node);
        }
    }

    public async orchestrateFinality(transactionBatch: any[]): Promise<boolean> {
        const activeNodes = Array.from(this.nodes.values()).filter(n => n.status === 'ACTIVE');
        
        if (activeNodes.length < this.config.quorumThreshold) {
            throw new Error("Sovereign Quorum not met: Deterministic finality suspended.");
        }

        const settlementPromises = activeNodes.map(node => 
            this.engine.executeSubjectiveValidation(node, transactionBatch)
        );

        const results = await Promise.all(settlementPromises);
        return this.engine.verifyDeterministicConvergence(results);
    }

    public async rotateNode(nodeId: string): Promise<void> {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        node.status = 'RECYCLING';
        await mTLSProvider.revokeIdentity(node.identity);
        
        const newNodeId = `node-${this.swarmId}-${Date.now()}`;
        const newIdentity = await mTLSProvider.generateNodeIdentity(newNodeId);
        
        this.nodes.set(newNodeId, {
            id: newNodeId,
            status: 'ACTIVE',
            identity: newIdentity,
            subjectivePerspective: {
                lastSync: Date.now(),
                entropyWeight: Math.random(),
                consensusContribution: 0
            }
        });

        this.nodes.delete(nodeId);
        this.emit('lifecycle_event', { type: LifecycleEvent.ROTATION, nodeId: newNodeId });
    }

    public getSwarmHealth(): object {
        return {
            swarmId: this.swarmId,
            totalNodes: this.nodes.size,
            activeNodes: Array.from(this.nodes.values()).filter(n => n.status === 'ACTIVE').length,
            timestamp: Date.now()
        };
    }
}