import math
from typing import Dict, List, Any, Optional

class ParadoxProfile:
    """Represents an individual viewer's deepest paradoxes."""
    def __init__(self, paradox_scores: Dict[str, float]):
        """
        Initializes a ParadoxProfile.

        Args:
            paradox_scores: A dictionary where keys are paradox names (e.g., "Freedom_vs_Security")
                            and values are floats from -1.0 to 1.0.
                            1.0 implies strong affinity for the "positive" concept (e.g., Freedom).
                            -1.0 implies strong affinity for the "negative" concept (e.g., Security).
                            0.0 implies neutrality or balance.
        """
        # Ensure scores are within the valid range [-1.0, 1.0]
        self.paradox_scores = {k: max(-1.0, min(1.0, v)) for k, v in paradox_scores.items()}

    def get_score(self, paradox_name: str) -> float:
        """Returns the score for a specific paradox, defaulting to 0.0 if not defined."""
        return self.paradox_scores.get(paradox_name, 0.0)

    def __repr__(self):
        return f"ParadoxProfile({self.paradox_scores})"


class FilmElement:
    """Base class for adaptable film elements (scenes and endings)."""
    def __init__(self, element_id: str, description: str, paradox_modifiers: Dict[str, Dict[str, Any]]):
        """
        Initializes a FilmElement.

        Args:
            element_id: Unique identifier for the element.
            description: Textual description of the element.
            paradox_modifiers: A dictionary defining how this element interacts with paradoxes.
                               Key: paradox name (str)
                               Value: Dict with:
                                   - "target_value": float (-1.0 to 1.0) - the paradox score this element aligns with.
                                   - "weight": float (0.0 to 1.0) - how strongly this element relates to the paradox.
                                   - "mode": str ("reinforce"|"challenge"|"neutralize") -
                                       - "reinforce": Selects if viewer's score is close to target_value.
                                       - "challenge": Selects if viewer's score is opposite of target_value.
                                       - "neutralize": Selects if viewer's score is extreme and this aims to bring it to 0.
        """
        self.element_id = element_id
        self.description = description
        self.paradox_modifiers = paradox_modifiers

    def __repr__(self):
        return f"{self.__class__.__name__}(id='{self.element_id}', description='{self.description[:50]}...', modifiers={len(self.paradox_modifiers)} paradoxes)"


class Scene(FilmElement):
    """Represents an adaptable scene in the film."""
    def __init__(self, element_id: str, description: str,
                 paradox_modifiers: Dict[str, Dict[str, Any]], next_scene_ids: List[str]):
        super().__init__(element_id, description, paradox_modifiers)
        self.next_scene_ids = next_scene_ids


class Ending(FilmElement):
    """Represents an adaptable ending for the film."""
    def __init__(self, element_id: str, description: str, paradox_modifiers: Dict[str, Dict[str, Any]]):
        super().__init__(element_id, description, paradox_modifiers)
        # An explicit flag for easy type checking/distinction if needed, though `isinstance` is also fine.
        self.is_ending = True


