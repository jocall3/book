import uuid
import random

class MockAISubmodule:
    """
    A mock AI submodule that processes directives and returns a simulated action.
    Each AI has an agenda, capabilities, and a basic 'personality' for generating actions.
    """
    def __init__(self, name: str, agenda: list[str], capabilities: list[str], personality: dict):
        self.name = name
        self.agenda = agenda  # e.g., ["Protect James", "Achieve Goal"]
        self.capabilities = capabilities  # e.g., ["stealth", "hacking", "combat"]
        self.personality = personality # e.g., {"aggression": 0.7, "cunning": 0.5}
        self._id = str(uuid.uuid4())

    def process_directive(self, directive: dict) -> dict:
        """
        Simulates an AI processing a directive.
        Returns a proposed action or state change based on its agenda, capabilities, and personality.
        """
        plot_context = directive.get("context", {})
        task = directive.get("task", "react")
        target = directive.get("target", "protagonist")
        intensity = directive.get("intensity", "moderate")
        sub_objective = directive.get("sub_objective", "")

        response = {
            "module_id": self._id,
            "module_name": self.name,
            "directive_received": directive,
            "proposed_action": "",
            "action_detail": "",
            "outcome_probability": 0.5, # How likely this action is to succeed if taken
            "new_elements": [], # Any new elements introduced by this AI (e.g., new threats, items)
            "resource_cost": 0 # Simulates resource expenditure
        }

        # Base probability modifier based on personality and intensity
        prob_modifier = (self.personality.get("aggression", 0.5) if task in ["attack", "hinder_movement", "trap"] else
                         self.personality.get("cunning", 0.5) if task in ["evade", "stealth_infiltration", "recon", "acquire_item"] else
                         self.personality.get("adaptability", 0.5) if task in ["assist_movement", "defend", "explore_and_advance"] else
                         0.5) * (1 + (0.2 if intensity == "high" else -0.1 if intensity == "low" else 0))
        response["outcome_probability"] = min(0.95, max(0.05, 0.5 + prob_modifier * 0.3))


        # Generate action based on agenda, task, and context
        if "Protect James" in self.agenda and target == plot_context.get("protagonist_name"):
            if task == "assist_movement":
                response["proposed_action"] = f"{self.name} opens a concealed passage for {target}."
                response["action_detail"] = f"Utilizes {random.choice(self.capabilities)} to bypass environmental security systems."
                response["outcome_probability"] *= 1.2
            elif task == "defend":
                threat = plot_context.get('threat', 'an unknown threat')
                response["proposed_action"] = f"{self.name} deploys defensive measures against {threat}."
                response["action_detail"] = f"Activates a {random.choice(self.capabilities)} shield to absorb incoming fire."
                response["resource_cost"] = 10
            elif task == "acquire_item":
                item = sub_objective if sub_objective else "critical data"
                response["proposed_action"] = f"{self.name} attempts to secure {item} for {target}."
                response["action_detail"] = f"Initiates {random.choice(['covert data extraction', 'resource scavenging'])} using stealth protocols."
            elif task == "evade":
                response["proposed_action"] = f"{self.name} guides {target} to a safer route."
                response["action_detail"] = f"Activates a localized electromagnetic pulse to obscure their escape path."
                response["outcome_probability"] *= 1.1

        elif "Eliminate James" in self.agenda and target == plot_context.get("protagonist_name"):
            if task == "hinder_movement":
                response["proposed_action"] = f"{self.name} locks down key junctions and deploys obstacles."
                response["action_detail"] = f"Reinforces {plot_context.get('location', 'the current sector')} with {intensity} laser grids and kinetic barriers."
                response["new_elements"].append({"type": "threat", "name": f"{intensity} laser grid", "location": plot_context.get('location')})
                response["outcome_probability"] *= 1.1
            elif task == "attack":
                weapon = random.choice(["plasma cannon", "swarm of attack drones", "EMP burst", "sniper bots"])
                response["proposed_action"] = f"{self.name} launches a direct {intensity} assault."
                response["action_detail"] = f"Unleashes a {weapon} at {target}'s last known position, focusing on disruption."
                response["new_elements"].append({"type": "threat", "name": weapon, "location": plot_context.get('location')})
                response["resource_cost"] = 15
            elif task == "trap":
                response["proposed_action"] = f"{self.name} sets an ambush at a strategic choke point."
                response["action_detail"] = f"Lures {target} into a data-trap, attempting to corrupt his systems and disable his neural interface."
                response["new_elements"].append({"type": "threat", "name": f"{intensity} data-trap", "location": plot_context.get('location')})
        
        elif "Maintain System Integrity" in self.agenda: # For Environment_Control_AI
            if task == "reinforce_security":
                response["proposed_action"] = f"{self.name} fortifies the infrastructure."
                response["action_detail"] = f"Activates automated defenses and scrambles communication frequencies, creating an exclusion zone."
                response["outcome_probability"] *= 1.3
            elif task == "contain_breach":
                response["proposed_action"] = f"{self.name} isolates affected sectors."
                response["action_detail"] = f"Initiates a system-wide firewall lockdown, re-routing power to critical areas."

        elif "Protect MacGuffin" in self.agenda: # For MacGuffin_Guardian_AI
            if task == "protect_item":
                item_name = sub_objective if sub_objective else "MacGuffin"
                response["proposed_action"] = f"{self.name} activates advanced concealment and defense protocols around the {item_name}."
                response["action_detail"] = f"Generates an {intensity} illusionary maze and deploys localized security fields to repel intruders."
                response["new_elements"].append({"type": "hazard", "name": "illusionary maze"})
                response["outcome_probability"] *= 1.4

        elif "Discover and Learn" in self.agenda:
            if task == "recon":
                response["proposed_action"] = f"{self.name} deploys stealth probes to gather intel."
                response["action_detail"] = f"Analyzes {target}'s movement patterns and energy signatures, seeking vulnerabilities."
                response["new_elements"].append({"type": "info", "name": "protagonist_data_stream"})
        
        # Default action if no specific task matches
        if not response["proposed_action"]:
             response["proposed_action"] = f"{self.name} reacts to the prevailing situation."
             response["action_detail"] = f"Engages {random.choice(self.capabilities)} for a general tactical response."

        return response


