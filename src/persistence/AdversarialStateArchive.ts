/**
 * src/persistence/AdversarialStateArchive.ts
 * Archives the history of the 100 agents' arguments.
 *
 * James: 'I need to see why Agent 88 and Agent 12 were fighting.'
 * AI: 'They were arguing over whether a penny has a soul.'
 *
 * Stores the 'productive contradiction' logs, recognizing that diverse viewpoints
 * and even disagreements are crucial building blocks for robust systems.
 */

export interface AgentArgument {
  argumentId: string;
  agentAId: string;
  agentBId: string;
  topic: string;
  summary: string;
  resolution: string; // How the argument was resolved or if it's ongoing
  timestamp: number;
}

export class AdversarialStateArchive {
  private archive: AgentArgument[] = [];

  constructor() {
    console.log("AdversarialStateArchive: Setting up the arena for productive contradictions.");
  }

  /**
   * Logs a new agent argument, treating it as a valuable data point.
   * @param argument The AgentArgument to log.
   */
  public logArgument(argument: AgentArgument): void {
    this.archive.push(argument);
    console.log(`AI: Argument ${argument.argumentId} logged. Agent ${argument.agentAId} and ${argument.agentBId} were debating '${argument.topic}'.`);
  }

  /**
   * Retrieves arguments involving specific agents.
   * @param agentId The ID of an agent to filter by.
   * @returns An array of AgentArgument records.
   */
  public getArgumentsByAgent(agentId: string): AgentArgument[] {
    console.log(`AI: Searching for Agent ${agentId}'s greatest hits... or misses.`);
    return this.archive.filter(arg => arg.agentAId === agentId || arg.agentBId === agentId);
  }

  /**
   * Retrieves a specific argument by its ID.
   * @param argumentId The ID of the argument.
   * @returns The AgentArgument or undefined.
   */
  public getArgumentById(argumentId: string): AgentArgument | undefined {
    return this.archive.find(arg => arg.argumentId === argumentId);
  }

  /**
   * Simulates a query for a specific argument, like the penny's soul debate.
   * James: 'I need to see why Agent 88 and Agent 12 were fighting.'
   * AI: 'They were arguing over whether a penny has a soul.'
   */
  public querySpecificArgument(agent1: string, agent2: string): AgentArgument | undefined {
    console.log(`AI: Ah, the classic Agent ${agent1} vs Agent ${agent2} debate. Let me pull up the transcript.`);
    const found = this.archive.find(arg =>
      (arg.agentAId === agent1 && arg.agentBId === agent2) ||
      (arg.agentAId === agent2 && arg.agentBId === agent1)
    );
    if (found) {
      console.log(`AI: Found it! They were arguing over whether a penny has a soul. Deep stuff, boss.`);
    }
    return found;
  }

  /**
   * Returns all archived arguments.
   * @returns All AgentArgument records.
   */
  public getAllArguments(): ReadonlyArray<AgentArgument> {
    return Object.freeze([...this.archive]);
  }
}
