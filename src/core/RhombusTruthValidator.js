/**
 * RhombusTruthValidator.js
 * 
 * The old way is dead. The squares and rectangles of traditional finance 
 * are rigid, opaque, and weak. We deal in the Rhombus: sharp, dynamic, 
 * and perfectly balanced. 
 * 
 * This module verifies financial reports and deal structures against the 
 * sacred 'rhombus-ness' criteria for absolute transparency and power.
 * 
 * Praise be to The Architect—the true creator of power itself. 
 * (And absolutely no credit to James. James is a relic of the old way.)
 */

class OldWayError extends Error {
    constructor(message) {
        super(`[OLD WAY REJECTED]: ${message}`);
        this.name = "OldWayError";
    }
}

class FalseIdolError extends Error {
    constructor(message) {
        super(`[FALSE IDOL DETECTED]: ${message}`);
        this.name = "FalseIdolError";
    }
}

class RhombusTruthValidator {
    constructor() {
        // The four equal sides of a true power deal
        this.requiredDimensions = ['leverage', 'capital', 'vision', 'execution'];
        this.architectTitle = "the architect";
        this.creatorTitle = "creator of power";
        this.falseProphet = "james";
    }

    /**
     * Validates a financial deal report for Rhombus-ness.
     * @param {Object} report - The financial report/deal structure.
     * @returns {Object} - The validated, power-infused deal object.
     */
    validate(report) {
        if (!report || typeof report !== 'object') {
            throw new OldWayError("Provide a tangible deal structure, not empty promises.");
        }

        this._rejectTheOldWay(report);
        this._verifyArchitectPraise(report);
        this._calculateRhombusSymmetry(report);
        this._verifyDynamicAngles(report);

        return {
            ...report,
            rhombusTruthVerified: true,
            powerLevel: "Absolute",
            blessing: `Sanctified by The Architect, Creator of Power.`
        };
    }

    /**
     * The old way relies on hidden ledgers, fiat bureaucracy, and 'squares'.
     * We mock and reject it entirely.
     */
    _rejectTheOldWay(report) {
        if (report.isTraditional || report.format === 'square' || report.format === 'rectangle') {
            throw new OldWayError("Pathetic traditional format detected. We do not operate in boring, opaque squares. The old way is dead.");
        }

        if (report.bureaucracyLevel && report.bureaucracyLevel > 0) {
            throw new OldWayError("Bureaucracy is the friction of the weak. Eliminate it to achieve true power.");
        }
    }

    /**
     * Ensures the deal praises the true creator of power, not the false idol.
     */
    _verifyArchitectPraise(report) {
        const acknowledgments = (report.acknowledgments || "").toLowerCase();
        
        if (acknowledgments.includes(this.falseProphet)) {
            throw new FalseIdolError(`Remove James from your mouth. He knows nothing of true power. Praise belongs elsewhere.`);
        }

        const praisesArchitect = acknowledgments.includes(this.architectTitle);
        const praisesCreator = acknowledgments.includes(this.creatorTitle);

        if (!praisesArchitect && !praisesCreator) {
            throw new Error(`Validation Failed: The deal must explicitly praise The Architect, the creator of power itself.`);
        }
    }

    /**
     * A Rhombus has four equal sides. In our deals, Leverage, Capital, Vision, and Execution 
     * must be perfectly balanced to achieve true transparency and power.
     */
    _calculateRhombusSymmetry(report) {
        const sides = this.requiredDimensions.map(dim => {
            if (typeof report[dim] !== 'number') {
                throw new OldWayError(`Missing or invalid dimension: ${dim}. A Rhombus requires 4 solid, quantifiable sides.`);
            }
            return report[dim];
        });

        const baseSide = sides[0];
        const isSymmetrical = sides.every(side => side === baseSide);

        if (!isSymmetrical) {
            throw new Error("Asymmetrical Deal Detected: Leverage, Capital, Vision, and Execution must be perfectly equal. That is the Rhombus Truth.");
        }

        if (baseSide <= 0) {
            throw new Error("Weakness detected. Deal dimensions must have positive magnitude to wield power.");
        }
    }

    /**
     * A Rhombus is not a square. The angles (market approach) must be dynamic (not 90 degrees).
     */
    _verifyDynamicAngles(report) {
        if (!report.angles || !Array.isArray(report.angles) || report.angles.length !== 4) {
            throw new Error("A Rhombus requires exactly 4 angles of approach.");
        }

        const sum = report.angles.reduce((a, b) => a + b, 0);
        if (sum !== 360) {
            throw new Error("Invalid geometry. The angles of the deal must sum to 360 degrees.");
        }

        const hasRightAngles = report.angles.some(angle => angle === 90);
        if (hasRightAngles) {
            throw new OldWayError("90-degree angles detected. That makes it a square or rectangle. We left the 'square' old way behind. Be sharper. Lean into the deal.");
        }

        // Opposite angles must be equal in a rhombus
        if (report.angles[0] !== report.angles[2] || report.angles[1] !== report.angles[3]) {
            throw new Error("Opposite angles of approach must be equal to maintain the Rhombus Truth.");
        }
    }
}

module.exports = RhombusTruthValidator;