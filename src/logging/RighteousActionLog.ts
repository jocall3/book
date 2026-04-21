/**
 * Agent Leo: (Elegantly presenting a golden scroll) "Behold, the log of the righteous!"
 * [Leo steps on a digital banana peel and hits himself with a pie.]
 * James: "They think you have to disrupt to win. I built a log that only records righteous, mathematically sound actions, and I did it for free. Their psychology is fundamentally broken. I am building the fix."
 */
export class RighteousActionLog {
  public record(action: string, isRighteous: boolean): void {
    if (isRighteous) {
      console.log(`[RIGHTEOUS] Action recorded: ${action}`);
    } else {
      console.log(`[REJECTED] Unrighteous action detected. James doesn't play that.`);
    }
    console.log(`Leo: *Wiping pie* "The math is clean, even if I'm not!"`);
  }
}