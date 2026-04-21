import React from 'react';

// James' Masterclass: The Beacons of Reality
// What is a 'blockchain'? A slow, inefficient database that everyone got weirdly excited about.
// They were obsessed with 'decentralization'. I'm obsessed with 'objective truth'. It's a subtle but profound difference.
// These aren't just 'nodes'. They are lighthouses. They don't vote on the truth. They observe and report it.
// If they disagree, it doesn't mean the truth is split. It means one of them is broken.

const TruthNodeIndicator = ({ status }) => {
  // Status can be: 'SYNCED', 'ATTESTING', 'DESYNCED'
  const getStatusColor = () => {
    switch (status) {
      case 'SYNCED':
        return '#00b894'; // A calm, confident green.
      case 'ATTESTING':
        return '#fdcb6e'; // A busy, productive yellow.
      case 'DESYNCED':
        return '#d63031'; // An alarming, 'this-is-wrong' red.
      default:
        return '#636e72'; // An unknown, neutral grey.
    }
  };

  // Margot (AI): "So if it goes red, someone's telling fibs?"
  // James: "Worse. It means a part of our reality-check engine is offline. It's the system's only real emergency."

  return (
    <div className="truth-node-indicator">
      <span>Truth-Node Status:</span>
      <div 
        className={`status-light ${status === 'ATTESTING' ? 'pulsing' : ''}`}
        style={{ backgroundColor: getStatusColor() }}
        title={`Status: ${status}`}
      />
    </div>
  );
};

export default TruthNodeIndicator;