class MultiversalAudienceEngagement:
    """
    The algorithm that adapts the film's scenes and ending for each individual viewer
    based on their deepest paradoxes.
    """
    def __init__(self, script_data: Dict[str, Dict[str, Any]], starting_scene_id: str):
        """
        Initializes the engagement engine with the complete film script.

        Args:
            script_data: A dictionary containing all film elements (scenes and endings).
                         Expected structure: {"element_id": {... FilmElement data ...}}
            starting_scene_id: The ID of the first scene to begin the adaptation.
        """
        self._elements: Dict[str, FilmElement] = {}
        self.starting_scene_id = starting_scene_id
        self._load_script(script_data)

    def _load_script(self, script_data: Dict[str, Dict[str, Any]]):
        """Loads scene and ending data into FilmElement objects."""
        for element_id, data in script_data.items():
            if "next_scene_ids" in data:
                self._elements[element_id] = Scene(
                    element_id=element_id,
                    description=data["description"],
                    paradox_modifiers=data.get("paradox_modifiers", {}),
                    next_scene_ids=data["next_scene_ids"]
                )
            else:
                self._elements[element_id] = Ending(
                    element_id=element_id,
                    description=data["description"],
                    paradox_modifiers=data.get("paradox_modifiers", {})
                )

    def _calculate_element_score(self, viewer_profile: ParadoxProfile, element: FilmElement) -> float:
        """
        Calculates a compatibility score for a given film element based on the viewer's paradox profile.
        Higher score means better fit. Scores are normalized to be between 0.0 and 1.0.
        """
        total_score = 0.0
        total_weight = 0.0

        for paradox_name, modifier in element.paradox_modifiers.items():
            viewer_score = viewer_profile.get_score(paradox_name)
            target_value = modifier.get("target_value", 0.0)
            weight = modifier.get("weight", 0.5)
            mode = modifier.get("mode", "reinforce")

            match_score = 0.0
            if mode == "reinforce":
                # Score is higher when viewer's score is closer to the element's target_value.
                # abs_diff ranges from 0 (perfect match) to 2 (perfect opposite).
                # 1 - (abs_diff / 2) normalizes this to 0-1, where 1 is perfect match.
                abs_diff = abs(viewer_score - target_value)
                match_score = (1.0 - (abs_diff / 2.0))
            elif mode == "challenge":
                # Score is higher when viewer's score is closer to the *opposite* of the element's target_value.
                abs_diff = abs(viewer_score - (-target_value))
                match_score = (1.0 - (abs_diff / 2.0))
            elif mode == "neutralize":
                # Score is higher when the viewer's score is more extreme, *and* the element's target is 0.0.
                # This mode aims to select elements that can bring an extreme viewer towards neutrality.
                if target_value == 0.0:
                    match_score = abs(viewer_score)
                else:
                    # If "neutralize" mode is used but target_value is not 0, it's a misconfiguration
                    # or implies a different kind of "neutralization" not covered here. Default to low score.
                    match_score = 0.0

            total_score += match_score * weight
            total_weight += weight

        # Avoid division by zero if no paradox modifiers were applied
        return total_score / total_weight if total_weight > 0 else 0.0

    def adapt_film_for_viewer(self, viewer_profile: ParadoxProfile) -> List[str]:
        """
        Generates a personalized film path (sequence of element IDs) for a given viewer.

        Args:
            viewer_profile: The ParadoxProfile of the individual viewer.

        Returns:
            A list of film element IDs representing the personalized movie path.
        """
        personalized_path: List[str] = []
        current_element_id: Optional[str] = self.starting_scene_id
        
        # Guard against invalid starting scene
        if current_element_id not in self._elements:
            raise ValueError(f"Starting scene ID '{current_element_id}' not found in script.")

        # Loop through the film, choosing the best path at each branching point
        while current_element_id:
            current_element = self._elements.get(current_element_id)

            if not current_element:
                # This should ideally be caught by script validation or a more robust error handling
                print(f"Warning: Element ID '{current_element_id}' not found in script. Path terminated early.")
                break

            personalized_path.append(current_element_id)

            if isinstance(current_element, Ending):
                break  # Reached an ending, stop the path generation

            if isinstance(current_element, Scene):
                if not current_element.next_scene_ids:
                    print(f"Warning: Scene '{current_element_id}' has no defined next scenes. Path terminated.")
                    break

                best_next_element_id: Optional[str] = None
                highest_score = -1.0  # Scores are normalized between 0 and 1, so -1.0 is a safe start

                # Evaluate all possible next scenes/endings based on viewer's profile
                for next_id in current_element.next_scene_ids:
                    next_element = self._elements.get(next_id)
                    if next_element:
                        score = self._calculate_element_score(viewer_profile, next_element)
                        if score > highest_score:
                            highest_score = score
                            best_next_element_id = next_id
                    else:
                        print(f"Warning: Next element ID '{next_id}' referenced by '{current_element.element_id}' not found in script. Skipping.")

                current_element_id = best_next_element_id
                if not current_element_id:
                    print(f"Warning: No valid next scene found for '{current_element.element_id}' based on scoring. Path terminated.")
                    break
            else:
                # Fallback for unexpected element types, though `isinstance` checks above should cover this.
                print(f"Error: Unknown element type encountered for ID '{current_element_id}'. Path terminated.")
                break

        return personalized_path