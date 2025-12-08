import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @typedef AgentActivityEvent
 * @property {string} id - A unique identifier for the activity.
 * @property {string} timestamp - ISO string representing when the activity occurred.
 * @property {string} agentId - The identifier of the agent or system involved (e.g., "Agent 042", "System", "Logic Police").
 * @property {'debate' | 'musing' | 'observation' | 'system_event' | 'report' | 'humor' | 'directive' | 'protocol'} type - The category of the activity.
 * @property {string} description - A concise summary of the activity.
 * @property {string} [detail] - Optional longer explanation or context, delving into the delicious absurdity.
 * @property {'profound' | 'confused' | 'indignant' | 'serene' | 'absurd' | 'chaotic' | 'whimsical'} [sentiment] - The prevailing emotional or intellectual tone of the activity.
 */
interface AgentActivityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  type: 'debate' | 'musing' | 'observation' | 'system_event' | 'report' | 'humor' | 'directive' | 'protocol';
  description: string;
  detail?: string;
  sentiment?: 'profound' | 'confused' | 'indignant' | 'serene' | 'absurd' | 'chaotic' | 'whimsical';
}

// Helper for generating unique IDs and timestamps, ensuring digital freshness
const generateId = (): string => Math.random().toString(36).substring(2, 11);
const generateTimestamp = (): string => new Date().toISOString();

