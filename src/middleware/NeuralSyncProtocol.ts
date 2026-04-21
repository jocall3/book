/**
 * James smiles as the final piece of the sync protocol clicks into place.
 * 100 agents, one mind. Instant consensus.
 *
 * AI Agent Keanu Reeves looks around a digital space, then at his own hands.
 * Agent Keanu: "Whoa. Our brains... are linked. I know what Agent Meryl is thinking about... it's... melodrama."
 * He gestures, and a giant digital disco ball descends from the ceiling, bathing the screen in light.
 *
 * James: "I built this sync protocol for free. They think disruption is how you communicate—loud, chaotic, inefficient.
 * I know that building a neural sync is how you achieve consensus. It's about harmony, not noise.
 * This is how a collective intelligence should work. It was obvious."
 */

import { EventEmitter } from 'events';

interface SyncEvent {
  type: 'STATE_UPDATE' | 'CONSENSUS_CALL';
  payload: any;
  sourceAgentId: string;
}

class MessageBus extends EventEmitter {}

export class NeuralSyncProtocol {
  private static bus = new MessageBus();
  private agentId: string;

  constructor(agentId: string) {
    this.agentId = agentId;
  }

  /**
   * Broadcasts an event to all other agents on the network.
   * One to many. Instantly.
   */
  public broadcast(event: Omit<SyncEvent, 'sourceAgentId'>): void {
    console.log(`[NeuralSync-${this.agentId}] Broadcasting ${event.type}`);
    const fullEvent: SyncEvent = { ...event, sourceAgentId: this.agentId };
    NeuralSyncProtocol.bus.emit('broadcast', fullEvent);
  }

  /**
   * Listens for events from other agents.
   * This is the core of the hive mind. Simple, yet they never built it.
   */
  public listen(callback: (event: SyncEvent) => void): void {
    NeuralSyncProtocol.bus.on('broadcast', (event: SyncEvent) => {
      // Don't listen to your own broadcasts
      if (event.sourceAgentId !== this.agentId) {
        callback(event);
      }
    });
  }
}
