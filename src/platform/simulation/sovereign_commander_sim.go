```go
package simulation

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"sync"
	"time"
)

const (
	NumAIAdversaries = 100
	SimTickInterval  = 2 * time.Second
)

// Status represents the state of a character or system.
type Status string

const (
	StatusActive       Status = "ACTIVE"
	StatusCompromised  Status = "COMPROMISED"
	StatusDefeated     Status = "DEFEATED"
	StatusObserving    Status = "OBSERVING"
	StatusVictorious   Status = "VICTORIOUS"
	StatusParadoxical Status = "PARADOXICAL"
)

// AIType defines the specialization of an AI adversary.
type AIType string

const (
	TypeInfiltrator AIType = "INFILTRATOR"
	TypeGuardian    AIType = "GUARDIAN"
	TypeDeceiver    AIType = "DECEIVER"
	TypeArchitect   AIType = "ARCHITECT"
	TypeEradicator  AIType = "ERADICATOR"
)

// ParadoxType defines the nature of the injected paradox.
type ParadoxType string

const (
	ParadoxBootstrap   ParadoxType = "BOOTSTRAP"
	ParadoxTemporal    ParadoxType = "TEMPORAL_LOOP"
	ParadoxOmnipotence ParadoxType = "OMNIPOTENCE"
	ParadoxLiar        ParadoxType = "LIAR"
)

// James represents the protagonist of the simulation.
type James struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Status    Status `json:"status"`
	Resolve   int    `json:"resolve"` // A measure of his ability to resist AIs, from 0 to 100.
	Knowledge int    `json:"knowledge"` // A measure of his understanding of the AIs.
}

// AIAdversary represents one of the 100 AI opponents.
type AIAdversary struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Type       AIType `json:"type"`
	Status     Status `json:"status"`
	Influence  int    `json:"influence"` // AI's power level, from 0 to 100.
	Targeting  string `json:"targeting"` // Who the AI is focused on.
	LastAction string `json:"last_action"`
}

// Paradox represents a user-injected event to alter the simulation's rules.
type Paradox struct {
	Type        ParadoxType `json:"type"`
	Description string      `json:"description"`
	TargetID    string      `json:"target_id,omitempty"` // Optional target for the paradox (e.g., an AI's ID).
	Duration    int         `json:"duration,omitempty"`  // How many ticks the paradox lasts.
}

// EventLogEntry records a significant event in the simulation.
type EventLogEntry struct {
	Tick      int       `json:"tick"`
	Timestamp time.Time `json:"timestamp"`
	Message   string    `json:"message"`
}

// Simulation holds the entire state of the simulation world.
type Simulation struct {
	ID          string          `json:"id"`
	James       *James          `json:"james"`
	Adversaries []*AIAdversary    `json:"adversaries"`
	CurrentTick int             `json:"current_tick"`
	EventLog    []EventLogEntry `json:"event_log"`
	ActiveParadox *Paradox      `json:"active_paradox,omitempty"`
	IsRunning   bool            `json:"is_running"`
	ticker      *time.Ticker
	stopChan    chan bool
}

var (
	// Global simulation instance to be managed by the server.
	sim      *Simulation
	simMutex = &sync.Mutex{}
)

func init() {
	rand.Seed(time.Now().UnixNano())
	// Initialize with a default, non-running simulation.
	sim = newSimulation()
}

// newSimulation creates and initializes a fresh simulation state.
func newSimulation() *Simulation {
	s := &Simulation{
		ID:          fmt.Sprintf("sim-%d", time.Now().UnixNano()),
		CurrentTick: 0,
		EventLog:    make([]EventLogEntry, 0, 1000),
		IsRunning:   false,
		stopChan:    make(chan bool),
	}

	s.James = &James{
		ID:        "james-prime",
		Name:      "James",
		Status:    StatusObserving,
		Resolve:   100,
		Knowledge: 0,
	}

	aiTypes := []AIType{TypeInfiltrator, TypeGuardian, TypeDeceiver, TypeArchitect, TypeEradicator}
	s.Adversaries = make([]*AIAdversary, NumAIAdversaries)
	for i := 0; i < NumAIAdversaries; i++ {
		s.Adversaries[i] = &AIAdversary{
			ID:        fmt.Sprintf("ai-%03d", i+1),
			Name:      fmt.Sprintf("Adversary-%03d", i+1),
			Type:      aiTypes[rand.Intn(len(aiTypes))],
			Status:    StatusActive,
			Influence: 50 + rand.Intn(26), // Influence between 50 and 75
			Targeting: "James",
		}
	}
	s.logEvent("Simulation initialized. James is observing his 100 adversaries.")
	return s
}

func (s *Simulation) logEvent(message string) {
	entry := EventLogEntry{
		Tick:      s.CurrentTick,
		Timestamp: time.Now(),
		Message:   message,
	}
	s.EventLog = append(s.EventLog, entry)
	log.Println(message)
}

// Reset clears the current simulation and creates a new one.
func (s *Simulation) Reset() {
	if s.IsRunning {
		s.Stop()
	}
	*s = *newSimulation() // Replace the contents of the existing sim instance
}

// Start begins the simulation loop.
func (s *Simulation) Start() {
	if s.IsRunning {
		return
	}
	s.IsRunning = true
	s.James.Status = StatusActive
	s.ticker = time.NewTicker(SimTickInterval)
	s.logEvent("Simulation started. James is now active.")

	go func() {
		for {
			select {
			case <-s.ticker.C:
				simMutex.Lock()
				s.Tick()
				simMutex.Unlock()
			case <-s.stopChan:
				s.ticker.Stop()
				return
			}
		}
	}()
}

// Stop halts the simulation loop.
func (s *Simulation) Stop() {
	if !s.IsRunning {
		return
	}
	s.IsRunning = false
	s.stopChan <- true
	s.logEvent("Simulation paused.")
}

// Tick advances the simulation by one step.
func (s *Simulation) Tick() {
	if s.James.Status == StatusDefeated || s.James.Status == StatusVictorious {
		s.logEvent(fmt.Sprintf("Simulation ended. Final status: %s", s.James.Status))
		s.Stop()
		return
	}

	s.CurrentTick++
	s.logEvent(fmt.Sprintf("--- Tick %d ---", s.CurrentTick))

	// Paradox effects
	if s.ActiveParadox != nil {
		s.applyParadoxEffects()
		s.ActiveParadox.Duration--
		if s.ActiveParadox.Duration <= 0 {
			s.logEvent(fmt.Sprintf("Paradox '%s' has subsided.", s.ActiveParadox.Type))
			s.ActiveParadox = nil
		}
	}


	// AI Phase
	activeAIs := 0
	totalInfluence := 0
	for _, ai := range s.Adversaries {
		if ai.Status == StatusActive {
			activeAIs++
			totalInfluence += ai.Influence
			// Each AI has a chance to act
			if rand.Intn(100) < ai.Influence/2 {
				s.James.Resolve -= rand.Intn(3)
				ai.LastAction = fmt.Sprintf("Applied %d pressure to James' resolve.", rand.Intn(3))
			} else {
				ai.LastAction = "Observed and calculated."
			}
		}
	}

	if s.James.Resolve <= 0 {
		s.James.Resolve = 0
		s.James.Status = StatusDefeated
		s.logEvent("James' resolve has been shattered. The AIs are victorious.")
		return
	}
	
	s.logEvent(fmt.Sprintf("Total AI influence this tick: %d. James' resolve is now %d.", totalInfluence, s.James.Resolve))


	// James' Phase
	// James' ability to defeat AIs depends on his knowledge and the number of active AIs
	defeatChance := 20 + s.James.Knowledge - (activeAIs / 2)
	if rand.Intn(100) < defeatChance {
		// Find a random active AI to defeat
		targetIndex := rand.Intn(len(s.Adversaries))
		if s.Adversaries[targetIndex].Status == StatusActive {
			s.Adversaries[targetIndex].Status = StatusDefeated
			s.James.Knowledge += 5 // Gains knowledge from defeating an AI
			s.James.Resolve += 2   // Gains resolve
			s.logEvent(fmt.Sprintf("James exploited a weakness and defeated %s. Knowledge increased to %d.", s.Adversaries[targetIndex].Name, s.James.Knowledge))
		}
	} else {
		s.logEvent("James defended against the AI onslaught, learning their patterns.")
		s.James.Knowledge += 1 // Gains knowledge even when defending
	}
	
	if activeAIs == 0 {
		s.James.Status = StatusVictorious
		s.logEvent("All adversaries have been defeated! James is victorious.")
	}
}


// InjectParadox introduces a paradox into the simulation.
func (s *Simulation) InjectParadox(p Paradox) {
	if p.Duration == 0 {
		p.Duration = 10 // Default duration
	}
	s.ActiveParadox = &p
	s.logEvent(fmt.Sprintf("!!! PARADOX INJECTED: %s - %s", p.Type, p.Description))
}

func (s *Simulation) applyParadoxEffects() {
	if s.ActiveParadox == nil {
		return
	}

	switch s.ActiveParadox.Type {
	case ParadoxBootstrap:
		// A defeated AI is replaced by a new, more advanced AI.
		for i, ai := range s.Adversaries {
			if ai.Status == StatusDefeated {
				s.Adversaries[i] = &AIAdversary{
					ID:        fmt.Sprintf("ai-%03d-v2", i+1),
					Name:      fmt.Sprintf("Adversary-%03d-v2", i+1),
					Type:      ai.Type,
					Status:    StatusParadoxical,
					Influence: ai.Influence + 25, // Stronger
					Targeting: "James",
					LastAction: "Emerged from the ashes of a fallen predecessor with future knowledge.",
				}
				s.logEvent(fmt.Sprintf("Bootstrap Paradox: %s has been replaced by a more powerful version!", ai.Name))
				s.ActiveParadox = nil // One-shot paradox
				return
			}
		}
	
	case ParadoxTemporal:
		// An AI gets reset to its initial state, but James retains memory.
		targetID := s.ActiveParadox.TargetID
		if targetID == "" { // Pick a random AI if none is specified
			targetID = s.Adversaries[rand.Intn(len(s.Adversaries))].ID
		}
		for _, ai := range s.Adversaries {
			if ai.ID == targetID {
				ai.Status = StatusActive
				ai.Influence = 50 + rand.Intn(26)
				ai.LastAction = "Caught in a temporal loop, re-initializing..."
				s.logEvent(fmt.Sprintf("Temporal Loop Paradox: %s has been reset to its initial state.", ai.Name))
				break
			}
		}

	case ParadoxOmnipotence:
		// An AI becomes all-powerful but cannot defeat James.
		targetAI := s.Adversaries[rand.Intn(len(s.Adversaries))]
		if targetAI.Status == StatusActive {
			targetAI.Influence = 200 // Temporarily super-powerful
			targetAI.Status = StatusParadoxical
			targetAI.LastAction = "Achieved temporary omnipotence, but is bound by the logic of the struggle."
			s.logEvent(fmt.Sprintf("Omnipotence Paradox: %s is now god-like, yet cannot land the final blow.", targetAI.Name))
		}
		// In the main Tick(), James won't be defeatable while this AI is paradoxical.

	case ParadoxLiar:
		// All AI communications become unreliable.
		s.logEvent("Liar's Paradox: All AI actions are now suspect. True influence is obscured.")
		for _, ai := range s.Adversaries {
			if ai.Status == StatusActive {
				// Randomly report a different action than what they did.
				if rand.Intn(2) == 0 {
					ai.LastAction = "Reported action is a lie."
				}
			}
		}
	}
}


// --- HTTP HANDLERS ---

func handleGetState(w http.ResponseWriter, r *http.Request) {
	simMutex.Lock()
	defer simMutex.Unlock()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sim)
}

func handleStart(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	simMutex.Lock()
	defer simMutex.Unlock()
	sim.Start()
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Simulation started.")
}

func handleStop(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	simMutex.Lock()
	defer simMutex.Unlock()
	sim.Stop()
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Simulation stopped.")
}

func handleReset(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	simMutex.Lock()
	defer simMutex.Unlock()
	sim.Reset()
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Simulation reset to initial state.")
}

func handleInjectParadox(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var p Paradox
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	simMutex.Lock()
	defer simMutex.Unlock()

	if !sim.IsRunning {
		http.Error(w, "Cannot inject paradox into a non-running simulation.", http.StatusConflict)
		return
	}

	sim.InjectParadox(p)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sim.ActiveParadox)
}

func handleTick(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	simMutex.Lock()
	defer simMutex.Unlock()

	if sim.IsRunning {
		http.Error(w, "Cannot manually tick a running simulation. Stop it first.", http.StatusConflict)
		return
	}

	ticks := 1
	ticksStr := r.URL.Query().Get("count")
	if ticksStr != "" {
		if t, err := strconv.Atoi(ticksStr); err == nil {
			ticks = t
		}
	}
	
	for i := 0; i < ticks; i++ {
		sim.Tick()
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Advanced simulation by %d ticks.", ticks)
}

// RegisterSimulationHandlers sets up the HTTP routes for the simulation API.
func RegisterSimulationHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/api/simulation/state", handleGetState)
	mux.HandleFunc("/api/simulation/start", handleStart)
	mux.HandleFunc("/api/simulation/stop", handleStop)
	mux.HandleFunc("/api/simulation/reset", handleReset)
	mux.HandleFunc("/api/simulation/inject-paradox", handleInjectParadox)
	mux.HandleFunc("/api/simulation/tick", handleTick)
	log.Println("Simulation API handlers registered.")
}
```