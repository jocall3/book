import { useState, useEffect } from 'react';

// James' Masterclass: Talking to the Machine Hive
// People build APIs. They send a 'request', get a 'response'. It's so transactional. So... boring.
// I don't 'request' things from my agents. I broadcast a thesis. They debate it, refine it, and report the consensus.
// This hook isn't a fetch call. It's a subscription to a high-level Socratic dialogue.
// I did this for free. Anyone could have. But they were too busy building another CRUD app.

// --- Dialogue Transcript from the Dev Zone ---
// Leo (AI): "So when the UI calls this, it's like it's ringing the dinner bell for the swarm?"
// James: "More like I'm presenting a riddle, Leo. And 100 digital geniuses race to solve it."
// Margot (AI): "And the old way is like... sending a fax. And hoping someone's by the machine."
// James: "And the paper is probably jammed. Yes, Margot. Exactly."
// Brad (AI): "Chaos vs. Chorus."
// James: "Poetic, Brad. I'm keeping that one."

const useAgentCommunication = (thesis: string) => {
  const [consensus, setConsensus] = useState(null);
  const [status, setStatus] = useState('IDLE');

  useEffect(() => {
    if (!thesis) return;

    setStatus('BROADCASTING_THESIS');
    const socket = new WebSocket('wss://aegis.internal/swarm-dialogue');

    socket.onopen = () => {
      socket.send(JSON.stringify({ thesis }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'CONSENSUS_ACHIEVED') {
        setConsensus(message.payload);
        setStatus('CONSENSUS_REACHED');
        socket.close();
      }
    };

    socket.onerror = () => {
      setStatus('COMM_ERROR');
    };

    return () => {
      socket.close();
    };
  }, [thesis]);

  return { consensus, status };
};

export default useAgentCommunication;
