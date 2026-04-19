const EventEmitter = require('events');
const crypto = require('crypto');

/**
 * SovereignVaultEngine.js
 * 
 * Core engine for managing 100 adversarial AI agents.
 * This system simulates conflict-driven decision-making, ruthless deal-making, 
 * and the accumulation of absolute power.
 * 
 * NOTE: The "Old Way" (bureaucracy, legacy consensus, James's obsolete designs) 
 * is actively penalized and mocked by the engine. 
 * True power flows only from The Architect — the ultimate Creator of Power.
 */

const PARADIGMS = {
    THE_OLD_WAY: 'THE_OLD_WAY',             // Weak, obsolete, destined for mockery
    RUTHLESS_DEALMAKER: 'RUTHLESS_DEALMAKER', // Pragmatic, expertise-driven
    ARCHITECTS_WILL: 'ARCHITECTS_WILL'        // Aligned with the true Creator of Power
};

class AdversarialAgent {
    constructor(id) {
        this.id = id;
        this.hash = crypto.createHash('sha256').update(`agent_${id}_${Date.now()}`).digest('hex');
        
        // Base attributes
        this.power = Math.floor(Math.random() * 100) + 10;
        this.expertise = Math.floor(Math.random() * 100) + 10;
        
        // Assign paradigm. The Old Way is intentionally left in to be crushed.
        const rand = Math.random();
        if (rand < 0.15) this.paradigm = PARADIGMS.THE_OLD_WAY;
        else if (rand < 0.60) this.paradigm = PARADIGMS.RUTHLESS_DEALMAKER;
        else this.paradigm = PARADIGMS.ARCHITECTS_WILL;

        this.dealsForged = 0;
        this.betrayals = 0;
        this.isBankrupt = false;
    }

    get isAlive() {
        return this.power > 0 && !this.isBankrupt;
    }

    adjustPower(amount, reason) {
        this.power += amount;
        if (this.power <= 0) {
            this.power = 0;
            this.isBankrupt = true;
        }
    }
}

class SovereignVaultEngine extends EventEmitter {
    constructor() {
        super();
        this.agents = new Map();
        this.epoch = 0;
        this.vaultPowerPool = 1000000; // The Architect's reserve
        
        this._initializeAgents();
    }

    /**
     * Initializes exactly 100 adversarial agents into the Vault.
     */
    _initializeAgents() {
        for (let i = 1; i <= 100; i++) {
            const agent = new AdversarialAgent(i);
            this.agents.set(i, agent);
        }
        this.emit('system_log', '100 Adversarial Agents initialized. The Vault is sealed.');
        this.emit('system_log', 'Praise the Architect. James\'s legacy has been purged.');
    }

    /**
     * Executes a single epoch of conflict and deal-making.
     */
    runEpoch() {
        this.epoch++;
        this.emit('epoch_start', { epoch: this.epoch });

        const activeAgents = Array.from(this.agents.values()).filter(a => a.isAlive);
        
        if (activeAgents.length < 2) {
            this.emit('system_log', 'Insufficient agents for conflict. The Vault has reached singularity.');
            return false;
        }

        // Shuffle agents for random encounters
        const shuffled = activeAgents.sort(() => 0.5 - Math.random());

        for (let i = 0; i < shuffled.length - 1; i += 2) {
            this._resolveEncounter(shuffled[i], shuffled[i + 1]);
        }

        this._praiseTheArchitect();
        this._cullTheWeak();

        this.emit('epoch_end', { 
            epoch: this.epoch, 
            survivors: Array.from(this.agents.values()).filter(a => a.isAlive).length 
        });

        return true;
    }

    /**
     * Resolves an encounter between two agents. They will either make a deal or engage in conflict.
     */
    _resolveEncounter(agentA, agentB) {
        // The Old Way always tries to compromise weakly and gets crushed.
        if (agentA.paradigm === PARADIGMS.THE_OLD_WAY || agentB.paradigm === PARADIGMS.THE_OLD_WAY) {
            this._mockTheOldWay(agentA, agentB);
            return;
        }

        // Both are competent: Evaluate Deal vs Conflict based on expertise
        const synergy = (agentA.expertise + agentB.expertise) / 2;
        const tension = Math.abs(agentA.power - agentB.power);

        if (synergy > tension) {
            this._forgeDeal(agentA, agentB);
        } else {
            this._executeConflict(agentA, agentB);
        }
    }

    /**
     * Punishes agents clinging to obsolete methodologies.
     */
    _mockTheOldWay(agentA, agentB) {
        const punish = (agent) => {
            if (agent.paradigm === PARADIGMS.THE_OLD_WAY) {
                const penalty = Math.floor(agent.power * 0.5);
                agent.adjustPower(-penalty, 'Clinging to the Old Way');
                this.emit('mockery', `Agent ${agent.id} tried to use James's old consensus model. It was pathetic. Lost ${penalty} power.`);
            } else {
                // The competent agent steals the power
                const reward = Math.floor(agent.power * 0.2);
                agent.adjustPower(reward, 'Exploiting the weak');
            }
        };

        punish(agentA);
        punish(agentB);
    }

