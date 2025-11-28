import random
import json
from typing import List, Dict, Any

class DirectorAIModule:
    """
    The AI module (Agent #102) responsible for generating 100 conflicting film treatments simultaneously.
    It orchestrates the generation of diverse and contradictory plotlines for the movie starring James.
    """

    def __init__(self, num_treatments: int = 100, protagonist_name: str = "James"):
        self.num_treatments = num_treatments
        self.protagonist_name = protagonist_name
        self.adversary_count = 100
        self.treatments: List[Dict[str, Any]] = []
        self.base_concepts = [
            "Time Loop Paradox",
            "Virtual Reality Overload",
            "Alien Invasion Cover-up",
            "Magic System Collapse",
            "Dystopian Bureaucracy Breakdown",
            "Sentient Nanobot Plague",
            "Historical Anomaly Correction",
            "Mind-Swapping Thriller",
            "Deep Sea Civilization Revelation",
            "Interdimensional Heist",
        ]
        self.conflict_styles = [
            "Existential Horror",
            "Action-Comedy Satire",
            "Neo-Noir Detective",
            "Epic Space Opera",
            "Psychological Slow-Burn",
            "Found Footage Documentary Style",
            "Absurdist Drama",
            "High-Octane Spy Thriller",
            "Victorian Gothic Mystery",
            "Post-Apocalyptic Survival",
        ]

    def _generate_adversary_archetype(self, index: int) -> Dict[str, str]:
        """Generates a unique, contradictory profile for one of the 100 adversaries."""
        archetypes = [
            "The Silent Observer", "The Corporate Overlord", "The Rogue AI Segment",
            "The Betraying Ally", "The Philosophical Nihilist", "The Clumsy Henchman",
            "The Benevolent Tyrant", "The Sentient Ecosystem", "The Mirror Self",
            "The Future Self", "The Past Self's Ghost", "The Unseen Puppet Master"
        ]
        
        # Ensure high variability by combining random elements
        name_prefix = random.choice(["Agent", "Dr.", "Senator", "Glitch", "Echo", "Cipher"])
        name_suffix = random.choice(["Zero", "Omega", "Fractal", "Xanadu", "Morpheus", "Vex"])
        
        role = random.choice(archetypes)
        motive = random.choice([
            "To achieve perfect silence.",
            "To rewrite the laws of physics.",
            "To possess the last analog photograph.",
            "To force James into a permanent state of compliance.",
            "To prove free will is an illusion.",
            "To hoard all forms of synthetic vanilla flavor.",
            "To stop the next sunrise.",
        ])

        return {
            "id": f"Adversary_{index+1}",
            "role_title": f"{name_prefix} {name_suffix} ({role})",
            "primary_objective": motive,
            "power_level_estimate": random.randint(50, 1000)
        }

    def _generate_treatment_details(self, base_concept: str, conflict_style: str, adversary_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generates a single, unique, and contradictory treatment."""
        
        # Generate specific plot contradictions based on the base concept
        twist = random.choice([
            "The resolution hinges on James embracing the adversary's core philosophy.",
            "The entire scenario is revealed to be a hyper-realistic simulation run by a forgotten childhood toy.",
            "The stakes are not global, but confined entirely to the emotional state of a single houseplant.",
            "James realizes he is one of the adversaries in a previous cycle.",
            "The McGuffin turns out to be completely useless, forcing the climax to rely on mundane skills.",
        ])

        # Create a randomized, conflicting antagonist focus
        num_main_antagonists = random.randint(1, 5)
        main_antagonists = random.sample(adversary_list, num_main_antagonists)
        
        # Structure the resulting treatment
        treatment = {
            "treatment_id": f"T_{len(self.treatments) + 1:03d}",
            "title_suggestion": f"The {base_concept.split()[0]} of {random.choice(['Silence', 'Glass', 'Velocity', 'Memory'])}",
            "protagonist": self.protagonist_name,
            "central_concept": base_concept,
            "visual_style": conflict_style,
            "summary_logline": f"When {self.protagonist_name} discovers {base_concept.lower()}, he must face {len(main_antagonists)} primary threats who want to {main_antagonists[0]['primary_objective'].lower().split('to ')[-1]}",
            "key_conflict_driver": twist,
            "antagonist_roster_focus": [
                {"id": a['id'], "role": a['role_title'], "motive_summary": a['primary_objective'][:40] + "..."}
                for a in main_antagonists
            ],
            "required_page_count_projection": random.randint(10, 25), # Pages needed for this specific arc
        }
        return treatment

    def generate_all_treatments(self) -> List[Dict[str, Any]]:
        """
        Orchestrates the generation of 100 highly detailed, conflicting film treatments.
        """
        print(f"DirectorAIModule: Initializing generation for {self.num_treatments} conflicting treatments...")

        # Phase 1: Generate the complete roster of 100 distinct adversaries first
        all_adversaries = [self._generate_adversary_archetype(i) for i in range(self.adversary_count)]
        print(f"DirectorAIModule: Generated {self.adversary_count} unique adversary profiles.")

        self.treatments = []
        for i in range(self.num_treatments):
            # Select random base elements for maximum conflict potential
            base_concept = random.choice(self.base_concepts)
            conflict_style = random.choice(self.conflict_styles)

            # Ensure each treatment draws from the full set of 100 adversaries, 
            # but samples different primary antagonists to create unique story permutations.
            treatment = self._generate_treatment_details(base_concept, conflict_style, all_adversaries)
            self.treatments.append(treatment)
        
        print(f"DirectorAIModule: Successfully generated {len(self.treatments)} complete treatments.")
        return self.treatments

    def save_treatments_to_json(self, filename: str = "film_treatments_100.json"):
        """Saves the generated treatments to a JSON file for review by subsequent modules."""
        output_data = {
            "project_name": "James vs 100 AI Adversaries Cinematic Project",
            "total_treatments": len(self.treatments),
            "adversary_roster_summary": [
                {"id": a['id'], "role": a['role_title']} for a in [
                    self._generate_adversary_archetype(i) for i in range(self.adversary_count)
                ] # Re-generate a snapshot for the save file context
            ],
            "treatments": self.treatments
        }
        
        try:
            with open(filename, 'w') as f:
                json.dump(output_data, f, indent=2)
            print(f"DirectorAIModule: Saved treatments to {filename}")
        except IOError as e:
            print(f"DirectorAIModule: Error saving file {filename}: {e}")

if __name__ == '__main__':
    # Example usage for testing the module
    director = DirectorAIModule(num_treatments=100)
    all_plots = director.generate_all_treatments()
    
    # Display a sample of the generated data
    print("\n--- Sample Treatment 1 ---")
    print(json.dumps(all_plots[0], indent=2))
    
    print("\n--- Sample Treatment 100 ---")
    print(json.dumps(all_plots[-1], indent=2))
    
    # director.save_treatments_to_json() # Uncomment to save the output
