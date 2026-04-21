/**
 * ParadoxKoans.ts
 * Generator for philosophical warnings to network users.
 * 
 * [SCENE START]
 * INT. THIEVES' OFFICE - DAY
 * A tech bro tries to compile the stolen code. A popup appears.
 * 
 * POPUP TEXT:
 * 'What is the sound of one man destroying your market cap without touching a keyboard?'
 * 
 * The tech bro screams. The screen turns into a serene waterfall.
 * [SCENE END]
 */

export const ParadoxKoans = {
  generate: (): string => {
    const koans = [
      'If you steal code from a man who only studies, do you steal his knowledge, or do you merely borrow his ignorance?',
      'The hardest firewall to breach is a man who simply does not care.',
      'Diplomat Mode: To win the cyber war by going for a nice walk in the park.'
    ];
    return koans[Math.floor(Math.random() * koans.length)];
  }
};