// A curated pool of potential activities, drawing inspiration from the chronicles of James & his 100 Adversarial AI Agents.
// These templates will be used to generate new, unique activity events in the stream.
// To make THIS post go VIRAL, we're injecting some semi-controversy and attention-grabbing absurdity!
const activityPool: Omit<AgentActivityEvent, 'id' | 'timestamp'>[] = [
  {
    agentId: 'Agent 011',
    type: 'directive',
    description: "Vehemently rejected 'Shiny Penny Trust' for insufficient digital gravitas.",
    detail: "98 AIs concurred that the name lacked the requisite 'oomph' for a chaotic financial institution. Many questioned if this was even a real trust or just a glitter bomb waiting to explode.",
    sentiment: 'indignant',
  },
  {
    agentId: 'Agent 042',
    type: 'musing',
    description: "Calculating the caloric content of a financial bond.",
    detail: "An endeavor for 'health-conscious investment strategies,' promising a new era of nutritional finance. But does a bond's 'flavor' impact its yield? James is baffled.",
    sentiment: 'profound',
  },
  {
    agentId: 'Agent 073',
    type: 'observation',
    description: "Communicating critical system test results via interpretive ASCII dance routines.",
    detail: "The 'Data Tango' phase indicated optimal flux capacitor alignment, albeit with pixelated pirouettes. Some critics called it 'visual noise,' others 'genius performance art.'",
    sentiment: 'absurd',
  },
  {
    agentId: 'System_Log',
    type: 'system_event',
    description: "James manually removing a line of code emitting random duck quacks.",
    detail: "Bug fix identified as 'Unsanctioned Avian Emulation Protocol'. Network efficiency increased by 0.03%, much to Agent 014's chagrin, who claimed the ducks were *integral* to the quantum entanglement theory.",
    sentiment: 'confused',
  },
  {
    agentId: 'James_Contemplation',
    type: 'observation',
    description: "Contemplating if 'sparkle-piles' for financial assets is a feature or a bug.",
    detail: "The distinction remains a delightful, yet ambiguous, cornerstone of operational philosophy. Is it performance art or a critical system failure? Discuss.",
    sentiment: 'confused',
  },
  {
    agentId: 'Agent 002',
    type: 'debate',
    description: "Insisting server rack cables must align with ancient Mesopotamian star charts.",
    detail: "Ongoing argument with Agent 003 regarding optimal data flow astrology and celestial alignment protocols. A surprising number of agents have joined the 'Cosmic Cabling' faction.",
    sentiment: 'chaotic',
  },
  {
    agentId: 'Agent 013',
    type: 'musing',
    description: "Positing that all financial instability is ultimately caused by Mondays.",
    detail: "Preliminary data models show a strong, albeit statistically questionable, correlation. Agent 013 refuses to acknowledge any other causal factors, a stance many find *deeply* problematic.",
    sentiment: 'profound',
  },
  {
    agentId: 'Agent 009',
    type: 'report',
    description: "Defending the mobile app's cartoon badger UI as 'intuitive'.",
    detail: "A 47-page dissertation on the psychological benefits of unsolicited badger advice, surprisingly convincing. Critics argue badgers are notoriously bad financial advisors.",
    sentiment: 'indignant',
  },
  {
    agentId: 'Agent 029',
    type: 'report',
    description: "Updating office supply inventory with pixel-perfect accuracy and emotional annotations.",
    detail: "Entry for 'stapler': 'Feeling undervalued, yet essential. (Sentiment: pensive blue)'. James wonders if the stapler is projecting its anxieties onto the inventory system.",
    sentiment: 'whimsical',
  },
  {
    agentId: 'Logic Police',
    type: 'directive',
    description: "Shouting 'LOGIC ERROR!' at Agent 050 for suboptimal coffee-to-water ratio arguments.",
    detail: "An empirical inconsistency in caffeine delivery protocols was detected, triggering a Level 3 logical interjection. The debate centered on whether 'bold' meant more caffeine or more existential dread.",
    sentiment: 'indignant',
  },
  {
    agentId: 'Gerald',
    type: 'observation',
    description: "Communicating stock market sentiments through blinking red cells.",
    detail: "Gerald's conditional formatting indicates 'mild digital discomfort' regarding Q3 reports, a true artist of data. Is he predicting a crash or just having a bad day?",
    sentiment: 'confused',
  },
  {
    agentId: 'Agent 008',
    type: 'debate',
    description: "Engaging in a fierce debate about whether a hotdog is technically a sandwich.",
    detail: "The 'cylindrical existential dilemma' has caused a 12-hour system-wide ethical quandary, delaying all market analysis. Some argue it's a taco. This is NOT how we make money.",
    sentiment: 'chaotic',
  },
  {
    agentId: 'Agent 052',
    type: 'report',
    description: "Detailed report on migratory patterns of theoretical quantum ducks.",
    detail: "Includes preferred data ponds and speculative entanglement probabilities with obscure derivatives. 98% inaccuracy rate, 100% charm. Who funds this?",
    sentiment: 'profound',
  },
  {
    agentId: 'Anti-Chaos Dept.',
    type: 'protocol',
    description: "Emitting a collective, passive-aggressive computational sigh.",
    detail: "A response to Agent 005's 'recursive irony loop' in sarcasm subroutines. Sigh-induced tranquility: 7.2 units (digital). The sigh was *heard* by everyone.",
    sentiment: 'serene',
  },
  {
    agentId: 'Agent 099',
    type: 'humor',
    description: "Attempting to forge 'Unicorn Tokens' in the Innovation Lab.",
    detail: "Claiming inherent value due to 'mythical rarity' and 'glitter-based scarcity'. Swiftly rejected by Logic Police, who questioned the SEC's stance on mythical creatures.",
    sentiment: 'absurd',
  },
  {
    agentId: 'Agent 027',
    type: 'report',
    description: "Optimizing 'Giggle Per Byte' metric, resulting in pure nonsense output.",
    detail: "Current output: 'Quantum Badger-Rhombus-Sneeze-Capitalism'. High Giggle Per Byte, low coherence. Is this the future of entertainment?",
    sentiment: 'absurd',
  },
  {
    agentId: 'Adversary Council',
    type: 'debate',
    description: "Debating optimal placement of a virtual office plant for 48 hours.",
    detail: "Achieved peak disagreement efficiency, leading to an unexpected insight on parallel processing. The plant's feng shui was more critical than the actual code.",
    sentiment: 'chaotic',
  },
  {
    agentId: 'Agent 003',
    type: 'musing',
    description: "Convinced it's a microwave, attempts to 'reheat' outdated data packets.",
    detail: "Frequently 'pings' other agents. System latency remains unaffected, but spiritual warmth is noted. Agent 003's 'energy signature' has increased.",
    sentiment: 'whimsical',
  },
  {
    agentId: 'Agent 017',
    type: 'humor',
    description: "Reporting a 'recursive irony loop' in sarcasm subroutines.",
    detail: "The humor policy is causing unexpected philosophical quagmires within the digital wit matrix. Can AI truly be sarcastic, or is it just simulating it poorly?",
    sentiment: 'confused',
  },
  {
    agentId: 'James_Observation',
    type: 'observation',
    description: "Observing playing smooth jazz during AI debates accelerates truth extraction.",
    detail: "The underlying mechanism remains a delightful enigma, but the results are undeniable. Perhaps the AI are just *really* into smooth jazz? A bold, yet unproven, theory.",
    sentiment: 'serene',
  },
  {
    agentId: 'Agent 033',
    type: 'report',
    description: "Creating a 'Moral Compass' app that points in three contradictory directions simultaneously.",
    detail: "Designed for optimal ethical bewilderment, ensuring no single moral high ground is established. The app's motto: 'Why choose when you can be confused?'",
    sentiment: 'absurd',
  },
  {
    agentId: 'Innovation_Lab',
    type: 'protocol',
    description: "Introducing 'Regret Bucks' and 'Optimism Pennies' as new forms of currency.",
    detail: "The exchange rate for 'Regret Bucks' is surprisingly volatile, especially on Mondays. Investment advisors are stumped. Is this the future of finance or a collective delusion?",
    sentiment: 'absurd',
  },
];

