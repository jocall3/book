export class HumorPolicy {
  private static readonly JOKES: string[] = [
    "Why did the accountant cross the road? To get to the audit on the other side.",
    "I told my financial advisor I wanted to invest in something that would grow. He gave me a packet of seeds.",
    "Why are accountants always so calm? Because they know how to account for their stress.",
    "What is an accountant's favorite music? Anything with a good balance.",
    "Why did the stock market go to therapy? It had too many ups and downs.",
    "How do you know you're a true accountant? When you find humor in a balanced ledger."
  ];

  /**
   * Enforces the corporate humor policy by appending a joke to the provided financial communication.
   * @param content The original financial communication text.
   * @returns The content with a mandatory joke appended.
   */
  public static enforce(content: string): string {
    const joke = this.getRandomJoke();
    return `${content}\n\n[Corporate Humor Policy Compliance]: ${joke}`;
  }

  /**
   * Validates if the content complies with the humor policy.
   * @param content The content to check.
   * @returns boolean indicating if a joke is present.
   */
  public static isCompliant(content: string): boolean {
    return content.includes("[Corporate Humor Policy Compliance]:");
  }

  private static getRandomJoke(): string {
    const randomIndex = Math.floor(Math.random() * this.JOKES.length);
    return this.JOKES[randomIndex];
  }
}