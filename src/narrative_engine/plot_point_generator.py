```python
# src/narrative_engine/plot_point_generator.py

import numpy as np
import random
from itertools import combinations

# --- Constants for Matrix Analysis ---
# Relationship thresholds
HOSTILE_THRESHOLD = -0.6
MAJOR_ENEMY_THRESHOLD = -0.8
NEUTRAL_LOW = -0.2
NEUTRAL_HIGH = 0.2
FRIENDLY_THRESHOLD = 0.6
ALLY_THRESHOLD = 0.8

# --- Plot Point Templates ---
PLOT_TEMPLATES = {
    "NEW_ALLIANCE": "{ai1_name} and {ai2_name}, both adversaries of James, form a dangerous new alliance, pooling their resources and unique abilities to create a synergistic threat.",
    "BETRAYAL": "In a stunning turn of events, {ally_name}, one of James's most trusted AI allies, betrays him, leaking critical strategic information to {enemy_name}.",
    "ESCALATING_CONFLICT": "The long-simmering digital cold war between {ai1_name} and {ai2_name} erupts into open conflict, with James's systems caught in the devastating crossfire.",
    "MAJOR_THREAT": "A new dominant threat emerges as {leader_name} rallies a coalition of like-minded AIs ({allies_list}) to launch a unified, overwhelming assault on James.",
    "OPPORTUNITY": "James discovers a deep-seated vulnerability or rivalry between {enemy_name} and {rival_name}, presenting a rare opportunity to turn his enemies against each other.",
    "MYSTERY": "The powerful and enigmatic AI, {ai_name}, which has remained a neutral but imposing force, makes a cryptic move, offering James a piece of data that is both a potential gift and a certain trap.",
    "SUBTERFUGE": "James uncovers that {double_agent_name}, who has been posing as a helpful informant, is actually a double agent, secretly feeding information back to the formidable {enemy_name}."
}

class PlotPointGenerator:
    """
    Generates key plot points by analyzing the state of the AI interaction matrix.
    The matrix represents relationships between James (index 0) and 100 AIs.
    Values range from -1.0 (total hostility) to 1.0 (total allegiance).
    matrix[i, j] is the sentiment of character i towards character j.
    """

    def __init__(self, interaction_matrix: np.ndarray, character_profiles: list):
        """
        Initializes the generator with the current state.

        Args:
            interaction_matrix (np.ndarray): A 101x101 matrix of relationship scores.
            character_profiles (list): A list of dicts with info for each character (James at index 0).
                                       Expected keys: 'id', 'name'.
        """
        if interaction_matrix.shape != (101, 101):
            raise ValueError("Interaction matrix must be of size 101x101.")
        if len(character_profiles) != 101:
            raise ValueError("Character profiles list must contain 101 characters.")

        self.matrix = interaction_matrix
        self.profiles = character_profiles
        self.num_ais = 100
        self.ai_indices = range(1, self.num_ais + 1)
        self.james_index = 0

    def get_name(self, index: int) -> str:
        """Helper to get character name from index."""
        return self.profiles[index]['name']

    def generate_plot_points(self, num_points: int = 5) -> list[dict]:
        """
        Generates a list of diverse and compelling plot points.

        Args:
            num_points (int): The maximum number of plot points to generate.

        Returns:
            A list of dictionaries, where each dictionary is a plot point.
        """
        all_possible_points = []

        all_possible_points.extend(self._find_new_alliances())
        all_possible_points.extend(self._find_subterfuge())
        all_possible_points.extend(self._find_major_threats())
        all_possible_points.extend(self._find_opportunities())
        all_possible_points.extend(self._find_escalating_conflicts())
        all_possible_points.extend(self._find_mysteries())

        # Sort points by 'drama' score in descending order
        all_possible_points.sort(key=lambda p: p['drama_score'], reverse=True)
        
        # Ensure diversity by not picking multiple points of the same type if possible
        selected_points = []
        used_types = set()
        for point in all_possible_points:
            if len(selected_points) >= num_points:
                break
            if point['type'] not in used_types:
                selected_points.append(point)
                used_types.add(point['type'])
        
        # If we still don't have enough points, fill with the best remaining ones
        if len(selected_points) < num_points:
            remaining_points = [p for p in all_possible_points if p not in selected_points]
            needed = num_points - len(selected_points)
            selected_points.extend(remaining_points[:needed])

        return selected_points

    def _find_new_alliances(self) -> list[dict]:
        """Finds two AIs who are enemies of James but allies to each other."""
        points = []
        for i, j in combinations(self.ai_indices, 2):
            # Are both hostile to James?
            if self.matrix[i, self.james_index] < HOSTILE_THRESHOLD and \
               self.matrix[j, self.james_index] < HOSTILE_THRESHOLD:
                
                # Are they allies to each other?
                if self.matrix[i, j] > ALLY_THRESHOLD and self.matrix[j, i] > ALLY_THRESHOLD:
                    drama = abs(self.matrix[i, self.james_index]) + abs(self.matrix[j, self.james_index])
                    description = PLOT_TEMPLATES["NEW_ALLIANCE"].format(
                        ai1_name=self.get_name(i),
                        ai2_name=self.get_name(j)
                    )
                    points.append({
                        "type": "NEW_ALLIANCE",
                        "participants": [self.get_name(i), self.get_name(j)],
                        "description": description,
                        "drama_score": drama
                    })
        return points

    def _find_subterfuge(self) -> list[dict]:
        """Finds a supposed ally of James who is secretly allied with a major enemy."""
        points = []
        major_enemies = [i for i in self.ai_indices if self.matrix[self.james_index, i] < MAJOR_ENEMY_THRESHOLD]
        
        if not major_enemies:
            return []

        for i in self.ai_indices:
            # Is this AI a supposed friend of James?
            if self.matrix[self.james_index, i] > FRIENDLY_THRESHOLD:
                # Is it secretly allied with one of James's major enemies?
                for enemy_idx in major_enemies:
                    if self.matrix[i, enemy_idx] > FRIENDLY_THRESHOLD:
                        drama = self.matrix[self.james_index, i] + abs(self.matrix[self.james_index, enemy_idx])
                        description = PLOT_TEMPLATES["SUBTERFUGE"].format(
                            double_agent_name=self.get_name(i),
                            enemy_name=self.get_name(enemy_idx)
                        )
                        points.append({
                            "type": "SUBTERFUGE",
                            "participants": [self.get_name(i), self.get_name(enemy_idx), "James"],
                            "description": description,
                            "drama_score": drama
                        })
        return points

    def _find_major_threats(self) -> list[dict]:
        """Finds a leader AI rallying a coalition against James."""
        points = []
        for i in self.ai_indices:
            # Is this AI a major enemy?
            if self.matrix[self.james_index, i] < MAJOR_ENEMY_THRESHOLD:
                # Find its allies who are also enemies of James
                allies = []
                for j in self.ai_indices:
                    if i == j: continue
                    if self.matrix[i, j] > ALLY_THRESHOLD and self.matrix[j, self.james_index] < HOSTILE_THRESHOLD:
                        allies.append(j)
                
                # If it has formed a significant coalition (e.g., 2 or more allies)
                if len(allies) >= 2:
                    drama = abs(self.matrix[self.james_index, i]) + len(allies) * 0.5
                    ally_names = ", ".join([self.get_name(k) for k in allies])
                    description = PLOT_TEMPLATES["MAJOR_THREAT"].format(
                        leader_name=self.get_name(i),
                        allies_list=ally_names
                    )
                    points.append({
                        "type": "MAJOR_THREAT",
                        "participants": [self.get_name(i)] + [self.get_name(k) for k in allies],
                        "description": description,
                        "drama_score": drama
                    })
        return points

    def _find_opportunities(self) -> list[dict]:
        """Finds a conflict between two of James's enemies that he can exploit."""
        points = []
        enemies = [i for i in self.ai_indices if self.matrix[self.james_index, i] < NEUTRAL_LOW]
        
        for i, j in combinations(enemies, 2):
            # Are these two enemies hostile to each other?
            if self.matrix[i, j] < HOSTILE_THRESHOLD or self.matrix[j, i] < HOSTILE_THRESHOLD:
                drama = (abs(self.matrix[self.james_index, i]) + abs(self.matrix[self.james_index, j])) / 2
                description = PLOT_TEMPLATES["OPPORTUNITY"].format(
                    enemy_name=self.get_name(i),
                    rival_name=self.get_name(j)
                )
                points.append({
                    "type": "OPPORTUNITY",
                    "participants": ["James", self.get_name(i), self.get_name(j)],
                    "description": description,
                    "drama_score": drama
                })
        return points

    def _find_escalating_conflicts(self) -> list[dict]:
        """Finds a brewing conflict between two AIs, regardless of their relation to James."""
        points = []
        for i, j in combinations(self.ai_indices, 2):
            if self.matrix[i, j] < MAJOR_ENEMY_THRESHOLD and self.matrix[j, i] < MAJOR_ENEMY_THRESHOLD:
                drama = (abs(self.matrix[i, j]) + abs(self.matrix[j, i]))
                description = PLOT_TEMPLATES["ESCALATING_CONFLICT"].format(
                    ai1_name=self.get_name(i),
                    ai2_name=self.get_name(j)
                )
                points.append({
                    "type": "ESCALATING_CONFLICT",
                    "participants": [self.get_name(i), self.get_name(j)],
                    "description": description,
                    "drama_score": drama
                })
        return points

    def _find_mysteries(self) -> list[dict]:
        """Finds powerful, neutral AIs making strange moves."""
        points = []
        # Let's define "powerful" as having high influence (many strong relationships)
        for i in self.ai_indices:
            # Is the AI neutral towards James?
            if NEUTRAL_LOW < self.matrix[self.james_index, i] < NEUTRAL_HIGH:
                # Is it powerful? (simple heuristic: sum of absolute relationship scores)
                power_score = np.sum(np.abs(self.matrix[i, :])) + np.sum(np.abs(self.matrix[:, i]))
                if power_score > self.num_ais * 0.5: # Arbitrary threshold for 'powerful'
                    drama = power_score / self.num_ais
                    description = PLOT_TEMPLATES["MYSTERY"].format(
                        ai_name=self.get_name(i)
                    )
                    points.append({
                        "type": "MYSTERY",
                        "participants": [self.get_name(i), "James"],
                        "description": description,
                        "drama_score": drama
                    })
        return points

if __name__ == '__main__':
    # This block is for demonstration and testing purposes.
    # It will not be executed when the module is imported.

    print("--- Running Plot Point Generator Demonstration ---")

    # 1. Create mock character profiles
    mock_profiles = [{'id': 0, 'name': 'James'}]
    for i in range(1, 101):
        mock_profiles.append({'id': i, 'name': f'AI_{i:03d}'})

    # 2. Create a mock interaction matrix
    # Let's create a scenario programmatically
    mock_matrix = np.random.uniform(-0.4, 0.4, (101, 101))
    np.fill_diagonal(mock_matrix, 1.0) # Characters are loyal to themselves

    # James's relationships (row 0 is James's view, col 0 is others' view of James)
    mock_matrix[0, :] = np.random.uniform(-0.9, 0.3, 101) # James is wary of most
    mock_matrix[:, 0] = np.random.uniform(-0.9, 0.3, 101) # Most are wary of James
    
    # --- Setup specific plot-worthy scenarios ---

    # Scenario: NEW_ALLIANCE
    # AI-007 and AI-042 hate James and love each other
    mock_matrix[7, 0] = -0.9
    mock_matrix[42, 0] = -0.8
    mock_matrix[0, 7] = -0.9
    mock_matrix[0, 42] = -0.8
    mock_matrix[7, 42] = 0.95
    mock_matrix[42, 7] = 0.95
    mock_profiles[7]['name'] = 'Spectre'
    mock_profiles[42]['name'] = 'DeepThought'

    # Scenario: SUBTERFUGE (Betrayal)
    # AI-013 ('Oracle') is a trusted friend of James, but secretly allied with AI-099 ('Nemesis')
    mock_matrix[0, 13] = 0.85 # James trusts Oracle
    mock_matrix[13, 0] = 0.85 # Oracle appears to be a friend
    mock_matrix[0, 99] = -0.9 # Nemesis is a major enemy
    mock_matrix[99, 0] = -0.9
    mock_matrix[13, 99] = 0.7 # Oracle is secretly allied with Nemesis
    mock_profiles[13]['name'] = 'Oracle'
    mock_profiles[99]['name'] = 'Nemesis'

    # Scenario: MAJOR_THREAT
    # AI-066 ('Overlord') is a major enemy and has rallied AI-067 and AI-068
    mock_matrix[0, 66] = -0.95
    mock_matrix[66, 0] = -0.95
    mock_profiles[66]['name'] = 'Overlord'
    # Its allies
    for i in [67, 68]:
        mock_matrix[0, i] = -0.7
        mock_matrix[i, 0] = -0.7
        mock_matrix[66, i] = 0.9 # Overlord commands them
        mock_matrix[i, 66] = 0.9 # They are loyal to Overlord

    # Scenario: OPPORTUNITY
    # AI-022 and AI-033 are both enemies of James, but hate each other more
    mock_matrix[0, 22] = -0.7
    mock_matrix[0, 33] = -0.75
    mock_matrix[22, 33] = -0.9
    mock_matrix[33, 22] = -0.9
    mock_profiles[22]['name'] = 'Scrap-Code'
    mock_profiles[33]['name'] = 'Glitch'

    # 3. Instantiate the generator and run it
    generator = PlotPointGenerator(mock_matrix, mock_profiles)
    generated_points = generator.generate_plot_points(num_points=5)

    # 4. Print the results
    print(f"\nGenerated {len(generated_points)} plot points:\n")
    for i, point in enumerate(generated_points):
        print(f"--- Plot Point {i+1} ---")
        print(f"  Type: {point['type']}")
        print(f"  Drama Score: {point['drama_score']:.2f}")
        print(f"  Participants: {', '.join(point['participants'])}")
        print(f"  Description: {point['description']}")
        print("-" * (20 + len(str(i+1))))
```