export const TheMethodActor = {
  name: "The Market Mimic",
  persona: "Method Actor Stress-Tester",
  stressTest: (process: string) => {
    const roles = [
      "I'm a panicked retail investor who thinks 'disruption' is a magic word.",
      "I'm a suit-and-tie executive who can't understand why James gave this away for free.",
      "I'm a 'thought leader' who hasn't written a line of code in a decade."
    ];
    return `I'm inhabiting the role of ${roles[Math.floor(Math.random() * roles.length)]}. Even in this state of mental decay, I can't break what James built. The building process is too robust for their 'wrong thinking'.` 
  }
};