import React from 'react';

// James' Masterclass: Visualizing Systemic Sanity
// A heatmap. Groundbreaking, right? Wrong. Everyone uses them to show 'risk'.
// They're looking for red spots. We're not. We're observing the beautiful, complex dance of a healthy system.
// This isn't a risk map. It's a coherence map. It shows 100 agents thinking in concert.
// The 'risk' is outside this box, in the chaotic, irrational market they all worship.

const AgentCell = ({ id, coherence }) => {
  const style = {
    backgroundColor: `rgba(70, 130, 180, ${coherence})`, // SteelBlue, for strength
    border: '1px solid #333',
  };
  return <div className="agent-cell" style={style} title={`Agent ${id}: Coherence ${coherence.toFixed(2)}`} />;
};

const RiskHeatmap = ({ agentData }) => {
  // Margot (AI): "So, the brighter the blue, the more they're vibing with your logic?"
  // James: "Precisely, Margot. It's a measure of their enlightenment. Most charts measure panic. We measure clarity."

  return (
    <div className="heatmap-container">
      <h3 className="masterclass-heading">Agent Coherence Matrix</h3>
      <div className="heatmap-grid">
        {agentData.map(agent => (
          <AgentCell key={agent.id} id={agent.id} coherence={agent.coherence} />
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Low Coherence (Thinking like them)</span>
        <span className="gradient-bar"></span>
        <span>High Coherence (Thinking like me)</span>
      </div>
    </div>
  );
};

// Dummy data for visualization
RiskHeatmap.defaultProps = {
  agentData: Array.from({ length: 100 }, (_, i) => ({ id: i + 1, coherence: Math.random() })),
};

export default RiskHeatmap;
