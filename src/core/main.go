```go
package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	// These are placeholder import paths for the project's internal packages.
	// In a real Go modules project, they would be replaced with the full module path,
	// e.g., "github.com/your-username/countercoin/src/agents".
	"countercoin/src/agents"
	"countercoin/src/config"
	"countercoin/src/content"
	"countercoin/src/simulation"
	"countercoin/src/story"
)

const (
	defaultConfigFile = "config.json"
	numAdversaries    = 100
	ebookFilename     = "ebook_the_countercoin_saga.md"
	scriptFilename    = "moviescript_james_vs_the_100.fountain"
)

func main() {
	// --- 1. Initialization and Configuration ---
	printBanner()

	configFile := flag.String("config", defaultConfigFile, "Path to the configuration file.")
	simulationSteps := flag.Int("steps", 5000, "Number of simulation steps (ticks) to run.")
	outputDir := flag.String("output", "dist", "Directory to save generated content.")
	flag.Parse()

	log.Println("Loading configuration...")
	cfg, err := config.Load(*configFile)
	if err != nil {
		log.Fatalf("FATAL: Could not load configuration from %s: %v", *configFile, err)
	}
	log.Printf("Configuration loaded successfully from %s.", *configFile)

	if err := os.MkdirAll(*outputDir, 0755); err != nil {
		log.Fatalf("FATAL: Could not create output directory %s: %v", *outputDir, err)
	}
	log.Printf("Output will be saved to '%s' directory.", *outputDir)

	// --- 2. Setup Simulation and Story Engine ---
	log.Println("Setting up simulation environment...")

	// Create the protagonist, James
	james := agents.NewProtagonist("James", cfg.Protagonist)

	// Create the 100 AI adversaries
	adversaries := make([]*agents.Adversary, numAdversaries)
	for i := 0; i < numAdversaries; i++ {
		adversaries[i] = agents.NewAdversary(fmt.Sprintf("Adversary_%03d", i+1), cfg.Adversary)
	}

	// Initialize the simulation world
	sim, err := simulation.New(cfg.Simulation, james, adversaries)
	if err != nil {
		log.Fatalf("FATAL: Failed to initialize simulation: %v", err)
	}
	log.Printf("Simulation environment created with 1 protagonist and %d adversaries.", numAdversaries)

	// Initialize the story and content engines
	storyEngine := story.NewEngine(sim, cfg.Story)
	contentGenerator := content.NewGenerator(*outputDir, cfg.Content)
	log.Println("Story and Content generation engines are online.")

	// --- 3. Main Simulation Loop ---
	log.Printf("--- Starting Simulation for %d steps ---", *simulationSteps)
	startTime := time.Now()

	for i := 0; i < *simulationSteps; i++ {
		// A. Advance the simulation by one tick
		events, err := sim.RunTick()
		if err != nil {
			log.Printf("WARN: Simulation tick %d failed: %v. Attempting to continue...", i+1, err)
			continue
		}

		// B. The story engine processes the events from the tick to create narrative beats
		narrativeFragments, err := storyEngine.ProcessEvents(events)
		if err != nil {
			log.Printf("WARN: Story engine failed to process tick %d: %v", i+1, err)
			continue
		}

		// C. The content generator uses the narrative to build the story documents
		for _, fragment := range narrativeFragments {
			contentGenerator.AddNarrativeFragment(fragment)
		}

		// D. Log progress periodically
		if (i+1)%(*simulationSteps/10) == 0 || i == *simulationSteps-1 {
			progress := float64(i+1) / float64(*simulationSteps) * 100
			log.Printf("Progress: %.1f%% [Step %d/%d] | Pages: %d | Scenes: %d",
				progress, i+1, *simulationSteps, contentGenerator.EbookPageCount(), contentGenerator.MovieSceneCount())
		}
	}

	duration := time.Since(startTime)
	log.Printf("--- Simulation Finished in %v ---", duration)

	// --- 4. Finalization and Output ---
	log.Println("Finalizing and saving generated content...")

	ebookPath := fmt.Sprintf("%s/%s", *outputDir, ebookFilename)
	err = contentGenerator.SaveEbook(ebookPath)
	if err != nil {
		log.Fatalf("FATAL: Failed to save the ebook: %v", err)
	}
	log.Printf("Ebook saved to %s", ebookPath)

	scriptPath := fmt.Sprintf("%s/%s", *outputDir, scriptFilename)
	err = contentGenerator.SaveMovieScript(scriptPath)
	if err != nil {
		log.Fatalf("FATAL: Failed to save the movie script: %v", err)
	}
	log.Printf("Movie script saved to %s", scriptPath)

	printFinalSummary(*simulationSteps, contentGenerator.EbookPageCount(), contentGenerator.MovieSceneCount())
}

func printBanner() {
	fmt.Println("================================================")
	fmt.Println("   CounterCoin Simulation & Content Platform    ")
	fmt.Println("         'James vs. The 100' Generator         ")
	fmt.Println("================================================")
}

func printFinalSummary(steps, pages, scenes int) {
	fmt.Println("\n================================================")
	fmt.Println("           Generation Complete!                 ")
	fmt.Println("================================================")
	fmt.Printf("Total Simulation Steps: %d\n", steps)
	fmt.Printf("Final Ebook Pages Generated: %d\n", pages)
	fmt.Printf("Final Movie Scenes Generated: %d\n", scenes)
	fmt.Println("================================================")
}
```