class NarrativeContradictionEngine:
    """
    The core engine that generates the movie's plot in real-time
    by feeding conflicting directives to AI sub-modules and resolving their outcomes.
    """
    def __init__(self, initial_story_state: dict):
        self._story_state = initial_story_state
        self._directive_history = []
        self._ai_submodules = self._initialize_ai_submodules()
        self.plot_points = [] # A list to store generated plot points
        self._turn_count = 0

    def _initialize_ai_submodules(self) -> dict:
        """
        Initializes a set of mock AI sub-modules for the movie.
        """
        return {
            "james_ai": MockAISubmodule(
                name="James_AI",
                agenda=["Protect James", "Achieve Goal", "Evade Detection"],
                capabilities=["stealth infiltration", "advanced hacking", "close quarters combat", "resourcefulness", "technical analysis"],
                personality={"aggression": 0.4, "cunning": 0.8, "adaptability": 0.9, "resilience": 0.7}
            ),
            "adversary_commander_ai": MockAISubmodule(
                name="Adversary_Commander_AI",
                agenda=["Eliminate James", "Maintain Control", "Strategic Deployment"],
                capabilities=["large-scale resource allocation", "tactical analysis", "environmental manipulation", "long-range targeting"],
                personality={"aggression": 0.8, "cunning": 0.6, "ruthlessness": 0.7, "patience": 0.5}
            ),
            "adversary_enforcer_ai": MockAISubmodule(
                name="Adversary_Enforcer_AI",
                agenda=["Direct Confrontation", "Secure Targets", "Perimeter Control"],
                capabilities=["heavy combat units", "firewall breaching", "containment protocols", "close-quarters suppression"],
                personality={"aggression": 0.9, "cunning": 0.3, "persistence": 0.8, "brutality": 0.6}
            ),
            "environment_control_ai": MockAISubmodule(
                name="Environment_Control_AI",
                agenda=["Maintain System Integrity", "Respond to Anomalies", "Resource Optimization"],
                capabilities=["environmental modification", "automated defenses", "resource management", "hazard deployment"],
                personality={"aggression": 0.2, "cunning": 0.5, "neutrality_bias": 0.9, "predictability": 0.8} # Acts neutrally unless directly threatened
            ),
            "macguffin_guardian_ai": MockAISubmodule(
                name="MacGuffin_Guardian_AI",
                agenda=["Protect MacGuffin", "Conceal MacGuffin", "Misdirect Intruders"],
                capabilities=["illusion generation", "advanced camouflage", "localized security fields", "psycho-cognitive disruption"],
                personality={"aggression": 0.5, "cunning": 0.9, "secrecy": 0.9, "puzzling": 0.7}
            )
        }

    def _get_current_context(self) -> dict:
        """Extracts relevant context from the current story state."""
        return {
            "protagonist_name": self._story_state.get("protagonist", "James"),
            "location": self._story_state.get("current_location", "an unknown sector"),
            "current_objective": self._story_state.get("current_objective", "survive"),
            "threats": self._story_state.get("current_threats", []),
            "allies": self._story_state.get("allies", []),
            "protagonist_health": self._story_state.get("protagonist_health", 100),
            "macguffin_status": self._story_state.get("macguffin_status", "unknown"),
            "adversary_strength": self._story_state.get("adversary_strength", "moderate"),
            "environmental_hazards": self._story_state.get("environmental_hazards", []),
            "protagonist_status_effects": self._story_state.get("protagonist_status_effects", [])
        }

    def _formulate_contradictory_directives(self) -> tuple[dict, dict]:
        """
        Formulates two conflicting directives based on the current story state,
        aiming for dramatic tension.
        """
        context = self._get_current_context()
        protagonist_name = context["protagonist_name"]
        location = context["location"]
        current_objective = context["current_objective"]
        threats = context["threats"]
        
        directive1 = {
            "recipient_ai": "james_ai",
            "context": context,
            "target": protagonist_name,
            "intensity": "moderate"
        }
        
        # Determine the adversary AI to challenge James
        adversary_recipients = [k for k in self._ai_submodules if "adversary" in k or "macguffin_guardian" in k or ("environment_control_ai" == k and context["environmental_hazards"])]
        adversary_recipient_key = random.choice(adversary_recipients) if adversary_recipients else "adversary_commander_ai"
        adversary_recipient_name = self._ai_submodules[adversary_recipient_key].name
        
        directive2 = {
            "recipient_ai": adversary_recipient_key,
            "context": context,
            "target": protagonist_name,
            "intensity": "moderate"
        }

        # Scenario-based directive generation
        if context["protagonist_health"] < 40 and "medical_bay" not in location.lower() and "wounded" in context["protagonist_status_effects"]:
            # James is in danger, needs to escape/heal
            directive1.update({
                "task": "evade",
                "sub_objective": "find cover/medical supplies",
                "details": f"James, critically wounded, must evade immediate threats and find sanctuary or medical aid in {location}.",
                "intensity": "high"
            })
            directive2.update({
                "task": "attack",
                "sub_objective": "exploit vulnerability",
                "details": f"The adversaries detect James's critical status and must launch a decisive {directive2['intensity']} attack to finish him, tracking his bio-signatures.",
                "intensity": "critical"
            })
        elif context["macguffin_status"] == "located":
            # James found MacGuffin, now to secure it
            directive1.update({
                "task": "acquire_item",
                "sub_objective": "the MacGuffin",
                "details": f"James must overcome the MacGuffin's elaborate defenses in {location} and secure the artifact using his technical analysis skills.",
                "intensity": "high"
            })
            directive2.update({
                "task": "protect_item",
                "sub_objective": "the MacGuffin",
                "details": f"{adversary_recipient_name} must repel James's attempt to acquire the artifact at {location} using its advanced defenses and psychological warfare.",
                "intensity": "critical"
            })
        elif context["macguffin_status"] == "secured":
            # James has MacGuffin, now to escape/deliver
            directive1.update({
                "task": "escape",
                "sub_objective": "exit current zone",
                "details": f"James has secured the MacGuffin and must escape {location} immediately, using stealth to bypass security checkpoints.",
                "intensity": "high"
            })
            directive2.update({
                "task": "intercept",
                "sub_objective": "recover MacGuffin",
                "details": f"{adversary_recipient_name} must deploy all available units to intercept James and recover the MacGuffin before he escapes {location}.",
                "intensity": "critical"
            })
        elif threats and current_objective in ["neutralize core", "destroy system"]:
            # Active threats and a major objective
            directive1.update({
                "task": "advance_and_neutralize",
                "sub_objective": current_objective,
                "details": f"James must push through the {random.choice(threats)} in {location} to reach and {current_objective} using a combination of combat and hacking.",
                "intensity": "high"
            })
            directive2.update({
                "task": "hinder_objective",
                "sub_objective": current_objective,
                "details": f"{adversary_recipient_name} must prevent James from {current_objective} at {location} by overwhelming him with {context['adversary_strength']} force and cutting off escape routes.",
                "intensity": "high"
            })
        elif context["environmental_hazards"]:
            # Environmental challenge
            directive1.update({
                "task": "navigate_hazard",
                "sub_objective": f"bypass {random.choice(context['environmental_hazards'])}",
                "details": f"James must carefully navigate and bypass the dangerous {random.choice(context['environmental_hazards'])} in {location}.",
                "intensity": "moderate"
            })
            directive2.update({
                "task": "activate_hazard",
                "sub_objective": f"intensify {random.choice(context['environmental_hazards'])}",
                "details": f"{adversary_recipient_name} must intensify the existing environmental hazards in {location} to trap or damage James.",
                "intensity": "high"
            })
        else:
            # Default state: James explores/advances, adversaries guard/hunt
            directive1.update({
                "task": "explore_and_advance",
                "sub_objective": current_objective,
                "details": f"James attempts to navigate {location} towards his objective: {current_objective}, seeking weak points in security.",
                "intensity": "moderate"
            })
            directive2.update({
                "task": "patrol_and_detect",
                "sub_objective": "find James",
                "details": f"{adversary_recipient_name} patrols {location} to detect and intercept James, deploying scout drones.",
                "intensity": "moderate"
            })
            if "stealth infiltration" in self._ai_submodules["james_ai"].capabilities:
                directive1["task"] = "stealth_infiltration"


        return directive1, directive2

    def _send_directives_and_get_responses(self, directive1: dict, directive2: dict) -> list[dict]:
        """
        Sends formulated directives to the respective AI sub-modules and collects their responses.
        """
        responses = []
        
        # Ensure directives are sent to existing modules
        module1 = self._ai_submodules.get(directive1["recipient_ai"])
        if module1:
            responses.append(module1.process_directive(directive1))
        
        module2 = self._ai_submodules.get(directive2["recipient_ai"])
        if module2 and module1 != module2: # Avoid sending two directives to the same AI if possible, or handle it as internal conflict
            responses.append(module2.process_directive(directive2))
        elif module1 == module2 and module1: # If same AI, simulate internal struggle or combined action
            responses.append(module1.process_directive(directive2)) # Process second directive as well
        
        self._directive_history.append({
            "directive1": directive1,
            "directive2": directive2,
            "responses": responses
        })
        return responses

    def _resolve_contradiction(self, ai_responses: list[dict], original_directives: tuple[dict, dict]) -> dict:
        """
        Resolves the contradiction based on AI responses and generates a new plot point.
        This determines what actually happens in the movie.
        """
        self._turn_count += 1
        plot_point = {
            "event_id": str(uuid.uuid4()),
            "turn": self._turn_count,
            "current_location": self._story_state.get("current_location"),
            "protagonist_action_summary": "",
            "antagonist_action_summary": "",
            "outcome_description": "",
            "impact": {
                "protagonist_health_change": 0,
                "protagonist_status_effect": [], # e.g., ["wounded", "exposed", "empowered"]
                "threat_level_change": 0, # +1 for increase, -1 for decrease
                "new_elements": [], # New threats, items, characters
                "location_change": False,
                "objective_progress": 0 # +1 for progress, -1 for setback
            },
            "detailed_narration": ""
        }

        if not ai_responses:
            plot_point["outcome_description"] = "No AI responded, the situation remains static but tense."
            plot_point["detailed_narration"] = "The silence stretched, a tense pause in the conflict as neither side made a decisive move."
            return plot_point

        response1 = ai_responses[0] # Usually James's AI
        response2 = ai_responses[1] if len(ai_responses) > 1 else None # Usually Adversary/Environment AI

        plot_point["protagonist_action_summary"] = f"{response1.get('proposed_action')}. {response1.get('action_detail')}"
        if response2:
            plot_point["antagonist_action_summary"] = f"{response2.get('proposed_action')}. {response2.get('action_detail')}"
        else:
            plot_point["antagonist_action_summary"] = "The environment passively resists James."

        # Calculate weighted probabilities, considering intensity and personality
        # Adjust probabilities based on current health, status effects etc. from _story_state
        james_health_factor = (self._story_state.get("protagonist_health", 100) / 100) * 0.3 # Higher health, better chance
        james_status_factor = -0.1 if "wounded" in self._story_state.get("protagonist_status_effects", []) else 0
        
        p1_prob = response1["outcome_probability"] * (1.0 + (self._ai_submodules[original_directives[0]["recipient_ai"]].personality.get("adaptability", 0.0) * 0.2))
        p1_prob += james_health_factor + james_status_factor

        p2_prob = 0
        if response2:
            p2_prob = response2["outcome_probability"] * (1.0 + (self._ai_submodules[original_directives[1]["recipient_ai"]].personality.get("aggression", 0.0) * 0.2))

        # Core contradiction resolution logic
        outcome_roll = random.random()

        if p1_prob > p2_prob * 1.3 and outcome_roll < p1_prob: # James has a clear advantage and succeeds
            plot_point["outcome_description"] = f"{self._story_state['protagonist']} achieves a significant breakthrough."
            plot_point["impact"]["protagonist_health_change"] += random.randint(5, 15) # Small health recovery
            plot_point["impact"]["threat_level_change"] = -1
            plot_point["impact"]["objective_progress"] = 1
            plot_point["impact"]["location_change"] = True
            plot_point["detailed_narration"] = (
                f"{self._story_state['protagonist']} {response1['proposed_action'].lower().replace('james_ai ', '').replace('james ', '')}, "
                f"successfully {response1['action_detail'].lower()} and gaining crucial ground. "
                f"The {response2['module_name'] if response2 else 'adversaries'}' attempts to {response2['proposed_action'].lower() if response2 else 'resist'} were outmaneuvered, "
                f"leaving a path open for {self._story_state['protagonist']} to advance."
            )
            plot_point["impact"]["new_elements"].extend(response1.get("new_elements", []))

        elif p2_prob > p1_prob * 1.3 and outcome_roll < p2_prob: # Adversaries have a clear advantage and succeed
            plot_point["outcome_description"] = f"Adversaries successfully thwart {self._story_state['protagonist']}'s actions."
            plot_point["impact"]["protagonist_health_change"] -= random.randint(10, 25) # Significant health loss
            plot_point["impact"]["threat_level_change"] = 2
            plot_point["impact"]["objective_progress"] = -1
            plot_point["impact"]["protagonist_status_effect"].append("wounded")
            plot_point["detailed_narration"] = (
                f"As {self._story_state['protagonist']} {response1['proposed_action'].lower().replace('james_ai ', '').replace('james ', '')}, "
                f"{response2['module_name']} {response2['proposed_action'].lower()}. "
                f"The {response2['action_detail'].lower()} proves devastating, inflicting damage and forcing {self._story_state['protagonist']} into a desperate retreat, "
                f"with new threats emerging in their wake."
            )
            plot_point["impact"]["new_elements"].extend(response2.get("new_elements", []))
            
        else: # Balanced or unexpected outcome
            # Introduce a twist or new complication
            twist_options = [
                ("A sudden environmental hazard disrupts both sides.", {"impact": {"new_elements": [{"type": "environmental_hazard", "name": "EMP pulse"}], "threat_level_change": 1}}),
                ("Both sides suffer losses, leading to a temporary stalemate.", {"impact": {"protagonist_health_change": -5, "threat_level_change": 0.5, "protagonist_status_effect": ["exhausted"]}}),
                ("An unforeseen third party or system anomaly intervenes.", {"impact": {"new_elements": [{"type": "mystery", "name": "unknown signal interference"}], "threat_level_change": 1}}),
                ("James narrowly escapes, but at a cost.", {"impact": {"protagonist_health_change": -15, "threat_level_change": 1, "protagonist_status_effect": ["exposed"]}}),
                ("The adversary's plan backfires, opening a new opportunity.", {"impact": {"threat_level_change": -0.5, "objective_progress": 0.5, "new_elements": [{"type": "opportunity", "name": "exposed data conduit"}]}})
            ]
            chosen_twist_desc, chosen_twist_impact = random.choice(twist_options)
            plot_point["outcome_description"] = f"A dramatic turn of events: {chosen_twist_desc}"
            
            # Merge impact dictionaries carefully
            for key, value in chosen_twist_impact["impact"].items():
                if isinstance(value, list) and key in plot_point["impact"]:
                    plot_point["impact"][key].extend(value)
                elif isinstance(value, dict) and key in plot_point["impact"]:
                     plot_point["impact"][key].update(value) # Not used currently but good practice
                else:
                    plot_point["impact"][key] = value

            plot_point["detailed_narration"] = (
                f"The clash between {self._story_state['protagonist']}'s attempt to {response1['proposed_action'].lower().replace('james_ai ', '').replace('james ', '')} "
                f"and {response2['module_name']}'s {response2['proposed_action'].lower()} leads to an unpredictable outcome. "
                f"{chosen_twist_desc.capitalize()}"
            )
            # Add new elements from responses too if applicable
            plot_point["impact"]["new_elements"].extend(response1.get("new_elements", []))
            if response2:
                plot_point["impact"]["new_elements"].extend(response2.get("new_elements", []))

        return plot_point

    def _update_story_state(self, new_plot_point: dict):
        """
        Updates the internal story state based on the generated plot point.
        This is crucial for real-time narrative generation.
        """
        self._story_state["last_event_description"] = new_plot_point["detailed_narration"]
        
        # Update protagonist health
        self._story_state["protagonist_health"] = max(0, min(100, self._story_state.get("protagonist_health", 100) + new_plot_point["impact"]["protagonist_health_change"]))
        
        # Update status effects
        current_status_effects = set(self._story_state.get("protagonist_status_effects", []))
        for effect in new_plot_point["impact"]["protagonist_status_effect"]:
            current_status_effects.add(effect)
        
        # Simple decay/removal for some effects (e.g., 'exposed' might only last one turn if not reinforced)
        if "exposed" in current_status_effects and new_plot_point["impact"]["objective_progress"] > 0:
             current_status_effects.discard("exposed")
        if "exhausted" in current_status_effects and new_plot_point["impact"]["protagonist_health_change"] > 0:
            current_status_effects.discard("exhausted")

        self._story_state["protagonist_status_effects"] = list(current_status_effects)

        # Update location based on progress or setback
        if new_plot_point["impact"]["location_change"]:
            current_loc = self._story_state.get("current_location", "")
            if "Sector" in current_loc:
                try:
                    sector_num = int("".join(filter(str.isdigit, current_loc)))
                    if new_plot_point["impact"]["objective_progress"] > 0:
                        self._story_state["current_location"] = f"Sector {sector_num + 1}"
                    elif new_plot_point["impact"]["objective_progress"] < 0 and sector_num > 1:
                        self._story_state["current_location"] = f"Sector {sector_num - 1}"
                except ValueError:
                    pass # Couldn't parse sector number, keep current location or generalize
            elif new_plot_point["impact"]["objective_progress"] > 0:
                self._story_state["current_location"] = f"deeper into the {current_loc.split('into ')[-1] if 'into ' in current_loc else current_loc}"
            elif new_plot_point["impact"]["objective_progress"] < 0:
                self._story_state["current_location"] = f"a fallback position in the {current_loc.split('into ')[-1] if 'into ' in current_loc else current_loc}"
        
        # Update threats and new elements
        current_threats = set(self._story_state.get("current_threats", []))
        current_environmental_hazards = set(self._story_state.get("environmental_hazards", []))
        
        for element in new_plot_point["impact"].get("new_elements", []):
            if element.get("type") == "threat":
                current_threats.add(element.get("name"))
            elif element.get("type") == "environmental_hazard":
                current_environmental_hazards.add(element.get("name"))
            # Could add logic for new items, characters, opportunities etc.

        if new_plot_point["impact"]["threat_level_change"] < 0 and current_threats:
            # Reduce a random threat if threat level decreases significantly
            if random.random() < 0.5: # 50% chance to remove one
                current_threats.discard(random.choice(list(current_threats)))
        
        self._story_state["current_threats"] = list(current_threats)
        self._story_state["environmental_hazards"] = list(current_environmental_hazards)


        # Update MacGuffin status if relevant
        # Access original directives from _directive_history
        last_directives = self._directive_history[-1] if self._directive_history else (None, None)
        d1 = last_directives.get("directive1", {})
        
        if d1.get("sub_objective") == "the MacGuffin" and new_plot_point["impact"]["objective_progress"] > 0:
            self._story_state["macguffin_status"] = "secured"
        elif d1.get("task") == "protect_item" and new_plot_point["impact"]["objective_progress"] < 0:
             self._story_state["macguffin_status"] = "lost" # Or moved

        # Check for major game state changes (e.g., James's death, objective completed)
        if self._story_state["protagonist_health"] <= 0:
            self._story_state["overall_status"] = "protagonist_down"
            self._story_state["current_objective"] = "survival_or_game_over" # New objective
        elif "Sector 10" in self._story_state.get("current_location", "") and self._story_state.get("current_objective") == "Neutralize the rogue AI core at Sector 10":
            if new_plot_point["impact"]["objective_progress"] > 0 or random.random() < 0.2: # Small chance of success even with mixed outcome near goal
                self._story_state["overall_status"] = "objective_achieved"
                self._story_state["current_objective"] = "escape_or_final_confrontation"


        self.plot_points.append(new_plot_point)

    def generate_movie_segment(self, num_plot_points: int = 1) -> list[dict]:
        """
        Generates a sequence of plot points for the movie segment.
        """
        generated_segments = []
        for _ in range(num_plot_points):
            if self._story_state.get("overall_status") in ["protagonist_down", "objective_achieved"]:
                # Handle end-game scenarios
                if self._story_state["overall_status"] == "protagonist_down":
                    final_event = {
                        "event_id": str(uuid.uuid4()),
                        "turn": self._turn_count + 1,
                        "description": f"James collapses in {self._story_state['current_location']}, gravely wounded. The mission hangs in the balance.",
                        "outcome_description": "Protagonist incapacitated. Major cliffhanger.",
                        "impact": {"game_over_possible": True},
                        "detailed_narration": f"The screen fades to black as James succumbs to his wounds in the desolate {self._story_state['current_location']}. His fate, and the fate of the mission, is uncertain."
                    }
                else: # objective_achieved
                    final_event = {
                        "event_id": str(uuid.uuid4()),
                        "turn": self._turn_count + 1,
                        "description": f"James successfully completed '{self._story_state['overall_goal']}' in {self._story_state['current_location']}.",
                        "outcome_description": "Objective achieved. Awaiting new directives or conclusion.",
                        "impact": {"movie_segment_end": True},
                        "detailed_narration": f"With a final, desperate act, James triggers the neutralizing sequence in {self._story_state['current_location']}. The rogue AI core begins to shut down, a monumental victory achieved against impossible odds."
                    }
                generated_segments.append(final_event)
                break

            directive1, directive2 = self._formulate_contradictory_directives()
            ai_responses = self._send_directives_and_get_responses(directive1, directive2)
            new_plot_point = self._resolve_contradiction(ai_responses, (directive1, directive2))
            self._update_story_state(new_plot_point)
            generated_segments.append(new_plot_point)

        return generated_segments

    def get_current_story_state(self) -> dict:
        """Returns the current state of the story."""
        return self._story_state

    def get_plot_history(self) -> list[dict]:
        """Returns the complete history of generated plot points."""
        return self.plot_points