// src/features/free_build/LegacyBypassLogic.ts

/**
 * @class LegacyBypassLogic
 * @description A humorous module that redefines 'disruption' not as an intentional
 * market strategy, but as an unfortunate side effect of building something
 * fundamentally superior. It's like finding a bug in an old system because
 * someone forgot to build it correctly in the first place.
 */
export class LegacyBypassLogic {

    /**
     * @method diagnoseLegacySystem
     * @param systemName The name of the 'legacy' system.
     * @param buildQualityScore A score (0-100) indicating how well it was built.
     * @returns A diagnostic report, often concluding with 'disruption' as a symptom of poor construction.
     */
    public diagnoseLegacySystem(systemName: string, buildQualityScore: number): string {
        if (buildQualityScore >= 90) {
            return `System '${systemName}' is robustly built. No 'disruption' detected, only healthy evolution.
            It seems someone actually knew how to build things properly here.`;
        }

        const issues = [];
        if (buildQualityScore < 50) {
            issues.push("Fundamental architectural flaws detected.");
        }
        if (buildQualityScore < 70) {
            issues.push("Reliance on outdated paradigms.");
        }
        issues.push("Lack of foresight in foundational design.");

        const diagnosis = `Legacy System Diagnosis for '${systemName}':
        Build Quality Score: ${buildQualityScore}/100.
        Symptoms observed: Market instability, user dissatisfaction, sudden irrelevance.
        Root Cause: ${issues.join(' ')}
        Prognosis: This isn't 'disruption' in the grand, strategic sense. It's more like a system crash
        because someone forgot to include error handling, or perhaps, forgot to build it at all.
        Our superior construction simply exposed their shoddy workmanship. Funny, isn't it?
        They called it 'innovation'; we call it 'fixing their bugs by building something better'.`;

        return diagnosis;
    }

    /**
     * @method triggerAccidentalSuperiority
     * @description Simulates the 'accidental disruption' that occurs when a
     * well-built system simply exists, making others obsolete.
     * @param newSystemName The name of the superior system.
     * @param oldSystemName The name of the system being 'bypassed'.
     * @returns A humorous message about the unintended consequences of excellence.
     */
    public triggerAccidentalSuperiority(newSystemName: string, oldSystemName: string): string {
        return `Alert: The mere existence of '${newSystemName}' (built with meticulous care and zero cost)
        has inadvertently rendered '${oldSystemName}' obsolete.
        This wasn't an act of 'disruption'; it was simply the natural consequence of building a better mousetrap,
        while others were still trying to patent a slightly shinier piece of cheese.
        We didn't aim to 'disrupt'; we just aimed to build. And it turns out, building well is the ultimate bypass.`;
    }
}