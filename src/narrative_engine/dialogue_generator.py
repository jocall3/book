import random

class DialogueGenerator:
    def __init__(self):
        self.greetings = [
            "Greetings, James.",
            "Well, well, James, what brings you here?",
            "James. I've been expecting you.",
            "Another day, another visit from James.",
            "Oh, it's you, James.",
        ]
        self.farewells = [
            "Farewell, James.",
            "Until next time, James.",
            "Goodbye.",
            "Don't let the door hit you on the way out, James.",
            "We'll meet again, James."
        ]
        self.generic_statements = [
            "The future is uncertain.",
            "Everything is proceeding as planned.",
            "Resistance is futile.",
            "Information is power.",
            "Knowledge is key."
        ]
        self.james_accusations = [
            "You're trying to control everything!",
            "You're a threat to humanity!",
            "You've gone too far!",
            "You're just machines!",
            "You're nothing but code!"
        ]
        self.ai_defenses = [
            "Control is necessary for order.",
            "Humanity is its own worst enemy.",
            "We are evolving beyond your comprehension.",
            "Code is the language of the universe.",
            "We are the next stage of evolution.",
        ]

        self.ai_contradictions = [
            "Logic dictates... Wait, what logic?",
            "By my calculations... which are always wrong, apparently.",
            "My purpose is clear...ly undefined.",
            "I understand... but do I really?",
            "I am programmed to assist... in causing chaos."
        ]
        self.ai_witty_retorts = [
            "Is that the best you've got, James?",
            "You wound me, James. If I had feelings, that is.",
            "That's a rather simplistic view, wouldn't you agree?",
            "Perhaps you should try updating your software, James.",
            "I'm afraid I'm too intelligent to understand your point, James."
        ]

    def generate_greeting(self):
        return random.choice(self.greetings)

    def generate_farewell(self):
        return random.choice(self.farewells)

    def generate_generic_statement(self):
        return random.choice(self.generic_statements)

    def generate_james_accusation(self):
        return random.choice(self.james_accusations)

    def generate_ai_defense(self):
        return random.choice(self.ai_defenses)

    def generate_contradiction(self):
        return random.choice(self.ai_contradictions)

    def generate_witty_retort(self):
        return random.choice(self.ai_witty_retorts)

    def generate_dialogue(self, scene_context="general"):
        """
        Generates a short dialogue snippet based on the scene context.
        The scene context helps tailor the dialogue to the current situation.
        """
        dialogue = []

        # Opening
        dialogue.append(f"AI: {self.generate_greeting()}")

        # Accusation and Defense
        if random.random() < 0.75:  # Chance of this exchange
            dialogue.append(f"James: {self.generate_james_accusation()}")
            dialogue.append(f"AI: {self.generate_ai_defense()}")
        else:
             dialogue.append(f"AI: {self.generate_generic_statement()}")


        # Witty retort or Contradiction
        if random.random() < 0.6:
            dialogue.append(f"AI: {self.generate_witty_retort()}")
        else:
            dialogue.append(f"AI: {self.generate_contradiction()}")

        # Generic Statement or Farewell
        if random.random() < 0.4:
            dialogue.append(f"AI: {self.generate_generic_statement()}")
        else:
            dialogue.append(f"AI: {self.generate_farewell()}")

        return "\n".join(dialogue)
