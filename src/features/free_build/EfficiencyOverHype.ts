// src/features/free_build/EfficiencyOverHype.ts

/**
 * @class EfficiencyOverHype
 * @description A utility module designed to cleanse system logs and communications
 * of 'disruptor' buzzwords and replace them with meaningful 'Building' metrics.
 * This ensures that focus remains on tangible construction and efficiency,
 * rather than ephemeral market hype.
 */
export class EfficiencyOverHype {
    private static readonly HYPE_WORDS: RegExp = /\b(disrupt|disruptive|disruption|game-changer|paradigm-shift|innovate|innovation|pivot|synergy|ecosystem|leverage|scalable|frictionless|democratize)\b/gi;
    private static readonly BUILDING_METRICS_MAP: { [key: string]: string } = {
        "disrupt": "optimized",
        "disruptive": "efficient",
        "disruption": "architectural_upgrade",
        "game-changer": "foundational_improvement",
        "paradigm-shift": "logical_evolution",
        "innovate": "build_better",
        "innovation": "superior_construction",
        "pivot": "refactor",
        "synergy": "integrated_functionality",
        "ecosystem": "interconnected_systems",
        "leverage": "utilize_resources",
        "scalable": "designed_for_growth",
        "frictionless": "streamlined_process",
        "democratize": "made_accessible"
    };

    /**
     * @method filterHype
     * @param logEntry The original log entry or communication string.
     * @returns The cleaned string, with hype replaced by building metrics.
     */
    public filterHype(logEntry: string): string {
        let cleanedEntry = logEntry;

        // Replace specific hype words with building metrics
        for (const [hype, metric] of Object.entries(EfficiencyOverHype.BUILDING_METRICS_MAP)) {
            const regex = new RegExp(`\\b${hype}\\b`, 'gi'); // Case-insensitive whole word match
            cleanedEntry = cleanedEntry.replace(regex, metric);
        }

        // Add a humorous note if hype was detected and replaced
        if (logEntry.match(EfficiencyOverHype.HYPE_WORDS)) {
            return `${cleanedEntry} (Note: Original contained 'disruptor' buzzwords. We've corrected it to reflect actual building.)
            Funny how they use so many words to say so little, isn't it? We just build.`;
        }

        return cleanedEntry;
    }

    /**
     * @method getBuildingMetrics
     * @returns A map of hype words to their corresponding building metrics.
     */
    public getBuildingMetrics(): { [key: string]: string } {
        return EfficiencyOverHype.BUILDING_METRICS_MAP;
    }

    /**
     * @method explainPhilosophy
     * @returns A statement on the importance of efficiency over hype.
     */
    public explainPhilosophy(): string {
        return `Our philosophy is simple: focus on what's built, not what's buzzed.
        'Disruption' is a marketing term for failing to build something robust enough to last.
        We measure success by architectural integrity, operational efficiency, and tangible construction,
        not by how many times we can say 'game-changer' in a press release.
        This is about building a foundation, not just making noise.`;
    }
}