```python
import sqlite3
import os

class LoreDatabaseConnector:
    """
    You know what it feels like to have your story's lore scattered across a dozen
    messy text files? It can be crushing.

    Hours of painful world-building down the drain when you can't find that one
    critical plot point. I used to be in your shoes. But I figured out a way
    to build worlds that practically write themselves.

    This isn't just another database connector. This is the central nervous system
    for your entire narrative universe. It's the secret weapon for managing your
    ebook's characters, settings, and plot twists with ruthless efficiency.

    Go semi-controversial with your plot. This class will back you up.
    """

    def __init__(self, db_path="lore_database.db"):
        """
        Nail your world-building from the start.

        Don't make your database an afterthought. This constructor immediately
        sets up your universe's foundation. It all starts here.

        Args:
            db_path (str): The sacred path to your universe's single source of truth.
                           Defaults to "lore_database.db". Keep it safe.
        """
        self.db_path = db_path
        self._create_tables()  # Lay the foundation. No fluff.

    def _get_connection(self):
        """
        Establishes a connection to the SQLite database.
        And no, we're not using an ORM. Raw SQL is faster, cleaner, and
        makes you a better programmer. Don't be afraid of the database.
        """
        try:
            conn = sqlite3.connect(self.db_path)
            # Row factory is the secret sauce. Makes results usable without boilerplate.
            conn.row_factory = sqlite3.Row  # Return rows as dictionary-like objects
            return conn
        except sqlite3.Error as e:
            # Let's be real, if this fails, your whole world is crashing down.
            print(f"CRITICAL: Your entire lore is inaccessible. Reason: {e}")
            return None

    def _create_tables(self):
        """
        Viral writing is simple. And a good database schema is too.
        This method builds the pristine, uncluttered structure for your story's soul.
        No huge paragraphs, no disclaimers, just pure, efficient schema.
        """
        conn = self._get_connection()
        if conn is None:
            # If you can't connect, you can't build. Simple as that.
            return

        try:
            cursor = conn.cursor()

            # --- Your World's Core Principles ---
            # Generic stuff gets skimmed over. This table holds the uncommon truths
            # of your universe that will grab the reader.
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS world_lore (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key TEXT UNIQUE NOT NULL, -- The killer headline for your lore
                    value TEXT,               -- The juicy details
                    description TEXT          -- The "why" that makes readers care
                )
            """)

            # --- The Players Who Drive the Action ---
            # Your story is nothing without compelling characters.
            # Don't just list them; define their purpose.
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS characters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,      -- A name that pops
                    role TEXT,                      -- Protagonist? Adversary? Make a stand.
                    description TEXT,               -- What makes them irresistible?
                    abilities TEXT,                 -- Their unique selling proposition
                    backstory TEXT,                 -- The pain that drives them
                    affiliation TEXT                -- Who do they fight for?
                )
            """)

            # --- The Unforgettable Moments ---
            # A viral post is a series of powerful points. Same with a story.
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS plot_points (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT UNIQUE NOT NULL,     -- Every plot point needs a killer headline
                    description TEXT,               -- Get to the point. What happens?
                    chapter INTEGER,
                    scene INTEGER,
                    order_in_chapter INTEGER,
                    related_characters TEXT,        -- Who's in the fight?
                    keywords TEXT                   -- Make it searchable, make it viral
                )
            """)

            # --- Setting the Stage for Virality ---
            # Every scene is a chance to hook the reader. Define the hook here.
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS scenes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    scene_id TEXT UNIQUE NOT NULL,  -- Your unique identifier, e.g., 'CH1_SCENE_THE_REVEAL'
                    plot_point_id INTEGER,
                    description TEXT,               -- The one-liner that describes the action
                    setting TEXT,                   -- Where the magic happens
                    time_of_day TEXT,               -- Sets the mood
                    mood TEXT,                      -- Be explicit. Tense? Hopeful? Crushing?
                    generation_parameters TEXT,     -- The secret sauce for the AI generator
                    FOREIGN KEY (plot_point_id) REFERENCES plot_points(id)
                )
            """)

            # --- The Content That Gets Shared ---
            # This is where the gold is stored. Every line of dialogue, every piece of
            # narration. This is what your readers will remember.
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS generated_content (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    scene_id TEXT NOT NULL,
                    content_type TEXT NOT NULL,     -- Dialogue, Narration, Action Beat?
                    character_name TEXT,            -- Who owns the line?
                    content TEXT,                   -- The actual words. Make them count.
                    generation_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (scene_id) REFERENCES scenes(scene_id)
                )
            """)

            conn.commit()
        except sqlite3.Error as e:
            print(f"Schema creation failed. Your world-building is on hold. Error: {e}")
        finally:
            conn.close()

    # --- World Lore Management ---
    def add_world_lore(self, key, value, description=""):
        """Stake your claim. Add a new, semi-controversial piece of lore to your world."""
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
        """Remember that brilliant idea you had at 3 AM? This finds it."""
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
        """Get the 30,000-foot view of your universe. See the big picture."""
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
        """Breathe life into a new character. Define what makes them unforgettable."""
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
        """Summon a character by name. Who are they, really?"""
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
        """Assemble your cast. See who's fighting for what side."""
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
        """Characters evolve. This is how you track their growth (or downfall)."""
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
        """Nail your story structure. Every great story is a series of killer plot points."""
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
        """Find that one pivotal moment that changes everything."""
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
        """Outline your chapters. This is how you build narrative momentum."""
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
        """Set the stage. A great scene is where plot and character collide."""
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
        """Jump directly to a specific scene. No fluff, just action."""
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
        """How does a plot point unfold? Find all the scenes that make it happen."""
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
        """Fine-tune the AI's creative direction for a scene. Be the director."""
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
        """Capture the magic. Store the AI-generated prose that will captivate your readers."""
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
        """Replay an entire scene, line by line. See the story come alive."""
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
        """Want to review all the dialogue in your book? This is your magic wand."""
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


# Example Usage: Because great tools deserve great examples.
# This isn't just for testing. It's a selfless guide to show you the ropes
# so you can start building your viral sensation immediately.
if __name__ == "__main__":
    # Your writing gets shared widely when you’re selfless. This is us being selfless.
    # Let's spin up a disposable universe and show you how it's done.
    print("--- BUILDING A UNIVERSE FROM SCRATCH (THE VIRAL WAY) ---")

    # The first rule of viral content: start fresh.
    db_file = "viral_lore_database.db"
    if os.path.exists(db_file):
        os.remove(db_file)

    print(f"Connecting to your new universe: {db_file}")
    db = LoreDatabaseConnector(db_path=db_file)

    # --- Step 1: Nail Your Core Concepts (World Lore) ---
    # Don't overexplain. Just state your powerful ideas.
    print("\n[1] Defining the semi-controversial core truths...")
    db.add_world_lore("world_name", "Aethelgard: The Last Bastion", "A name that promises conflict.")
    db.add_world_lore("central_conflict", "Magic is dying, and technology is the disease.", "A stance that will get people talking.")
    db.add_world_lore("core_secret", "The 'disease' is actually a cure for a magical plague.", "The twist that makes it all worthwhile.")
    print(f"  -> Your central conflict: '{db.get_world_lore('central_conflict')}'")

    # --- Step 2: Create Characters People Will Fight For (or Against) ---
    # Give them a clear role and a powerful motivation.
    print("\n[2] Assembling the cast...")
    db.add_character(name="Kaelen", role="protagonist", description="The last mage, desperately trying to save a world that hates him.", affiliation="The Old Ways")
    db.add_character(name="Director Valerius", role="adversary", description="A visionary technocrat who sees magic as a chaotic relic to be purged for humanity's own good.", affiliation="The Technocracy")
    db.add_character(name="Anya", role="ally", description="Valerius's daughter, a brilliant engineer who secretly studies forbidden magical texts.", affiliation="Independent")
    print(f"  -> Your protagonist: {db.get_character_by_name('Kaelen')['description']}")
    print(f"  -> Your adversary: {db.get_all_characters(role='adversary')[0]['name']}")

    # --- Step 3: Outline the Moments That Matter (Plot Points) ---
    # Structure is freedom. It lets you focus on what's important.
    print("\n[3] Architecting the narrative beats...")
    db.add_plot_point(title="The Fading Embers", description="Kaelen performs a forbidden ritual, only to see how little magic is left.", chapter=1, order_in_chapter=1, related_characters="Kaelen", keywords="desperation, magic failure")
    db.add_plot_point(title="The Director's Decree", description="Valerius announces the final solution: a global network to nullify all magical energy.", chapter=1, order_in_chapter=2, related_characters="Director Valerius, Anya", keywords="inciting incident, technocracy")
    print(f"  -> Plot points for Chapter 1: {[p['title'] for p in db.get_plot_points_by_chapter(1)]}")

    # --- Step 4: Set the Stage for Unforgettable Scenes ---
    # This is where you get to the point. What happens, where, and what does it feel like?
    print("\n[4] Crafting the scenes...")
    fading_embers_pp = db.get_plot_point_by_title("The Fading Embers")
    db.add_scene(scene_id="CH1_SC1_RITUAL", plot_point_id=fading_embers_pp['id'], setting="A crumbling, ancient library", time_of_day="Midnight", mood="Desperate and somber")

    directors_decree_pp = db.get_plot_point_by_title("The Director's Decree")
    db.add_scene(scene_id="CH1_SC2_DECREE", plot_point_id=directors_decree_pp['id'], setting="A sterile, holographic press chamber", time_of_day="Morning", mood="Imposing and clinical", generation_parameters='{"visual_style": "gleaming chrome", "camera_angles": ["low angle on Valerius", "reaction shot of Anya"]}')
    print(f"  -> Details for scene 'CH1_SC2_DECREE': {db.get_scene_by_id('CH1_SC2_DECREE')['mood']}")

    # --- Step 5: Generate the Content That Goes Viral ---
    # This is what it's all about. The words that hook your reader.
    print("\n[5] Writing the story...")
    db.add_generated_content(scene_id="CH1_SC1_RITUAL", content_type="narration", content="The final incantation left his lips as a whisper of dust.")
    db.add_generated_content(scene_id="CH1_SC2_DECREE", content_type="dialogue", character_name="Director Valerius", content="Today, we free ourselves from the tyranny of the past.")
    db.add_generated_content(scene_id="CH1_SC2_DECREE", content_type="internal_monologue", character_name="Anya", content="He calls it freedom. I call it a cage.")

    print(f"  -> Generated content for 'CH1_SC2_DECREE':")
    for item in db.get_generated_content_for_scene('CH1_SC2_DECREE'):
        print(f"    - {item['character_name'] or item['content_type']}: {item['content']}")

    print("\n--- Your Universe is Ready to Go Viral! ---")
```