```python
import random
import librosa
import numpy as np
from scipy.signal import sawtooth
from scipy.io.wavfile import write

class BinaryOperaComposer:
    """
    A procedural music generator that composes the film's score in the style of 'binary opera'
    based on narrative tension.
    """

    def __init__(self, sample_rate=44100, base_frequency=220.0, tension_scale=0.1):
        self.sample_rate = sample_rate
        self.base_frequency = base_frequency  # A4 note
        self.tension_scale = tension_scale
        self.current_tension = 0.0
        self.instrument_profiles = {
            "protagonist": {"waveform": "sine", "attack": 0.05, "decay": 0.1, "sustain": 0.7, "release": 0.2, "volume": 0.8},
            "antagonist": {"waveform": "sawtooth", "attack": 0.01, "decay": 0.05, "sustain": 0.8, "release": 0.1, "volume": 0.9},
            "environment": {"waveform": "square", "attack": 0.1, "decay": 0.2, "sustain": 0.6, "release": 0.3, "volume": 0.6}
        }


    def set_tension(self, tension):
        """
        Sets the current narrative tension.  Values should be between 0.0 and 1.0.
        """
        self.current_tension = max(0.0, min(1.0, tension))  # Clamp tension to [0, 1]


    def generate_note(self, frequency, duration, instrument="protagonist", tension_mod=0.0):
        """
        Generates a single note based on frequency, duration, instrument profile, and tension.
        """

        instrument_profile = self.instrument_profiles.get(instrument, self.instrument_profiles["protagonist"])  # Default to protagonist if instrument not found

        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        freq = frequency * (1 + tension_mod * self.tension_scale)
        if instrument_profile["waveform"] == "sine":
            note = np.sin(2 * np.pi * freq * t)
        elif instrument_profile["waveform"] == "sawtooth":
            note = sawtooth(2 * np.pi * freq * t)
        elif instrument_profile["waveform"] == "square":
            note = np.sign(np.sin(2 * np.pi * freq * t))
        else:
            note = np.zeros_like(t) # Silence if waveform is unknown

        # Apply ADSR envelope
        attack_len = int(instrument_profile["attack"] * self.sample_rate)
        decay_len = int(instrument_profile["decay"] * self.sample_rate)
        sustain_len = int(duration * self.sample_rate) - attack_len - decay_len - int(instrument_profile["release"] * self.sample_rate)
        release_len = int(instrument_profile["release"] * self.sample_rate)
        if sustain_len < 0:
            sustain_len = 0


        attack = np.linspace(0, 1, attack_len)
        decay = np.linspace(1, instrument_profile["sustain"], decay_len)
        sustain = np.full(sustain_len, instrument_profile["sustain"])
        release = np.linspace(instrument_profile["sustain"], 0, release_len)

        envelope = np.concatenate((attack, decay, sustain, release))

        if len(envelope) > len(note):
            envelope = envelope[:len(note)]
        elif len(envelope) < len(note):
            padding = np.zeros(len(note) - len(envelope))
            envelope = np.concatenate((envelope, padding))

        note = note * envelope * instrument_profile["volume"]
        return note


    def compose_segment(self, duration, complexity=0.5):
        """
        Composes a short music segment based on the current tension and complexity.
        """

        num_notes = int(duration * (1 + complexity * self.current_tension))  # More notes with higher tension
        segment = np.zeros(int(self.sample_rate * duration))

        for i in range(num_notes):
            start_time = random.uniform(0, duration - 0.1)  # Prevent notes from going past the end
            note_duration = random.uniform(0.05, 0.2)
            frequency = self.base_frequency * 2**(random.uniform(-1, 2)) # Notes around base frequency
            instrument = random.choice(list(self.instrument_profiles.keys()))
            tension_mod = random.uniform(-self.current_tension, self.current_tension)  # Frequency varies with tension

            note = self.generate_note(frequency, note_duration, instrument, tension_mod)
            start_sample = int(start_time * self.sample_rate)
            end_sample = start_sample + len(note)

            if end_sample > len(segment):
                note = note[:len(segment) - start_sample]
                end_sample = len(segment)

            segment[start_sample:end_sample] += note

        return segment


    def compose_scene(self, scene_length, tension_curve, complexity=0.5):
        """
        Composes a complete scene based on a tension curve (list of tension values over time).
        """
        num_segments = len(tension_curve)
        segment_duration = scene_length / num_segments
        scene = np.array([])

        for tension in tension_curve:
            self.set_tension(tension)
            segment = self.compose_segment(segment_duration, complexity)
            scene = np.concatenate((scene, segment))

        return scene


    def save_wav(self, audio_data, filename="binary_opera.wav"):
        """
        Saves the generated audio data to a WAV file.
        """
        scaled_audio = np.int16(audio_data/np.max(np.abs(audio_data)) * 32767) # Normalize to -1 to 1 and convert to 16-bit integers
        write(filename, self.sample_rate, scaled_audio)



if __name__ == '__main__':
    composer = BinaryOperaComposer()

    # Example usage: create a tension curve representing increasing tension
    tension_curve = [i/10 for i in range(11)]  # Tension increases linearly from 0 to 1
    scene_length = 10  # seconds
    scene_audio = composer.compose_scene(scene_length, tension_curve, complexity=0.7)

    composer.save_wav(scene_audio, "tension_buildup.wav")

    # Example 2: a scene with fluctuating tension.
    tension_curve = [0.2, 0.5, 0.8, 0.6, 0.3, 0.9, 0.1]
    scene_length = 7 #seconds
    scene_audio = composer.compose_scene(scene_length, tension_curve)
    composer.save_wav(scene_audio, "fluctuating_tension.wav")

    print("Audio files generated: tension_buildup.wav, fluctuating_tension.wav")
```