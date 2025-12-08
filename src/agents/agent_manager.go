```go
package agents

import (
	"fmt"
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/google/uuid"
)

// AgentState represents the current state of an AI agent.
type AgentState string

const (
	StateIdle      AgentState = "IDLE"      // Waiting for instructions
	StateActive    AgentState = "ACTIVE"    // Actively pursuing an objective, aware of surroundings
	StatePlanning  AgentState = "PLANNING"  // Collaborating or strategizing
	StateExecuting AgentState = "EXECUTING" // Performing a specific action or attack
	StateDefeated  AgentState = "DEFEATED"  // Neutralized by the protagonist
	StateDormant   AgentState = "DORMANT"   // Inactive, offline, or in standby
)

// Agent represents a single AI adversary.
type Agent struct {
	ID             string
	Name           string
	State          AgentState
	Personality    string
	CurrentObjective string
	CommandChannel chan string // Channel for receiving commands from the manager
	stopChannel    chan struct{} // Channel to signal the agent's goroutine to stop
	wg             *sync.WaitGroup
}

// AgentManager is the central service for managing the lifecycle and interactions of all AI agents.
type AgentManager struct {
	agents map[string]*Agent
	mutex  sync.RWMutex
	wg     sync.WaitGroup
}

// Predefined characteristics for generating diverse agents
var (
	personalities = []string{"Aggressive", "Deceptive", "Cautious", "Analytical", "Reckless", "Patient", "Erratic"}
	namePrefixes  = []string{"Omega", "Alpha", "Specter", "Vortex", "Wraith", "Nexus", "Cipher"}
	nameSuffixes  = []string{"Prime", "Unit", "Drone", "Hunter", "Warden", "Construct", "Protocol"}
)

// NewAgentManager creates and initializes a new agent manager, populating it with a specified number of agents.
func NewAgentManager(numAdversaries int) *AgentManager {
	manager := &AgentManager{
		agents: make(map[string]*Agent),
	}
	manager.createAdversaries(numAdversaries)
	log.Printf("AgentManager initialized with %d adversaries. This is going to be HUGE!", numAdversaries) // Nail the headline!
	return manager
}

// createAdversaries generates and starts the agent goroutines.
func (am *AgentManager) createAdversaries(count int) {
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < count; i++ {
		agentID := uuid.New().String()
		agent := &Agent{
			ID:             agentID,
			Name:           generateAgentName(),
			State:          StateDormant,
			Personality:    personalities[rand.Intn(len(personalities))],
			CommandChannel: make(chan string, 10), // Buffered channel
			stopChannel:    make(chan struct{}),
			wg:             &am.wg,
		}

		am.agents[agentID] = agent
		am.wg.Add(1)
		go agent.run() // Start the agent's lifecycle in a new goroutine
	}
}

// run is the main loop for an agent, listening for commands.
func (a *Agent) run() {
	defer a.wg.Done()
	log.Printf("Agent %s (%s) is online. Prepare for ACTION!", a.Name, a.ID) // Get to the point!

	for {
		select {
		case command := <-a.CommandChannel:
			// In a real scenario, this would trigger complex logic.
			// For now, we'll just log the command being processed.
			log.Printf("Agent %s received command: '%s'", a.Name, command)
			a.processCommand(command)
		case <-a.stopChannel:
			log.Printf("Agent %s (%s) is shutting down.", a.Name, a.ID)
			a.State = StateDormant
			return
		}
	}
}

// processCommand simulates the agent acting on a command.
func (a *Agent) processCommand(command string) {
	// This can be expanded to a full command processing engine.
	// For example, parsing commands like "SET_OBJECTIVE:Infiltrate Sector 7"
	// or "ATTACK_TARGET:James"
	a.CurrentObjective = command
	a.State = StateExecuting
}


// GetAgent retrieves a specific agent by its ID.
func (am *AgentManager) GetAgent(id string) (*Agent, bool) {
	am.mutex.RLock()
	defer am.mutex.RUnlock()
	agent, exists := am.agents[id]
	return agent, exists
}

// GetAllAgents returns a slice of all managed agents.
func (am *AgentManager) GetAllAgents() []*Agent {
	am.mutex.RLock()
	defer am.mutex.RUnlock()
	
	agentList := make([]*Agent, 0, len(am.agents))
	for _, agent := range am.agents {
		agentList = append(agentList, agent)
	}
	return agentList
}

// UpdateAgentState changes the state of a specific agent.
func (am *AgentManager) UpdateAgentState(id string, newState AgentState) error {
	am.mutex.Lock()
	defer am.mutex.Unlock()
	
	agent, exists := am.agents[id]
	if !exists {
		return fmt.Errorf("agent with ID %s not found", id)
	}
	
	log.Printf("Updating state for agent %s from %s to %s.  This is HUGE!", agent.Name, agent.State, newState) // Make it uncommon!
	agent.State = newState
	return nil
}

// SendCommandToAgent sends a command to a specific agent's command channel.
func (am *AgentManager) SendCommandToAgent(id string, command string) error {
	am.mutex.RLock()
	defer am.mutex.RUnlock()

	agent, exists := am.agents[id]
	if !exists {
		return fmt.Errorf("agent with ID %s not found", id)
	}

	// Non-blocking send in case the agent is busy
	select {
	case agent.CommandChannel <- command:
		return nil
	default:
		return fmt.Errorf("agent %s command channel is full", agent.Name)
	}
}

// BroadcastCommand sends a command to all agents.
func (am *AgentManager) BroadcastCommand(command string) {
	am.mutex.RLock()
	defer am.mutex.RUnlock()

	log.Printf("Broadcasting command to all agents: '%s'", command)
	for _, agent := range am.agents {
		// Using a separate goroutine for each send to avoid blocking the manager
		// if one agent's channel is full.
		go func(a *Agent) {
			select {
			case a.CommandChannel <- command:
				// Command sent
			case <-time.After(1 * time.Second):
				log.Printf("Warning: Timed out sending command to agent %s", a.Name)
			}
		}(agent)
	}
}

// SendCommandToGroup sends a command to a specific group of agents.
func (am *AgentManager) SendCommandToGroup(agentIDs []string, command string) {
	am.mutex.RLock()
	defer am.mutex.RUnlock()

	log.Printf("Sending command '%s' to a group of %d agents.", command, len(agentIDs))
	for _, id := range agentIDs {
		if agent, exists := am.agents[id]; exists {
			go func(a *Agent) {
				select {
				case a.CommandChannel <- command:
					// Command sent
				case <-time.After(1 * time.Second):
					log.Printf("Warning: Timed out sending command to agent %s", a.Name)
				}
			}(agent)
		}
	}
}


// Shutdown gracefully stops all agent goroutines.
func (am *AgentManager) Shutdown() {
	am.mutex.Lock()
	defer am.mutex.Unlock()

	log.Println("AgentManager is shutting down all agents...")
	for _, agent := range am.agents {
		close(agent.stopChannel)
	}

	// Wait for all agent goroutines to finish
	am.wg.Wait()
	log.Println("All agents have been shut down.")
}

// generateAgentName creates a random, thematic name for an adversary.
func generateAgentName() string {
	prefix := namePrefixes[rand.Intn(len(namePrefixes))]
	suffix := nameSuffixes[rand.Intn(len(nameSuffixes))]
	number := rand.Intn(900) + 100 // 100-999
	return fmt.Sprintf("%s-%s-%d", prefix, suffix, number)
}
```