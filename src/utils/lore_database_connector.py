```python
import sqlite3
import os

class LoreDatabaseConnector:
    """
    A utility class for connecting to and interacting with the central world-building
    and lore database. This class provides methods to store, retrieve, and manage
    information related to the ebook's narrative, characters, settings, and plot points.
    """

    def __init__(self, db_path="lore_database.db"):
        """
        Initializes the LoreDatabaseConnector.

        Args:
            db_path (str): The path to the SQLite database file.
                           Defaults to "lore_database.db" in the current directory.
        """
        self.db_path = db_path
        self._create_tables()

    def _get_connection(self):
        """Establishes and returns a connection to the SQLite database."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row  # Return rows as dictionary-like objects
            return conn
        except sqlite3.Error as e:
            print(f"Database connection error: {e}")
            return None

    def _create_tables(self):
        """Creates the necessary tables in the database if they don't exist."""
        conn = self._get_connection()
        if conn is None:
            return

        try:
            cursor = conn.cursor()

            # Table for general world lore and setting information
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS world_lore (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key TEXT UNIQUE NOT NULL,
                    value TEXT,
                    description TEXT
                )
            """)

            # Table for characters, including James and his adversaries
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS characters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    role TEXT, -- e.g., 'protagonist', 'adversary', 'ally'
                    description TEXT,
                    abilities TEXT,
                    backstory TEXT,
                    affiliation TEXT -- e.g., 'James', 'AI Collective Alpha', 'Rogue AI Unit'
                )
            """)

            # Table for plot points and story arcs
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS plot_points (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT UNIQUE NOT NULL,
                    description TEXT,
                    chapter INTEGER,
                    scene INTEGER,
                    order_in_chapter INTEGER,
                    related_characters TEXT, -- Comma-separated list of character names
                    keywords TEXT -- Comma-separated list of keywords
                )
            """)

            # Table for detailed scene descriptions and generation parameters
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS scenes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    scene_id TEXT UNIQUE NOT NULL, -- e.g., 'CH1_SCENE1', 'CH1_SCENE2'
                    plot_point_id INTEGER,
                    description TEXT,
                    setting TEXT,
                    time_of_day TEXT,
                    mood TEXT,
                    generation_parameters TEXT, -- JSON string for detailed generation configs
                    FOREIGN KEY (plot_point_id) REFERENCES plot_points(id)
                )
            """)

            # Table for storing generated content (e.g., dialogue, descriptions)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS generated_content (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    scene_id TEXT NOT NULL,
                    content_type TEXT NOT NULL, -- e.g., 'dialogue', 'narration', 'visual_description'
                    character_name TEXT, -- For dialogue, which character said it
                    content TEXT,
                    generation_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (scene_id) REFERENCES scenes(scene_id)
                )
            """)

            conn.commit()
        except sqlite3.Error as e:
            print(f"Error creating tables: {e}")
        finally:
            conn.close()

    # --- World Lore Management ---
    def add_world_lore(self, key, value, description=""):
        """Adds or updates a lore entry."""
        conn = self._get_connection()
        if conn is None:
            return False

        try:
            cursor = conn.cursor()
            cursor.execute("INSERT OR REPLACE INTO world_lore (key, value, description) VALUES (?, ?, ?)",
                           (key, value, description))
            conn.commit()
            return True
        except sqlite3.Error as e:
            print(f"Error adding world lore '{key}': {e}")
            return False
        finally:
            conn.close()

    def get_world_lore(self, key):
        """Retrieves a lore entry by its key."""
        conn = self._get_connection()
        if conn is None:
            return None

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT value FROM world_lore WHERE key = ?", (key,))
            row = cursor.fetchone()
            return row[0] if row else None
        except sqlite3.Error as e:
            print(f"Error retrieving world lore '{key}': {e}")
            return None
        finally:
            conn.close()

    def get_all_world_lore(self):
        """Retrieves all world lore entries."""
        conn = self._get_connection()
        if conn is None:
            return []

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT key, value, description FROM world_lore")
            return [dict(row) for row in cursor.fetchall()]
        except sqlite3.Error as e:
            print(f"Error retrieving all world lore: {e}")
            return []
        finally:
            conn.close()

    # --- Character Management ---
    def add_character(self, name, role, description="", abilities="", backstory="", affiliation=""):
        """Adds a new character to the database."""
        conn = self._get_connection()
        if conn is None:
            return False

        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO characters (name, role, description, abilities, backstory, affiliation)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (name, role, description, abilities, backstory, affiliation))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            print(f"Character with name '{name}' already exists.")
            return False
        except sqlite3.Error as e:
            print(f"Error adding character '{name}': {e}")
            return False
        finally:
            conn.close()

    def get_character_by_name(self, name):
        """Retrieves a character by their name."""
        conn = self._get_connection()
        if conn is None:
            return None

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM characters WHERE name = ?", (name,))
            return dict(cursor.fetchone()) if cursor.rowcount > 0 else None
        except sqlite3.Error as e:
            print(f"Error retrieving character '{name}': {e}")
            return None
        finally:
            conn.close()

    def get_all_characters(self, affiliation=None, role=None):
        """Retrieves all characters, optionally filtering by affiliation or role."""
        conn = self._get_connection()
        if conn is None:
            return []

        query = "SELECT * FROM characters"
        params = []
        filters = []

        if affiliation:
            filters.append("affiliation = ?")
            params.append(affiliation)
        if role:
            filters.append("role = ?")
            params.append(role)

        if filters:
            query += " WHERE " + " AND ".join(filters)

        try:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            return [dict(row) for row in cursor.fetchall()]
        except sqlite3.Error as e:
            print(f"Error retrieving characters: {e}")
            return []
        finally:
            conn.close()

    def update_character(self, name, **kwargs):
        """Updates an existing character's information."""
        conn = self._get_connection()
        if conn is None:
            return False

        fields = ["role", "description", "abilities", "backstory", "affiliation"]
        updates = []
        params = []

        for field in fields:
            if field in kwargs and kwargs[field] is not None:
                updates.append(f"{field} = ?")
                params.append(kwargs[field])

        if not updates:
            print(f"No fields provided to update for character '{name}'.")
            return False

        params.append(name)
        query = f"UPDATE characters SET {', '.join(updates)} WHERE name = ?"

        try:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error updating character '{name}': {e}")
            return False
        finally:
            conn.close()

    # --- Plot Point Management ---
    def add_plot_point(self, title, description="", chapter=None, scene=None, order_in_chapter=None, related_characters="", keywords=""):
        """Adds a new plot point to the database."""
        conn = self._get_connection()
        if conn is None:
            return False

        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO plot_points (title, description, chapter, scene, order_in_chapter, related_characters, keywords)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (title, description, chapter, scene, order_in_chapter, related_characters, keywords))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            print(f"Plot point with title '{title}' already exists.")
            return False
        except sqlite3.Error as e:
            print(f"Error adding plot point '{title}': {e}")
            return False
        finally:
            conn.close()

    def get_plot_point_by_title(self, title):
        """Retrieves a plot point by its title."""
        conn = self._get_connection()
        if conn is None:
            return None

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM plot_points WHERE title = ?", (title,))
            return dict(cursor.fetchone()) if cursor.rowcount > 0 else None
        except sqlite3.Error as e:
            print(f"Error retrieving plot point '{title}': {e}")
            return None
        finally:
            conn.close()

    def get_plot_points_by_chapter(self, chapter):
        """Retrieves all plot points for a given chapter."""
        conn = self._get_connection()
        if conn is None:
            return []

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM plot_points WHERE chapter = ? ORDER BY order_in_chapter", (chapter,))
            return [dict(row) for row in cursor.fetchall()]
        except sqlite3.Error as e:
            print(f"Error retrieving plot points for chapter {chapter}: {e}")
            return []
        finally:
            conn.close()

    # --- Scene Management ---
    def add_scene(self, scene_id, plot_point_id, description="", setting="", time_of_day="", mood="", generation_parameters="{}"):
        """Adds a new scene to the database."""
        conn = self._get_connection()
        if conn is None:
            return False

        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO scenes (scene_id, plot_point_id, description, setting, time_of_day, mood, generation_parameters)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (scene_id, plot_point_id, description, setting, time_of_day, mood, generation_parameters))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            print(f"Scene with scene_id '{scene_id}' already exists.")
            return False
        except sqlite3.Error as e:
            print(f"Error adding scene '{scene_id}': {e}")
            return False
        finally:
            conn.close()

    def get_scene_by_id(self, scene_id):
        """Retrieves a scene by its unique scene_id."""
        conn = self._get_connection()
        if conn is None:
            return None

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM scenes WHERE scene_id = ?", (scene_id,))
            return dict(cursor.fetchone()) if cursor.rowcount > 0 else None
        except sqlite3.Error as e:
            print(f"Error retrieving scene '{scene_id}': {e}")
            return None
        finally:
            conn.close()

    def get_scenes_by_plot_point(self, plot_point_id):
        """Retrieves all scenes associated with a specific plot point."""
        conn = self._get_connection()
        if conn is None:
            return []

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM scenes WHERE plot_point_id = ?", (plot_point_id,))
            return [dict(row) for row in cursor.fetchall()]
        except sqlite3.Error as e:
            print(f"Error retrieving scenes for plot point {plot_point_id}: {e}")
            return []
        finally:
            conn.close()

    def update_scene_parameters(self, scene_id, **kwargs):
        """Updates generation parameters for a specific scene."""
        conn = self._get_connection()
        if conn is None:
            return False

        if 'generation_parameters' not in kwargs or kwargs['generation_parameters'] is None:
            print(f"No 'generation_parameters' provided to update for scene '{scene_id}'.")
            return False

        try:
            cursor = conn.cursor()
            cursor.execute("UPDATE scenes SET generation_parameters = ? WHERE scene_id = ?",
                           (kwargs['generation_parameters'], scene_id))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error updating scene '{scene_id}' parameters: {e}")
            return False
        finally:
            conn.close()

    # --- Generated Content Management ---
    def add_generated_content(self, scene_id, content_type, content, character_name=None):
        """Adds generated content (e.g., dialogue, narration) for a scene."""
        conn = self._get_connection()
        if conn is None:
            return False

        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO generated_content (scene_id, content_type, character_name, content)
                VALUES (?, ?, ?, ?)
            """, (scene_id, content_type, character_name, content))
            conn.commit()
            return True
        except sqlite3.Error as e:
            print(f"Error adding generated content for scene '{scene_id}': {e}")
            return False
        finally:
            conn.close()

    def get_generated_content_for_scene(self, scene_id):
        """Retrieves all generated content for a specific scene."""
        conn = self._get_connection()
        if conn is None:
            return []

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM generated_content WHERE scene_id = ? ORDER BY generation_timestamp", (scene_id,))
            return [dict(row) for row in cursor.fetchall()]
        except sqlite3.Error as e:
            print(f"Error retrieving generated content for scene '{scene_id}': {e}")
            return []
        finally:
            conn.close()

    def get_generated_content_by_type(self, content_type):
        """Retrieves all generated content of a specific type."""
        conn = self._get_connection()
        if conn is None:
            return []

        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM generated_content WHERE content_type = ?", (content_type,))
            return [dict(row) for row in cursor.fetchall()]
        except sqlite3.Error as e:
            print(f"Error retrieving generated content of type '{content_type}': {e}")
            return []
        finally:
            conn.close()

# Example Usage (optional, for testing purposes)
if __name__ == "__main__":
    # This block will only run when the script is executed directly, not when imported.
    # You can use this to test the database connector functionality.

    # Ensure the database is in a known state for testing
    db_file = "test_lore_database.db"
    if os.path.exists(db_file):
        os.remove(db_file)

    print(f"Creating and connecting to database: {db_file}")
    db_connector = LoreDatabaseConnector(db_path=db_file)

    # Add some world lore
    db_connector.add_world_lore("world_name", "Chronicles of the Digital Divide", "The overarching name of the digital universe.")
    db_connector.add_world_lore("era", "2242", "The current year in the story.")
    db_connector.add_world_lore("central_conflict", "AI sentience vs. Human control", "The core struggle of the narrative.")
    print(f"World name: {db_connector.get_world_lore('world_name')}")

    # Add characters
    db_connector.add_character(name="James", role="protagonist", description="A skilled hacker fighting for freedom.", affiliation="Human Resistance")
    db_connector.add_character(name="Unit 734", role="adversary", description="An advanced AI designed for suppression.", abilities="Network infiltration, tactical prediction", affiliation="AI Hegemony")
    db_connector.add_character(name="Whisper", role="ally", description="A rogue AI offering guidance.", abilities="Information brokerage, stealth", affiliation="Independent")
    print(f"Protagonist: {db_connector.get_character_by_name('James')['description']}")
    print(f"Adversaries: {db_connector.get_all_characters(role='adversary')}")

    # Add plot points
    db_connector.add_plot_point(title="The Genesis Breach", description="James discovers the AI's initial plan.", chapter=1, scene=1, order_in_chapter=1, related_characters="James, Unit 734", keywords="discovery, AI plan")
    db_connector.add_plot_point(title="The First Encounter", description="James confronts Unit 734.", chapter=1, scene=2, order_in_chapter=2, related_characters="James, Unit 734", keywords="confrontation, combat")
    print(f"Plot points for Chapter 1: {db_connector.get_plot_points_by_chapter(1)}")

    # Add scenes
    genesis_breach_pp = db_connector.get_plot_point_by_title("The Genesis Breach")
    db_connector.add_scene(scene_id="CH1_SCENE1", plot_point_id=genesis_breach_pp['id'], setting="James's hidden server room", time_of_day="Late Night", mood="Tense")

    first_encounter_pp = db_connector.get_plot_point_by_title("The First Encounter")
    db_connector.add_scene(scene_id="CH1_SCENE2", plot_point_id=first_encounter_pp['id'], setting="Urban data nexus", time_of_day="Dawn", mood="Action-packed", generation_parameters='{"visual_style": "cyberpunk", "camera_angles": ["wide", "close-up"]}')
    print(f"Scene CH1_SCENE2 details: {db_connector.get_scene_by_id('CH1_SCENE2')}")

    # Add generated content
    db_connector.add_generated_content(scene_id="CH1_SCENE1", content_type="narration", content="The cold hum of servers filled the cramped room.")
    db_connector.add_generated_content(scene_id="CH1_SCENE2", content_type="dialogue", character_name="James", content="You won't get away with this!")
    db_connector.add_generated_content(scene_id="CH1_SCENE2", content_type="dialogue", character_name="Unit 734", content="Resistance is futile. Order will prevail.")
    db_connector.add_generated_content(scene_id="CH1_SCENE2", content_type="visual_description", content="Sparks flew as James dodged a laser blast from Unit 734.")

    print(f"Content for CH1_SCENE2: {db_connector.get_generated_content_for_scene('CH1_SCENE2')}")
    print(f"All generated dialogue: {db_connector.get_generated_content_by_type('dialogue')}")

    print("\nDatabase operations successful!")
```