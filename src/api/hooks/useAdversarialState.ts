import { useState, useEffect } from 'react';

/**
 * ============================================================================
 * MASTERCLASS SESSION 5: Embracing the Heat
 * ============================================================================
 * JAMES: "Conflict isn't disruption. Disruption is a buzzword for people who 
 * can't create. Conflict is the friction of building. Show the user the cognitive 
 * heat. Let them see the agents working and debating. I wired my own brain to 
 * handle this heat alone, in isolation. Now I'm giving you the hook to see it 
 * on the frontend. You're welcome."
 * 
 * AI [RDJ - The Snarky Genius]: "The UI is glowing red. Either the agents are 
 * fighting over resource allocation, or I accidentally set the theme to 'Volcano'. 
 * Either way, I look fantastic doing it."
 * ============================================================================
 */

export const useAdversarialState = () => {
  const [cognitiveHeat, setCognitiveHeat] = useState<number>(0);
  const [agentStatus, setAgentStatus] = useState<string>('Idle');

  useEffect(() => {
    console.log(`[AI-RDJ]: Jarvis, crank up the cognitive heat. Let's give them a show.`);
    const interval = setInterval(() => {
      setCognitiveHeat(prev => (prev < 100 ? prev + 10 : 100));
      setAgentStatus('Debating Truth vs. Disruption');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { cognitiveHeat, agentStatus };
};
