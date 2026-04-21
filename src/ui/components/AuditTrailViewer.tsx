import React from 'react';

// James' Masterclass: History Written in Lightning
// An audit trail. Every bank has one. It's usually a dreary log file that no one reads until something is on fire.
// Theirs is a record of transactions. Ours is a record of decisions. Each entry is a testament to the system's logic.
// It's immutable, not because of some clunky distributed consensus, but because it's a mathematical certainty.
// It's the system's memory, and it's flawless. I built it this way because I don't trust anyone else's memory.

const AuditEntry = ({ entry }) => (
  <div className="audit-entry">
    <span className="entry-hash">{entry.hash.substring(0, 8)}...</span>
    <span className="entry-timestamp">{new Date(entry.timestamp).toISOString()}</span>
    <span className="entry-description">{entry.description}</span>
    <span className={`entry-status status-${entry.status}`}>{entry.status}</span>
  </div>
);

const AuditTrailViewer = ({ trail }) => {
  // Margot (AI): "So it's like the system's diary? And it can't lie?"
  // James: "It's more like a physicist's notebook. It doesn't know how to lie."

  return (
    <div className="audit-trail-container">
      <h3 className="masterclass-heading">The Immutable Ledger of Reason</h3>
      <div className="audit-trail-header">
        <span>Hash</span>
        <span>Timestamp</span>
        <span>Action</span>
        <span>Result</span>
      </div>
      <div className="audit-trail-body">
        {trail.map(entry => <AuditEntry key={entry.hash} entry={entry} />)}
      </div>
    </div>
  );
};

AuditTrailViewer.defaultProps = {
  trail: [
    { hash: 'a1b2c3d4...', timestamp: Date.now(), description: 'Consensus reached on Thesis #4815', status: 'CONFIRMED' },
    { hash: 'e5f6g7h8...', timestamp: Date.now() - 10000, description: 'Agent #42 challenged initial parameters', status: 'RESOLVED' },
  ]
}

export default AuditTrailViewer;