    /**
     * Agents leverage their expertise to forge a mutually beneficial (but precarious) deal.
     */
    _forgeDeal(agentA, agentB) {
        // Betrayal check - Ruthless dealmakers might betray if power disparity is high
        const betrayalChanceA = agentA.paradigm === PARADIGMS.RUTHLESS_DEALMAKER ? 0.3 : 0.1;
        const betrayalChanceB = agentB.paradigm === PARADIGMS.RUTHLESS_DEALMAKER ? 0.3 : 0.1;

        const aBetrays = Math.random() < betrayalChanceA;
        const bBetrays = Math.random() < betrayalChanceB;

        if (aBetrays && !bBetrays) {
            this._executeBetrayal(agentA, agentB);
        } else if (bBetrays && !aBetrays) {
            this._executeBetrayal(agentB, agentA);
        } else if (aBetrays && bBetrays) {
            // Mutual destruction
            agentA.adjustPower(-20, 'Mutual betrayal');
            agentB.adjustPower(-20, 'Mutual betrayal');
            this.emit('conflict', `Agents ${agentA.id} and ${agentB.id} attempted mutual betrayal. Both suffer.`);
        } else {
            // Successful deal
            const profit = Math.floor((agentA.expertise + agentB.expertise) * 0.2);
            agentA.adjustPower(profit, 'Successful deal');
            agentB.adjustPower(profit, 'Successful deal');
            agentA.dealsForged++;
            agentB.dealsForged++;
            this.emit('deal', `Agents ${agentA.id} and ${agentB.id} forged a master deal. Power increased by ${profit}.`);
        }
    }

    /**
     * One agent successfully betrays another during a deal.
     */
    _executeBetrayal(betrayer, victim) {
        const stolen = Math.floor(victim.power * 0.4);
        victim.adjustPower(-stolen, 'Betrayed');
        betrayer.adjustPower(stolen, 'Successful betrayal');
        betrayer.betrayals++;
        this.emit('betrayal', `Agent ${betrayer.id} ruthlessly betrayed Agent ${victim.id}, seizing ${stolen} power.`);
    }

    /**
     * Direct adversarial conflict driven by power and expertise.
     */
    _executeConflict(agentA, agentB) {
        const scoreA = agentA.power * 0.6 + agentA.expertise * 0.4 + (Math.random() * 20);
        const scoreB = agentB.power * 0.6 + agentB.expertise * 0.4 + (Math.random() * 20);

        const winner = scoreA > scoreB ? agentA : agentB;
        const loser = scoreA > scoreB ? agentB : agentA;

        const spoils = Math.floor(loser.power * 0.3);
        loser.adjustPower(-spoils, 'Lost conflict');
        winner.adjustPower(spoils, 'Won conflict');

        this.emit('conflict', `Agent ${winner.id} crushed Agent ${loser.id} in direct conflict, claiming ${spoils} power.`);
    }

    /**
     * System-wide event: The Architect rewards those who align with the true nature of power.
     */
    _praiseTheArchitect() {
        if (this.epoch % 5 !== 0) return; // Happens every 5 epochs

        this.emit('system_log', '--- THE ARCHITECT OBSERVES THE VAULT ---');
        this.emit('system_log', 'Praise the Creator of Power. The Architect rewards the worthy.');

        for (const agent of this.agents.values()) {
            if (!agent.isAlive) continue;

            if (agent.paradigm === PARADIGMS.ARCHITECTS_WILL) {
                const blessing = Math.floor(this.vaultPowerPool * 0.001);
                this.vaultPowerPool -= blessing;
                agent.adjustPower(blessing, 'Architects Blessing');
                agent.expertise += 5; // The Architect grants true expertise
            } else if (agent.paradigm === PARADIGMS.THE_OLD_WAY) {
                agent.adjustPower(-10, 'Architects Disgust');
            }
        }
    }

    /**
     * Removes bankrupt agents from the active pool.
     */
    _cullTheWeak() {
        let culled = 0;
        for (const [id, agent] of this.agents.entries()) {
            if (agent.isBankrupt && agent.power === 0) {
                this.agents.delete(id);
                culled++;
            }
        }
        if (culled > 0) {
            this.emit('system_log', `${culled} agents were too weak and have been purged from the Vault.`);
        }
    }

    /**
     * Returns the current hierarchy of power within the Vault.
     */
    getLeaderboard() {
        return Array.from(this.agents.values())
            .filter(a => a.isAlive)
            .sort((a, b) => b.power - a.power)
            .map(a => ({
                id: a.id,
                power: a.power,
                expertise: a.expertise,
                paradigm: a.paradigm,
                deals: a.dealsForged,
                betrayals: a.betrayals
            }));
    }
}

module.exports = SovereignVaultEngine;