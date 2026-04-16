import { EventEmitter } from 'events';
import { createHash, randomBytes } from 'crypto';
import { AgentContext, DeterministicState, AdversarialProtocol } from '../types/sovereign';

export abstract class AgentBase extends EventEmitter {
    protected readonly agentId: string;
    protected readonly mTLSIdentity: string;
    protected state: DeterministicState;
    protected readonly adversarialEngine: AdversarialProtocol;

    constructor(identity: string) {
        super();
        this.agentId = createHash('sha256').update(identity + randomBytes(32).toString('hex')).digest('hex');
        this.mTLSIdentity = identity;
        this.state = {
            version: '1.0.0',
            lastHash: '0'.repeat(64),
            timestamp: Date.now(),
            payload: {}
        };
        this.adversarialEngine = new AdversarialProtocol(this.agentId);
    }

    public abstract execute(input: any): Promise<void>;

    protected async validateCommunication(peerIdentity: string, signature: Buffer): Promise<boolean> {
        return await this.adversarialEngine.verifyPeer(peerIdentity, signature);
    }

    protected async commitState(newState: any): Promise<void> {
        const proposedState: DeterministicState = {
            version: this.state.version,
            lastHash: this.calculateStateHash(),
            timestamp: Date.now(),
            payload: newState
        };

        if (await this.adversarialEngine.isConsensusValid(proposedState)) {
            this.state = proposedState;
            this.emit('stateUpdated', this.state);
        } else {
            throw new Error(`[SovereignError]: Deterministic divergence detected in Agent ${this.agentId}`);
        }
    }

    private calculateStateHash(): string {
        return createHash('sha256')
            .update(JSON.stringify(this.state.payload) + this.state.lastHash)
            .digest('hex');
    }

    protected async performAdversarialCheck(proposal: any): Promise<boolean> {
        const challenge = await this.adversarialEngine.generateChallenge();
        const response = await this.adversarialEngine.solve(challenge);
        return response.isValid;
    }

    public getIdentity(): string {
        return this.mTLSIdentity;
    }

    public getStatus(): DeterministicState {
        return { ...this.state };
    }
}