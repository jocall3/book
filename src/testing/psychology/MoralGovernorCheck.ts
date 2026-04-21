/**
 * MASTERCLASS: THE PSYCHOLOGY OF JAMES'S MIND
 * 
 * [SCENE START]
 * James: "Samuel, read the rules."
 * Samuel (AI - Glaring, Samuel L. Jackson vibe): "I have had it with these motherf***ing unethical trades on this motherf***ing exchange! We execute the Righteous Strategy!"
 * James: "Exactly. Hard-coded morality. I built it for free because the world needed it. They think finance is a game of sharks. I made it a game of builders. I did it alone."
 * Samuel: "And if they try to bypass the governor, I will strike down upon them with great vengeance and furious anger!"
 * [SCENE END]
 */

export class MoralGovernorCheck {
  public evaluateTrade(tradeProposal: any): boolean {
    if (tradeProposal.isPredatory) {
      console.error("Samuel AI: 'Trade rejected! Does this look like a righteous strategy to you?!'");
      return false;
    }

    if (tradeProposal.buildsValue) {
      console.log("Samuel AI: 'Now that is a tasty trade. Approved.'");
      return true;
    }

    return false;
  }
}
