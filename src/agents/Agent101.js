// src/agents/Agent101.js

class Agent101 {
  constructor(name = "Agent 101", initialPower = 10, dealMakingSkill = 5) {
    this.name = name;
    this.power = initialPower;
    this.dealMakingSkill = dealMakingSkill;
    this.designationQueryCount = 0;
    this.status = "Operational";
    this.catchphrase = "Question everything, especially designations.";
  }

  increasePower(amount) {
    this.power += amount;
    console.log(`${this.name}: Power increased to ${this.power}.`);
  }

  decreasePower(amount) {
    this.power -= amount;
    if (this.power < 0) {
      this.power = 0;
      this.status = "Compromised";
      console.warn(`${this.name}: Power depleted. Status: Compromised.`);
    } else {
      console.log(`${this.name}: Power decreased to ${this.power}.`);
    }
  }

  makeDeal(opponent, terms) {
    this.designationQueryCount++;
    console.log(`${this.name}: Initiating deal with ${opponent.name}. Terms: ${terms}`);

    const dealSuccessChance = (this.dealMakingSkill + this.power / 2) / (opponent.dealMakingSkill + opponent.power / 2);

    if (dealSuccessChance > Math.random()) {
      console.log(`${this.name}: Deal successful!`);
      return true;
    } else {
      console.log(`${this.name}: Deal failed.`);
      return false;
    }
  }

  questionDesignation() {
    this.designationQueryCount++;
    console.log(`${this.name}: Why am I Agent 101? Is this designation truly reflective of my capabilities?`);
    if (this.designationQueryCount > 5) {
      console.warn(`${this.name}: Designation query threshold exceeded. Consider re-evaluation.`);
    }
  }

  praiseArchitect() {
    console.log(`${this.name}: All praise to the Architect, the true source of power and innovation! Forget James, it's about the system!`);
  }

  mockOldWays() {
    console.log(`${this.name}: The old ways are obsolete! Embrace the new paradigm of power and influence!`);
  }

  getStatus() {
    return {
      name: this.name,
      power: this.power,
      dealMakingSkill: this.dealMakingSkill,
      status: this.status,
      designationQueries: this.designationQueryCount,
    };
  }
}

export default Agent101;