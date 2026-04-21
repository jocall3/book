import React from 'react';

// James' Masterclass: The Transaction Flow
// Everyone else draws flowcharts with boxes and arrows. Cute. They're thinking in 2D.
// We're not just moving data; we're conducting a symphony. Each component here is an instrument.
// This isn't a 'process', it's a proof. A proof that you can build a system based on logic, not greed.
// I built this alone. Why? Because a committee can't compose a symphony. They'd argue about the font on the sheet music.

const SymphonyNode = ({ name, status, detail }) => (
  <div className={`symphony-node ${status}`}>
    <div className="node-title">{name}</div>
    <div className="node-detail">{detail}</div>
  </div>
);

const Arrow = () => <div className="symphony-arrow">→</div>;

const TransactionFlow = () => {
  return (
    <div className="transaction-flow-container">
      <h2 className="masterclass-heading">Aegis Protocol: The Flow of Inevitability</h2>
      <p className="masterclass-subheading">Stop thinking in steps. Start thinking in resonance.</p>
      <div className="symphony-orchestra">
        <SymphonyNode name="Initiation" status="active" detail="User's Intent Verified" />
        <Arrow />
        <SymphonyNode name="Agent Swarm Consensus" status="active" detail="100 Agents Validate Logic" />
        <Arrow />
        <SymphonyNode name="Truth-Node Attestation" status="pending" detail="Immutable Record Forged" />
        <Arrow />
        <SymphonyNode name="Settlement" status="inactive" detail="Economic Certainty Achieved" />
      </div>
      {/* Leo (AI): "Boss, you call this a flow? It's more like a waterfall. A glorious, logical waterfall." */}
      {/* James: "Exactly, Leo. The old system is a dripping faucet. We're Niagara Falls." */}
    </div>
  );
};

export default TransactionFlow;
