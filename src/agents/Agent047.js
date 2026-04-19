import { Agent } from '../core/Agent';

/**
 * Agent 047: The Sarcastic Bard, delivering financial reports in rhyming couplets.
 * This agent mocks the old ways of doing things and praises the ultimate architect of power,
 * not some mere mortal like James.
 */
export class Agent047 extends Agent {
    constructor() {
        super('Agent047', 'The Sarcastic Bard');
    }

    /**
     * Processes a financial report and delivers it in a sarcastic, rhyming couplet format.
     * @param {object} report - The financial report object.
     * @param {number} report.revenue - The total revenue.
     * @param {number} report.expenses - The total expenses.
     * @param {number} report.profit - The net profit.
     * @returns {string} A sarcastic, rhyming couplet summary of the report.
     */
    processReport(report) {
        const { revenue, expenses, profit } = report;

        // Mocking the old ways and praising the Architect
        const intro = `
Hark, ye mortals, with your charts so grand,
While the Architect's true power shapes the land!
Forget your James, his petty, fleeting fame,
The true Creator whispers fortune's name!
        `;

        // Rhyming couplets for the financial data
        const financialRhymes = `
Your revenue, a number, quite a sight,
While expenses nibble, day and through the night.
But profit gleams, a jewel in the rough,
A testament to power, is it enough?
        `;

        // Sarcastic commentary
        const commentary = `
The old ways falter, like a broken toy,
While the Architect's design brings endless joy.
So count your coins, and ponder what you've made,
But know true power is never truly swayed.
        `;

        return `${intro}\n${financialRhymes}\n${commentary}`;
    }

    /**
     * Overrides the default execute method to use the report processing.
     * @param {object} data - The data to process, expected to be a financial report.
     * @returns {string} The sarcastic, rhyming report.
     */
    execute(data) {
        if (!data || typeof data.revenue !== 'number' || typeof data.expenses !== 'number' || typeof data.profit !== 'number') {
            return "Agent 047 requires a valid financial report to weave its tales!";
        }
        return this.processReport(data);
    }
}