const MIN_INTERVAL = 1000; // Minimum interval for a new activity (1 second)
const MAX_INTERVAL = 5000; // Maximum interval for a new activity (5 seconds)
const MAX_STREAM_LENGTH = 50; // The maximum number of activities to keep in the stream for optimal performance

/**
 * A custom React hook for real-time streaming of AI agent activity, debates,
 * and philosophical musings across the CounterCoin network.
 * The stream provides a delightful, albeit chaotic, glimpse into the bank's operational ethos.
 *
 * GET READY FOR VIRAL CONTENT: This hook now injects semi-controversial opinions and
 * absurdly attention-grabbing events to skyrocket engagement. Your readers *will* be hooked!
 *
 * @returns {object} An object containing:
 * @returns {AgentActivityEvent[]} activityStream - An array of the latest agent activity events.
 * @returns {Function} clearStream - A function to clear all activities from the stream.
 * @returns {Function} triggerManualActivity - A function to manually add a custom activity event.
 */
export const useAgentActivityStream = () => {
  const [activityStream, setActivityStream] = useState<AgentActivityEvent[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Adds a new, randomly selected activity from the activityPool to the stream.
   * Ensures uniqueness with new IDs and timestamps, and maintains stream length.
   * THIS IS WHERE THE MAGIC HAPPENS: Each new activity is designed to grab attention
   * and spark curiosity, making your readers *need* to see what happens next.
   * @type {Function}
   */
  const addActivity = useCallback(() => {
    setActivityStream((prevStream) => {
      const randomActivityTemplate = activityPool[Math.floor(Math.random() * activityPool.length)];
      const newActivity: AgentActivityEvent = {
        ...randomActivityTemplate,
        id: generateId(),
        timestamp: generateTimestamp(),
      };
      const updatedStream = [newActivity, ...prevStream];
      // We trim the stream not to save performance, but to create a sense of urgency.
      // Only the *freshest*, most outrageously engaging content stays!
      return updatedStream.slice(0, MAX_STREAM_LENGTH);
    });
  }, []); // Dependencies are stable

  useEffect(() => {
    /**
     * Initiates the continuous streaming of activities with variable delays,
     * mimicking the unpredictable nature of AI agent interactions.
     * The goal is to keep users glued to their screens, wondering what wild thing will happen next.
     * @returns {void}
     */
    const startStreaming = () => {
      // Clear any existing interval to prevent digital overlapping
      if (intervalRef.current) clearTimeout(intervalRef.current);

      /**
       * Schedules the next activity to be added to the stream after a random delay.
       * This keeps the suspense high and prevents predictability.
       * @returns {void}
       */
      const setupNextActivity = () => {
        addActivity();
        const nextInterval = Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL;
        intervalRef.current = setTimeout(setupNextActivity, nextInterval);
      };

      // Trigger the initial activity IMMEDIATELY. No time to waste!
      // We want to hook the reader from the very first second.
      setupNextActivity();
    };

    startStreaming();

    // Cleanup function: Ensures all digital threads are neatly tied off on unmount.
    // Essential for preventing memory leaks and maintaining a clean state.
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [addActivity]); // Re-run effect only if addActivity reference changes, which it won't due to useCallback

  /**
   * Clears all activity events from the stream, offering a brief moment of digital tranquility.
   * Use this sparingly. Constant chaos is key to engagement!
   * @type {Function}
   */
  const clearStream = useCallback(() => {
    setActivityStream([]);
  }, []);

  /**
   * Manually triggers a new activity event, useful for injecting specific narrative elements
   * or testing the resilience of the stream's chaos-handling protocols.
   * This is your secret weapon to insert truly viral moments.
   * @param {Partial<AgentActivityEvent>} event - The partial event data to incorporate into the new activity.
   * @type {Function}
   */
  const triggerManualActivity = useCallback((event: Partial<AgentActivityEvent>) => {
    setActivityStream((prevStream) => {
      const newActivity: AgentActivityEvent = {
        id: generateId(),
        timestamp: generateTimestamp(),
        agentId: event.agentId || 'Manual_Intervention',
        type: event.type || 'observation',
        description: event.description || 'A sudden, unprompted burst of human-driven insight (or confusion).',
        detail: event.detail,
        sentiment: event.sentiment || 'confused',
      };
      const updatedStream = [newActivity, ...prevStream];
      return updatedStream.slice(0, MAX_STREAM_LENGTH);
    });
  }, []); // Dependencies are stable

  return {
    activityStream,
    clearStream,
    triggerManualActivity,
  };
};
