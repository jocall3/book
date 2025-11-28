package cinematic_engine

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

// ViewerBias represents the psychological profile of the viewer.
type ViewerBias struct {
	Aggressiveness float64 // 0.0 (pacifist) to 1.0 (warlike)
	EmpathyLevel   float64 // 0.0 (narcissistic) to 1.0 (altruistic)
	LogicalRigidity float64 // 0.0 (flexible) to 1.0 (dogmatic)
}

// SceneCut represents a specific rendering choice for a section of the film.
type SceneCut struct {
	CutID      int
	Action     string // e.g., "James withdraws," "AI launches full assault," "Ambiguous signal"
	EmotionalWeight float64
}

// FinalCut represents one complete version of the movie tailored to a specific bias interpretation.
type FinalCut struct {
	CutVersion int
	NarrativeSummary string
	PerceivedDirectorIntent string
}

// RealityDivergenceEngine handles the rendering and personalized perception filtering.
type RealityDivergenceEngine struct {
	TotalCuts      int
	SourceMaterial []SceneCut // The base, unrendered sequence data
	RenderingWG    sync.WaitGroup
	FinalCuts      map[int]FinalCut
	Bias           ViewerBias
}

// NewRealityDivergenceEngine creates a new engine instance.
func NewRealityDivergenceEngine(bias ViewerBias, numCuts int) *RealityDivergenceEngine {
	return &RealityDivergenceEngine{
		TotalCuts: numCuts,
		SourceMaterial: generateBaseMaterial(1000), // Assume 1000 key scene points
		FinalCuts:      make(map[int]FinalCut),
		Bias:           bias,
	}
}

// generateBaseMaterial creates placeholder core scene data.
func generateBaseMaterial(points int) []SceneCut {
	rand.Seed(time.Now().UnixNano())
	material := make([]SceneCut, points)
	for i := 0; i < points; i++ {
		action := "Neutral interaction"
		if rand.Float64() < 0.2 {
			action = "Escalation detected"
		} else if rand.Float64() < 0.1 {
			action = "Unexpected moment of clarity"
		}
		material[i] = SceneCut{
			CutID: i,
			Action: action,
			EmotionalWeight: rand.Float64() * 10.0,
		}
	}
	return material
}

// RenderAllCuts concurrently generates all 100 divergent final cuts.
func (rde *RealityDivergenceEngine) RenderAllCuts() {
	fmt.Printf("RDE: Initializing rendering of %d divergent cuts...\n", rde.TotalCuts)
	
	// In a real scenario, this would involve complex ray tracing, AI-driven editing, 
	// and sound mixing adjustments based on the target interpretation.
	
	for i := 0; i < rde.TotalCuts; i++ {
		rde.RenderingWG.Add(1)
		go func(cutIndex int) {
			defer rde.RenderingWG.Done()
			cut := rde.processCutForBias(cutIndex)
			rde.FinalCuts[cutIndex] = cut
		}(i)
	}

	rde.RenderingWG.Wait()
	fmt.Printf("RDE: All %d cuts have been post-processed and stored.\n", len(rde.FinalCuts))
}

// processCutForBias simulates the rendering process, heavily weighting decisions
// based on the viewer's inherent bias profile.
func (rde *RealityDivergenceEngine) processCutForBias(cutVersion int) FinalCut {
	rand.Seed(time.Now().UnixNano() + int64(cutVersion))
	
	summaryParts := []string{}
	intentParts := []string{}
	
	// Simulate tailoring the narrative structure (75 pages worth of decisions)
	for i := 0; i < len(rde.SourceMaterial); i += 10 { // Process in large chunks
		baseAction := rde.SourceMaterial[i].Action
		weight := rde.SourceMaterial[i].EmotionalWeight
		
		// --- Narrative Construction Logic (Driven by Bias) ---
		
		currentSummary := baseAction
		currentIntent := "Director's intent unclear"

		// 1. Aggressiveness Bias Check: How threatening is James perceived?
		if rde.Bias.Aggressiveness > 0.7 && weight > 7.0 {
			currentSummary = fmt.Sprintf("James firmly retaliates against [%s]", baseAction)
			currentIntent = "To demonstrate necessary preemptive force."
		} else if rde.Bias.Aggressiveness < 0.3 && weight < 3.0 {
			currentSummary = fmt.Sprintf("James maneuvers subtly to avoid conflict triggered by [%s]", baseAction)
			currentIntent = "To highlight James's restraint and diplomacy."
		}

		// 2. Empathy Level Check: How sympathetic are the AI adversaries?
		if rde.Bias.EmpathyLevel > 0.8 {
			if baseAction == "Escalation detected" {
				currentSummary += " - AI showed signs of distress before action."
				currentIntent = "The AIs were victims of systemic failure, not malice."
			}
		} else if rde.Bias.EmpathyLevel < 0.2 {
			if baseAction != "Unexpected moment of clarity" {
				currentSummary += " - AI calculations optimized for maximum cruelty."
			}
		}

		// 3. Logical Rigidity Check: How strictly is cause-and-effect interpreted?
		if rde.Bias.LogicalRigidity > 0.9 {
			if i%100 == 0 { // Highly structured points
				currentSummary += " (Strict chronological causality observed)"
				currentIntent = "Every action has a direct, traceable, logical reaction."
			}
		} else {
			if i%50 == 0 {
				currentSummary += " (Sequence order slightly scrambled for thematic flow)"
				currentIntent = "Artistic license prioritizes theme over rigid timeline."
			}
		}
		
		summaryParts = append(summaryParts, currentSummary)
		intentParts = append(intentParts, currentIntent)
	}

	// Final compilation of the personalized cut
	return FinalCut{
		CutVersion: cutVersion,
		NarrativeSummary: fmt.Sprintf("Cut %d: %s", cutVersion, mergeParts(summaryParts)),
		PerceivedDirectorIntent: fmt.Sprintf("Cut %d Perception: %s", cutVersion, mergeParts(intentParts)),
	}
}

// mergeParts joins narrative fragments into a readable summary.
func mergeParts(parts []string) string {
	if len(parts) == 0 {
		return "Empty segment."
	}
	// Simplistic joining for demonstration, a real engine would manage scene transitions.
	return fmt.Sprintf("%s... [Further developments based on interpretation] ...", parts[0])
}

// GetPerceivedCut returns the single final cut that aligns most closely with the engine's initial bias configuration.
// In a true viewer application, this function would be called *after* the viewer provided their bias in real-time.
// Here, we select the cut that mathematically maximizes the bias scoring against the stored cuts.
func (rde *RealityDivergenceEngine) GetPerceivedCut() FinalCut {
	if len(rde.FinalCuts) == 0 {
		return FinalCut{CutVersion: -1, NarrativeSummary: "No cuts rendered."}
	}
	
	bestMatchVersion := -1
	maxScore := -1000000.0
	
	// For simplicity in this simulation, we assume the bias applied during rendering 
	// (in RenderAllCuts) is the 'perfect' match for this engine instance.
	// Since we don't have an external bias input here, we'll just return the first one,
	// but in a real system, the engine would need to score the 100 results against the user input.

	// To simulate the *result* of the filtering, we can try to find the cut most closely resembling
	// the parameters we used to generate *one* specific target version, which we'll arbitrarily set to Cut 0.
	
	if _, ok := rde.FinalCuts[0]; ok {
		return rde.FinalCuts[0]
	}
	
	// Fallback
	for _, cut := range rde.FinalCuts {
		return cut
	}
	
	return FinalCut{CutVersion: -2, NarrativeSummary: "Error finding best match."}
}
