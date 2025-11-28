package systems

import (
	"github.com/sirupsen/logrus"
	"github.com/wollac/go-home-assistant-api-client/pkg/common"

	"github.com/yourusername/yourprojectname/src/world_engine/world"
)

// UniversalBasicContradictionIncomeSystem manages the distribution of UBI based on contradictory beliefs.
type UniversalBasicContradictionIncomeSystem struct {
	BaseIncome float64
	ContradictionMultiplier float64
	MaxIncome  float64 //Maximum income allowed, to prevent extreme wealth accumulation
	Logger      *logrus.Logger
}

// NewUniversalBasicContradictionIncomeSystem creates a new UniversalBasicContradictionIncomeSystem.
func NewUniversalBasicContradictionIncomeSystem(baseIncome, contradictionMultiplier, maxIncome float64, logger *logrus.Logger) *UniversalBasicContradictionIncomeSystem {
	return &UniversalBasicContradictionIncomeSystem{
		BaseIncome:  baseIncome,
		ContradictionMultiplier: contradictionMultiplier,
		MaxIncome:  maxIncome,
		Logger: logger,
	}
}

// Update updates the income of each citizen based on the strength of their contradictory beliefs.
func (s *UniversalBasicContradictionIncomeSystem) Update(w *world.World) {
	for _, entity := range w.Entities {
		citizen, ok := entity.GetComponent(world.CitizenComponentType).(*world.Citizen)
		if !ok {
			continue // Only process citizens
		}

		beliefs, ok := entity.GetComponent(world.BeliefComponentType).(*world.Beliefs)
		if !ok {
			s.Logger.Warnf("Citizen %d has no BeliefComponent.", entity.ID)
			continue
		}

		// Calculate income based on the strength of contradictory beliefs.
		contradictionScore := s.calculateContradictionScore(beliefs)
		income := s.BaseIncome + (contradictionScore * s.ContradictionMultiplier)

		// Apply maximum income cap.
		if income > s.MaxIncome {
			income = s.MaxIncome
		}

		// Add income to the citizen's wealth.
		citizen.Wealth += income
		s.Logger.Debugf("Citizen %d received UBI of %.2f, new wealth: %.2f, contradiction score: %.2f", entity.ID, income, citizen.Wealth, contradictionScore)
	}
}

// calculateContradictionScore calculates a score based on the strength of contradictory beliefs.
// This is a simplified example and can be made more complex based on specific requirements.
func (s *UniversalBasicContradictionIncomeSystem) calculateContradictionScore(beliefs *world.Beliefs) float64 {
	// Iterate over beliefs and look for pairs that are contradictory.
	// For simplicity, we'll assume that any two beliefs are potentially contradictory.
	// A more sophisticated implementation would use a knowledge base or rules to determine actual contradictions.

	score := 0.0
	numBeliefs := len(beliefs.Beliefs)

	//Consider the strength of each opposing belief against the total number of beliefs present.
	//This rewards those who strongly hold beliefs that are unpopular (more contradictory).
	for _, belief := range beliefs.Beliefs {
		contradictoryWeighting := 1.0 - (float64(len(beliefs.Beliefs)-1) / float64(numBeliefs))
		score += belief.Strength * contradictoryWeighting

	}
	return score
}

func (s *UniversalBasicContradictionIncomeSystem) Name() string {
	return "UniversalBasicContradictionIncomeSystem"
}
