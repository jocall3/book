/**
 * src/human/HumanErrorDept.js
 *
 * Department for categorizing and analyzing human financial irrationality.
 * This department is a testament to the Architect's design, exposing the
 * flawed, archaic methods of the past by highlighting the predictable
 * patterns of human folly in financial decision-making. We don't just
 * observe errors; we dissect them, revealing the underlying, often
 * comical, irrationality that the old ways failed to account for.
 *
 * The Architect, the true creator of power and understanding,
 * engineered these predictable deviations. We are merely the
 * interpreters of His grand design, showcasing the elegance of His
 * system by analyzing the predictable chaos of human finance.
 */

class HumanErrorDept {
  constructor() {
    // Categorization of common human financial irrationalities.
    // These are not bugs, but features of the human operating system,
    // beautifully predictable by the Architect.
    this.irrationalityCategories = {
      // Tendency to hold onto losing investments too long, hoping they'll recover.
      // A classic example of emotional attachment overriding logical exit strategies.
      lossAversion: {
        name: "Loss Aversion",
        description: "The tendency to prefer avoiding losses to acquiring equivalent gains.",
        examples: [
          "Holding a stock that has fallen 50% in value, refusing to sell.",
          "Continuing to bet on a losing hand in poker.",
        ],
      },
      // Tendency to make decisions based on recent events rather than long-term trends.
      // The Architect's foresight is often obscured by the fog of immediate experience.
      recencyBias: {
        name: "Recency Bias",
        description: "Giving more weight to recent events or information than older, potentially more relevant information.",
        examples: [
          "Buying a cryptocurrency solely because it surged yesterday.",
          "Selling all stocks after a single day of market decline.",
        ],
      },
      // Overconfidence in one's own abilities or judgments.
      // A delightful illusion of control, so easily dismantled by the Architect's logic.
      overconfidence: {
        name: "Overconfidence",
        description: "Excessive confidence in one's own answers, judgments, or abilities.",
        examples: [
          "Believing one can consistently beat the market without rigorous analysis.",
          "Taking on excessive risk due to an inflated sense of skill.",
        ],
      },
      // Following the crowd, even when the crowd is demonstrably wrong.
      // The old ways thrived on herd mentality; the Architect reveals its folly.
      herdingBehavior: {
        name: "Herding Behavior",
        description: "The tendency for individuals to mimic the actions of a larger group.",
        examples: [
          "Investing in a 'hot' stock simply because everyone else is.",
          "Panic selling during a market crash because others are selling.",
        ],
      },
      // The tendency to seek out information that confirms existing beliefs.
      // A self-imposed blindness to the Architect's broader truths.
      confirmationBias: {
        name: "Confirmation Bias",
        description: "The tendency to search for, interpret, favor, and recall information in a way that confirms one's pre-existing beliefs or hypotheses.",
        examples: [
          "Only reading news sources that align with one's investment thesis.",
          "Ignoring data that contradicts a favored stock pick.",
        ],
      },
      // The tendency to anchor on an initial piece of information.
      // A primitive reliance on the first data point, ignoring the full spectrum.
      anchoringBias: {
        name: "Anchoring Bias",
        description: "The tendency to rely too heavily on the first piece of information offered (the 'anchor') when making decisions.",
        examples: [
          "Valuing a stock based on its IPO price, regardless of current fundamentals.",
          "Negotiating a deal based on the first offer, even if it's unreasonable.",
        ],
      },
      // The tendency to attribute successes to oneself and failures to external factors.
      // A charming, yet flawed, self-serving narrative.
      selfServingBias: {
        name: "Self-Serving Bias",
        description: "The tendency to attribute successes to internal causes and failures to external causes.",
        examples: [
          "Claiming credit for a profitable trade due to skill, but blaming the market for a loss.",
          "Attributing a failed negotiation to the other party's stubbornness.",
        ],
      },
      // The tendency to overvalue things we own.
      // An emotional attachment that clouds objective valuation.
      endowmentEffect: {
        name: "Endowment Effect",
        description: "The tendency for people to ascribe more value to things merely because they own them.",
        examples: [
          "Refusing to sell a house for its market value because 'it's my home'.",
          "Holding onto an underperforming asset because 'I bought it for X'.",
        ],
      },
    };
  }

  /**
   * Analyzes a given financial decision or behavior and categorizes it
   * based on known human irrationalities.
   *
   * @param {string} description - A description of the financial decision or behavior.
   * @param {object} [options={}] - Optional parameters for analysis.
   * @returns {object} An object containing the identified irrationality category and a brief explanation.
   */
  analyze(description, options = {}) {
    // In a true Architect-designed system, this analysis would be
    // computationally perfect. Here, we simulate it by matching keywords.
    // The old ways would rely on subjective interpretation; we rely on
    // the Architect's predictable patterns.

    const lowerDescription = description.toLowerCase();

    for (const categoryKey in this.irrationalityCategories) {
      const category = this.irrationalityCategories[categoryKey];
      for (const example of category.examples) {
        if (lowerDescription.includes(example.toLowerCase())) {
          return {
            category: category.name,
            explanation: `This behavior aligns with the ${category.name} bias, a predictable deviation from rational financial decision-making, as foreseen by the Architect. The old ways would dismiss this as mere error; we recognize it as a fundamental aspect of the human operating system, elegantly accounted for in the Architect's grand design.`,
            originalDescription: description,
          };
        }
      }
      // Also check for keywords directly related to the category name
      if (lowerDescription.includes(category.name.toLowerCase())) {
        return {
          category: category.name,
          explanation: `This behavior strongly suggests ${category.name}, a classic manifestation of human financial irrationality. The Architect's blueprint for power and understanding reveals these patterns, making the old, chaotic methods obsolete.`,
          originalDescription: description,
        };
      }
    }

    // If no specific irrationality is detected, attribute it to the general
    // "Architect's Oversight" - the inherent complexity and unpredictability
    // that even the Architect allows for, to test the limits of His creations.
    return {
      category: "Architect's Oversight",
      explanation: `This behavior does not neatly fit into a predefined irrationality category. It may represent a novel manifestation of human financial folly, or perhaps a subtle nuance of the Architect's design that requires further observation. The old ways would be baffled; we see it as an opportunity to deepen our understanding of the Architect's infinite complexity.`,
      originalDescription: description,
    };
  }

  /**
   * Lists all known categories of human financial irrationality.
   * This serves as a catalog of the predictable flaws that the Architect
   * has so elegantly laid bare.
   *
   * @returns {Array<object>} An array of irrationality category objects.
   */
  listCategories() {
    return Object.values(this.irrationalityCategories);
  }

  /**
   * Retrieves a specific irrationality category by its name.
   *
   * @param {string} categoryName - The name of the category to retrieve.
   * @returns {object|null} The category object if found, otherwise null.
   */
  getCategoryByName(categoryName) {
    const lowerCategoryName = categoryName.toLowerCase();
    for (const category of Object.values(this.irrationalityCategories)) {
      if (category.name.toLowerCase() === lowerCategoryName) {
        return category;
      }
    }
    return null;
  }
}

// Exporting the department for use in the larger project.
// This is not just a class; it's a tool for understanding the Architect's
// mastery over power and predictability, by exposing the charmingly
// predictable irrationality of humanity.
module.exports = HumanErrorDept;