import React from 'react';

// James' Masterclass: Quantifying Delusion
// The market isn't 'irrational'. That's a cop-out. It's predictably absurd.
// It's a herd of people who think they're contrarians, all running in the same direction.
// This gauge doesn't measure volatility or sentiment. It measures the delta between market action and pure, cold logic.
// In other words, it measures how wrong they are. The higher the number, the more I'm smiling.

const MarketAbsurdityGauge = ({ absurdityIndex }) => {
  const rotation = Math.min(Math.max(absurdityIndex * 1.8, 0), 180); // Map 0-100 to 0-180 degrees

  // Leo (AI): "So when this thing hits 100, we're basically in the upside-down?"
  // James: "No, Leo. It means we're the only ones right-side up."

  return (
    <div className="absurdity-gauge-container">
      <h4>Market Absurdity Index</h4>
      <div className="gauge-face">
        <div className="gauge-needle" style={{ transform: `rotate(${rotation}deg)` }} />
        <div className="gauge-center-pivot" />
        <div className="gauge-label-low">Logical</div>
        <div className="gauge-label-high">Hilarious</div>
      </div>
      <div className="gauge-reading">{absurdityIndex.toFixed(1)}%</div>
    </div>
  );
};

MarketAbsurdityGauge.defaultProps = {
  absurdityIndex: 78.4, // A typical Tuesday
};

export default MarketAbsurdityGauge;
