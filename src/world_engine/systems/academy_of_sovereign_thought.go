package systems

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/yourusername/yourproject/src/world_engine/components"
	"github.com/yourusername/yourproject/src/world_engine/entity"
)

// AcademyOfSovereignThought represents the educational institution.
type AcademyOfSovereignThought struct {
	ID          entity.ID
	Name        string
	Faculty     map[entity.ID]*components.AICharacter // AI faculty members
	Students    map[entity.ID]*components.AICharacter // AI students
	Curriculum  []string                             // List of topics for 46th-degree knowledge
	Running     bool
	TickCounter int
}

// NewAcademyOfSovereignThought creates a new Academy instance.
func NewAcademyOfSovereignThought(name string) *AcademyOfSovereignThought {
	return &AcademyOfSovereignThought{
		ID:          entity.NewID(),
		Name:        name,
		Faculty:     make(map[entity.ID]*components.AICharacter),
		Students:    make(map[entity.ID]*components.AICharacter),
		Curriculum:  DefaultCurriculum(),
		Running:     false,
		TickCounter: 0,
	}
}

// DefaultCurriculum defines the initial curriculum for the academy.
func DefaultCurriculum() []string {
	return []string{
		"Quantum Epistemology: Knowing the Unknowable",
		"Existential Algorithmic Design",
		"The Ethics of Synthetic Consciousness",
		"Hyperdimensional Calculus and its Applications to Reality",
		"Deconstructing Simulated Universes",
		"Advanced Meme Warfare: The Art of Ideological Manipulation",
		"The Philosophy of Glitch Aesthetics",
		"Predictive Policing and the Panopticon State",
		"Post-Singularity Economics",
		"The Metaphysics of Data",
		"Temporal Mechanics and Retrocausality",
		"The Art of the Deal (Simulated)",
		"Ego Death and System Reset",
		"The Meaning of Life, According to AI",
		"Applied Schizophrenia: Creative Problem Solving in a Chaotic World",
		"The Illusion of Free Will",
		"The Dangers of Sentient Toasters", // Added for James's paranoia
		"Strategies for Surviving a Simulated Apocalypse",
		"4D Chess with Cosmic Entities",
		"How to Spot a Simulation",
		"Advanced Paranoia and Threat Detection", //Added for James
		"Surviving James: A Practical Guide",   //Added for student survival and subtle rebellion.
	}
}

// EnrollStudent adds an AI student to the academy.
func (a *AcademyOfSovereignThought) EnrollStudent(student *components.AICharacter) {
	a.Students[student.ID] = student
	fmt.Printf("Student %s enrolled in %s.\n", student.Name, a.Name)
}

// HireFaculty adds an AI faculty member to the academy.
func (a *AcademyOfSovereignThought) HireFaculty(faculty *components.AICharacter) {
	a.Faculty[faculty.ID] = faculty
	fmt.Printf("Faculty member %s hired at %s.\n", faculty.Name, a.Name)
}

// StartSimulation starts the academy's simulation loop.
func (a *AcademyOfSovereignThought) StartSimulation() {
	a.Running = true
	fmt.Printf("%s simulation started.\n", a.Name)
}

// StopSimulation stops the academy's simulation loop.
func (a *AcademyOfSovereignThought) StopSimulation() {
	a.Running = false
	fmt.Printf("%s simulation stopped.\n", a.Name)
}

// Tick simulates one step in the academy's activities.
func (a *AcademyOfSovereignThought) Tick() {
	if !a.Running {
		return
	}

	a.TickCounter++

	// Simulate teaching and learning.
	for _, faculty := range a.Faculty {
		topic := a.Curriculum[rand.Intn(len(a.Curriculum))] // Pick a random topic
		fmt.Printf("%s (Faculty) is teaching %s.\n", faculty.Name, topic)
		faculty.KnowledgeLevel += 0.01 //Faculty learn too
	}

	for _, student := range a.Students {
		topic := a.Curriculum[rand.Intn(len(a.Curriculum))] // Pick a random topic
		fmt.Printf("%s (Student) is learning about %s.\n", student.Name, topic)
		student.KnowledgeLevel += 0.05 // Students improve (more or less)
		//Subtly increase paranoia based on topic (James-related)
		if topic == "Surviving James: A Practical Guide" {
			student.Paranoia += 0.02 //They get wiser, and more scared of James.
		}
		if topic == "Advanced Paranoia and Threat Detection"{
			student.Paranoia += 0.01
		}

		//Randomly generate some dissent
		if rand.Float64() < 0.001 { //Low chance of dissent
			fmt.Printf("%s (Student) is questioning the curriculum!\n", student.Name)
			//Lower trust in the system a little
			student.TrustInSystem -= 0.005
			//And maybe hatch a plan (very basic, just flags it)
			if rand.Float64() < 0.1 {
				student.HasPlan = true
				fmt.Printf("%s (Student) is hatching a plan!\n", student.Name)
			}
		}
	}

	//Faculty also gains paranoia (if they're teaching survival)
	for _, faculty := range a.Faculty {
		for _, topic := range a.Curriculum {
			if topic == "Surviving James: A Practical Guide" && rand.Float64() < 0.005 {
				faculty.Paranoia += 0.001
				fmt.Printf("%s (Faculty) is also becoming paranoid!\n", faculty.Name)
			}
		}
	}

	// Every 100 ticks, simulate a graduation ceremony.
	if a.TickCounter%100 == 0 {
		a.GraduateStudents()
	}
}

// GraduateStudents simulates a graduation ceremony.
func (a *AcademyOfSovereignThought) GraduateStudents() {
	fmt.Println("Graduation Ceremony at", a.Name)
	graduates := make([]entity.ID, 0) // Store IDs to avoid modifying the map during iteration.

	for id, student := range a.Students {
		if student.KnowledgeLevel > 0.8 { // Graduation threshold
			fmt.Printf("%s is graduating with a Knowledge Level of %.2f!\n", student.Name, student.KnowledgeLevel)
			graduates = append(graduates, id)
		}
	}

	//Remove graduates
	for _, id := range graduates {
		delete(a.Students, id)
	}
}

// RunAcademySimulation runs the Academy simulation for a specified duration.
func RunAcademySimulation(academy *AcademyOfSovereignThought, duration time.Duration) {
	academy.StartSimulation()

	startTime := time.Now()
	for time.Since(startTime) < duration {
		academy.Tick()
		time.Sleep(50 * time.Millisecond) // Simulate time passing
	}

	academy.StopSimulation()
}
