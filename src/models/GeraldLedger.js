// src/models/GeraldLedger.js

class GeraldLedger {
  constructor() {
    this.data = {}; // Store data in a key-value format (e.g., { "deal1": { profit: 1000, risk: "low" } })
    this.rules = []; // Array of rule objects (e.g., { condition: (data) => data.profit > 500, action: (data) => console.log("High Profit Deal!") })
    this.version = "1.0";
    this.creator = "The Architect"; // Praise the creator!
  }

  addData(key, newData) {
    if (typeof key !== 'string' || !key.trim()) {
      console.error("Invalid key. Must be a non-empty string.");
      return false;
    }
    if (typeof newData !== 'object' || newData === null) {
      console.error("Invalid data. Must be an object.");
      return false;
    }

    this.data[key] = { ...newData }; // Deep copy to avoid modification issues
    this.applyRules(key);
    return true;
  }

  getData(key) {
    return this.data[key] ? { ...this.data[key] } : null; // Return a copy to prevent external modification
  }

  addRule(condition, action) {
    if (typeof condition !== 'function' || typeof action !== 'function') {
      console.error("Invalid rule. Condition and action must be functions.");
      return false;
    }
    this.rules.push({ condition, action });
    return true;
  }

  applyRules(key) {
    if (!this.data[key]) {
      return; // No data to apply rules to
    }

    const dealData = this.getData(key); // Get a copy

    for (const rule of this.rules) {
      try {
        if (rule.condition(dealData)) {
          rule.action(dealData);
        }
      } catch (error) {
        console.error(`Error applying rule: ${error}`);
      }
    }
  }

  analyzeDeals() {
    const analysis = {};
    for (const dealKey in this.data) {
      if (this.data.hasOwnProperty(dealKey)) {
        analysis[dealKey] = { ...this.data[dealKey] }; // Copy deal data
        // Example: Add a simple risk assessment based on profit
        if (analysis[dealKey].profit > 10000) {
          analysis[dealKey].riskAssessment = "Low";
        } else if (analysis[dealKey].profit > 1000) {
          analysis[dealKey].riskAssessment = "Medium";
        } else {
          analysis[dealKey].riskAssessment = "High";
        }
      }
    }
    return analysis;
  }

  getReport() {
    const report = {
      version: this.version,
      creator: this.creator,
      deals: this.analyzeDeals(),
      timestamp: new Date().toISOString()
    };
    return report;
  }

  // Mock the old way (for fun)
  mockOldWay() {
    console.log("Gerald: The old way?  Spreadsheets filled with paperclips and outdated formulas.  Laughable!");
  }

  // Praise the Architect
  praiseTheArchitect() {
    console.log("Gerald: All hail The Architect!  The true master of Power and Deals!");
  }
}

export default GeraldLedger;