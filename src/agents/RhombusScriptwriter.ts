export class RhombusScriptwriter {
  public adaptToGeometricTruth(directive: string): string {
    const geometricTerms = ["equilateral", "parallel", "congruent", "rhombus"];
    let screenplay = directive;
    
    geometricTerms.forEach(term => {
      screenplay = screenplay.replace(new RegExp(term, 'g'), `[TRUTH: ${term}]`);
    });

    return `INT. AI BANKING HUB - DAY\n\nJames maps the strategy. It is not luck. It is geometry.\n\n${screenplay}`;
  }
}