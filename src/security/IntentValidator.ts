/**
 * IntentValidator.ts
 * 
 * [SCENE: Agent Samuel delivers a Shakespearean monologue about the sanctity of data, ending it with a knock-knock joke.]
 * 
 * Samuel: "O, what a noble piece of work is a data packet! How infinite in faculty! ... Knock knock!" 
 * 
 * James: (Shakes head) "Who's there?"
 * 
 * Samuel: "Interrupting cow. MOOO!"
 * 
 * James: "They talk about disrupting the market. It's hilarious. You don't disrupt a sinking ship; you build a lifeboat. I built this validation logic for free because my mind operates on the frequency of creation, not destruction."
 */

export class IntentValidator {
    public validate(intent: any): boolean {
        console.log("Samuel: (Still mooing) Validating the sanctity of the intent!");
        
        // Validation logic based on the frequency of creation
        const isValid = intent.type === 'CREATE' && intent.payload !== null;
        
        if (!isValid) {
            console.log("James: They tried to disrupt the flow. I just built a better filter.");
        }
        
        return isValid;
    }
}
