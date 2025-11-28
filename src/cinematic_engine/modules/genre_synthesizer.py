import random

class GenreSynthesizer:
    """
    A module that seamlessly weaves together disparate cinematic styles.
    It takes a list of base genres and synthesizes a new, unique cinematic vision,
    providing detailed guidelines for narrative, visual, and auditory elements.
    """

    # A simplified knowledge base of genre characteristics for synthesis
    # In a larger project, this data might be loaded from external JSON/YAML files.
    _genre_profiles = {
        "space opera": {
            "description_elements": [
                "a sprawling galactic saga", "epic interstellar conflict across vast cosmic landscapes",
                "high-stakes space adventure and exploration",
                "the struggle for galactic freedom against overwhelming odds",
                "a futuristic epic featuring advanced civilizations and alien races"
            ],
            "visual_keywords": [
                "starships soaring through nebulae", "exotic alien worlds teeming with life",
                "gleaming futuristic cities on distant planets", "laser battles illuminating the void",
                "ancient alien ruins on desolate planets", "grand, imposing architecture in space",
                "hyperdrive streaks across the cosmos", "vast, star-dusted nebulae and asteroid fields"
            ],
            "narrative_themes": [
                "good vs. evil on a galactic scale", "exploration and discovery of new frontiers",
                "destiny and prophecy guiding chosen heroes", "the rise of unlikely heroes against tyranny",
                "complex interstellar politics and shifting alliances", "the meaning of power and responsibility"
            ],
            "character_archetypes": [
                "roguish space captains with a hidden past", "wise alien mentors with ancient knowledge",
                "heroic starfighter pilots defending the innocent", "galactic emperors or despots seeking domination",
                "diplomatic alien envoys navigating fragile peace", "loyal droid companions with unique personalities"
            ],
            "world_elements": [
                "vast galactic empires and federations", "advanced starfaring civilizations and technologies",
                "mysterious cosmic forces and ancient artifacts", "diverse alien races with rich cultures and histories",
                "interstellar trade routes and contested territories", "massive space stations and orbital habitats"
            ],
            "sound_design_notes": [
                "sweeping epic orchestral scores with grand themes", "whooshing starship engines and FTL jumps",
                "blaster fire and energy weapon effects with distinct sounds", "diverse alien vocalizations and languages",
                "the vast, echoing silence of deep space broken by subtle hums", "heroic fanfares and suspenseful stingers"
            ]
        },
        "gritty cyberpunk": {
            "description_elements": [
                "a dystopian future ruled by powerful megacorporations",
                "a low-life, high-tech society struggling for survival",
                "a world of advanced technology and profound social decay",
                "the blurred lines between humanity and machine in a neon-soaked landscape",
                "a dark vision of society where information is power and augmented bodies are currency"
            ],
            "visual_keywords": [
                "rain-slicked, neon-drenched streets of sprawling cities", "smoggy, overcrowded cityscapes reaching into polluted skies",
                "gleaming cybernetic augmentations and prosthetics", "towering holographic advertisements and digital billboards",
                "dark, claustrophobic alleys and hidden marketplaces", "sprawling mega-structures and corporate towers",
                "grungy, cluttered interiors of rundown apartments and bars", "trench coats, tactical gear, and advanced personal tech"
            ],
            "narrative_themes": [
                "corporate greed and its oppressive control over society", "the search for identity and humanity in a synthetic world",
                "the dangers and potential of artificial intelligence and consciousness",
                "stark social inequality and the fight for justice in a broken system",
                "individual rebellion against an overwhelming, all-seeing system", "information warfare and digital espionage"
            ],
            "character_archetypes": [
                "disillusioned hackers and data thieves operating from the shadows", "street-smart mercenaries and fixers",
                "heavily augmented corporate enforcers or assassins", "ruthless corporate executives pulling the strings",
                "sentient androids or synthetics seeking freedom and rights", "underground rebel leaders and activists"
            ],
            "world_elements": [
                "omnipotent megacorporations and their corporate espionage networks", "black markets for illegal cybernetic enhancements and data",
                "sprawling, multi-tiered megacities with distinct social strata", "immersive virtual realities and vast cyberspaces",
                "severely polluted environments and resource scarcity", "rigid social class divides and urban ghettos"
            ],
            "sound_design_notes": [
                "pulsating synth-wave and dark industrial ambient music", "distorted electronic sounds and data glitches",
                "the omnipresent hum of advanced technology and machinery", "the constant patter of rain and distant city noise",
                "sharp, metallic weapon effects and close-quarters combat sounds", "glitchy interface sounds and digital whispers",
                "low, guttural bass lines and high-pitched synth melodies"
            ]
        },
        "noir": {
            "description_elements": [
                "a world shrouded in shadows and moral ambiguity", "a tale of cynicism, desperation, and inevitable fate",
                "a complex mystery unfolding in a dark, corrupt urban landscape",
                "a grim narrative of deception, betrayal, and the unraveling truth",
                "a stylistic exploration of the human condition in a flawed world"
            ],
            "visual_keywords": [
                "stark shadows and high contrast lighting", "persistent rain and atmospheric fog blanketing the city",
                "grimy city streets at night, reflecting neon signs", "smoke-filled rooms and dimly lit bars",
                "fedora hats pulled low and trench coats, obscuring faces", "venetian blind shadows casting stark lines",
                "monochromatic or muted color palettes emphasizing gloom", "moody, low-key lighting for dramatic effect"
            ],
            "narrative_themes": [
                "betrayal, deception, and hidden agendas", "the inescapable grip of fate and inevitability",
                "pervasive moral corruption and institutional rot", "the anti-hero's futile struggle against the system",
                "unrequited love and dangerous liaisons leading to ruin", "the search for truth in a web of lies"
            ],
            "character_archetypes": [
                "hard-boiled, world-weary detectives with a cynical outlook", "seductive and dangerous femme fatales",
                "corrupt politicians and police officials", "ruthless gangsters and crime bosses controlling the city",
                "downtrodden citizens caught in the crossfire", "lonely, cynical protagonists haunted by their past"
            ],
            "world_elements": [
                "grimy urban settings with hidden secrets and backroom deals", "labyrinthine back alleys and forgotten corners of the city",
                "seedy speakeasies, bars, and gambling dens", "corrupt police precincts and courtrooms",
                "dilapidated apartments and grand, decaying mansions", "entrenched underworld organizations and crime syndicates"
            ],
            "sound_design_notes": [
                "melancholy jazz saxophone solos and haunting piano scores", "the rhythmic patter of rain and distant sirens",
                "echoing footsteps on wet pavement in the quiet night", "sharp, muffled gunshots with heavy reverb",
                "monologue voiceovers with a gravelly, introspective tone", "the clinking of ice in a glass and distant chatter"
            ]
        },
        "western": {
            "description_elements": [
                "a rugged frontier tale of survival and expansion", "a saga of justice, vengeance, and lawlessness in the wild west",
                "a story of pioneering spirit against the untamed wilderness",
                "a dramatic portrayal of cowboys, outlaws, and the struggle for civilization",
                "a timeless narrative of moral dilemmas in a land without rules"
            ],
            "visual_keywords": [
                "vast, sun-baked deserts and open plains stretching to the horizon", "dusty frontier towns with wooden boardwalks",
                "classic saloons and general stores as centers of community", "horseback riding across expansive, untamed landscapes",
                "iconic cowboy hats, bandanas, and spurs as symbols of the era", "majestic canyons and rocky terrain formations",
                "smoking revolvers and lever-action rifles in intense shootouts", "steam trains chugging through barren lands",
                "golden hour sunsets casting long shadows over the landscape"
            ],
            "narrative_themes": [
                "vengeance and the pursuit of justice on the frontier", "the relentless struggle against nature and harsh elements",
                "the clash between burgeoning civilization and untamed wilderness", "redemption for a troubled past",
                "the true cost of freedom and independence in a lawless land", "the establishment of law and order"
            ],
            "character_archetypes": [
                "lone gunmen seeking retribution or a new life", "notorious outlaws and their gangs terrorizing the frontier",
                "stoic sheriffs upholding the law in harsh conditions", "resilient settlers and ranchers building new lives",
                "indigenous inhabitants defending their ancestral lands", "ruthless bounty hunters tracking their prey"
            ],
            "world_elements": [
                "isolated frontier towns and settlements struggling to grow", "vast ranches and homesteads across the plains",
                "desolate desert landscapes and imposing mountain ranges", "gold mines and prospecting sites fueling ambition",
                "transcontinental railroads bringing change and conflict", "native American territories and their sacred lands"
            ],
            "sound_design_notes": [
                "iconic twangy guitar scores and melancholic harmonica melodies", "whistling wind across arid landscapes",
                "the rhythmic thud of horse hooves on dusty trails", "sharp gunshots, ricochets, and the distinct click of revolvers",
                "lively saloon piano music and boisterous crowds", "the ominous rattle of a rattlesnake in the quiet desert",
                "distant train whistles signaling arrival or departure", "the creak of leather and the jingle of spurs"
            ]
        }
    }

    def _get_genre_elements(self, genre_name: str) -> dict:
        """Retrieves profile elements for a given genre, handling unknown genres gracefully."""
        return self._genre_profiles.get(genre_name.lower(), {})

    def synthesize_genres(self, genres: list[str], primary_genre: str = None) -> dict:
        """
        Synthesizes a new cinematic genre from a list of base genres.

        Args:
            genres (list[str]): A list of base genres to combine (e.g., ["space opera", "gritty cyberpunk"]).
                                Case-insensitive matching is applied.
            primary_genre (str, optional): An optional genre from the 'genres' list to prioritize
                                           in the synthesis. Its elements will be weighted more heavily.

        Returns:
            dict: A dictionary containing the synthesized genre's name, description, visual style,
                  narrative themes, character archetypes, world elements, and sound design notes.
                  Returns a default "cinematic void" if no valid genres are provided.
        """
        if not genres:
            return {
                "synthesized_genre_name": "Undefined Cinematic Vision",
                "description": "A cinematic void, awaiting inspiration. Please provide at least one genre.",
                "visual_style": [], "narrative_themes": [],
                "character_archetypes": [], "world_elements": [],
                "sound_design_notes": []
            }

        # Filter and get profiles for recognized genres
        recognized_genres_lower = [g.lower() for g in genres if g.lower() in self._genre_profiles]
        if not recognized_genres_lower:
            return {
                "synthesized_genre_name": "Unrecognized Genre Blend",
                "description": f"No recognized genres provided from: {', '.join(genres)}. Defaulting to a standard blend.",
                "visual_style": [], "narrative_themes": [],
                "character_archetypes": [], "world_elements": [],
                "sound_design_notes": []
            }

        selected_genres_profiles = [self._genre_profiles[g] for g in recognized_genres_lower]

        # Aggregate all potential elements
        all_elements = {
            "description_elements": [], "visual_keywords": [], "narrative_themes": [],
            "character_archetypes": [], "world_elements": [], "sound_design_notes": []
        }

        # Accumulate elements from all chosen genres
        for profile in selected_genres_profiles:
            for key in all_elements:
                all_elements[key].extend(profile.get(key, []))

        # Apply prioritization for the primary genre by adding its elements again
        if primary_genre and primary_genre.lower() in recognized_genres_lower:
            p_genre_profile = self._get_genre_elements(primary_genre)
            for key in all_elements:
                all_elements[key].extend(p_genre_profile.get(key, []))
        
        # Ensure distinct elements for final sampling by converting to set then back to list
        for key in all_elements:
            all_elements[key] = list(set(all_elements[key]))

        # Define how many elements to pick for each category (min, max)
        # These numbers are heuristic and can be adjusted for desired output richness
        num_picks = {
            "description_elements": (1, 3),
            "visual_keywords": (3, 6),
            "narrative_themes": (2, 4),
            "character_archetypes": (2, 4),
            "world_elements": (2, 4),
            "sound_design_notes": (2, 4)
        }

        synthesized_output = {}
        for key, (min_num, max_num) in num_picks.items():
            elements = all_elements[key]
            if elements:
                count = random.randint(min_num, max_num)
                # Ensure we don't try to pick more elements than available
                count = min(count, len(elements))
                synthesized_output[key] = random.sample(elements, count)
            else:
                synthesized_output[key] = []
        
        # --- Construct the final description string ---
        description_parts = synthesized_output.get("description_elements", [])
        description_str = "a fascinating new cinematic concept"
        if description_parts:
            if len(description_parts) > 1:
                description_str = ", ".join(description_parts[:-1])
                description_str += f", and {description_parts[-1]}"
            else:
                description_str = description_parts[0]

        # --- Generate the synthesized genre name ---
        formatted_genres_title = [g.title() for g in recognized_genres_lower]
        genre_name = ""

        if not formatted_genres_title:
            genre_name = "Cinematic Blend"
        elif len(formatted_genres_title) == 1:
            genre_name = formatted_genres_title[0]
        else:
            if primary_genre and primary_genre.lower() in recognized_genres_lower:
                primary_title = primary_genre.title()
                other_genres_titles = [g for g in formatted_genres_title if g != primary_title]
                if other_genres_titles:
                    genre_name = f"{primary_title} with {' / '.join(other_genres_titles)} undertones"
                else:
                    genre_name = primary_title # Should only happen if primary_genre was the only one, caught by len == 1
            else:
                genre_name = f"{' / '.join(formatted_genres_title)} Hybrid"

        return {
            "synthesized_genre_name": genre_name,
            "description": f"A film that explores {description_str.strip()}.",
            "visual_style": synthesized_output["visual_keywords"],
            "narrative_themes": synthesized_output["narrative_themes"],
            "character_archetypes": synthesized_output["character_archetypes"],
            "world_elements": synthesized_output["world_elements"],
            "sound_design_notes": synthesized_output["sound_design_notes"]
        }