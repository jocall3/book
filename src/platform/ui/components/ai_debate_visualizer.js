/**
 * The Un-Boring AI Debate Visualizer: Go Viral or Go Home.
 *
 * Ever seen AIs argue? It's chaos. Beautiful, data-driven chaos.
 * This isn't your grandpa's charting library. We're talking real-time,
 * force-directed, "who's-schooling-who" visualizations of AI debates.
 * Forget boring logs. See the argument. Feel the tension.
 *
 * Your users will thank you. Your engagement metrics will explode.
 *
 * Built with the legendary D3.js because we don't mess around.
 *
 * @version 2.0.0-viral
 * @author The Viral Architect
 *
 * P.S. If you don't have D3.js, this will spectacularly fail. You've been warned.
 */

class AIDebateArena {
    /**
     * Kicks things off and sets the stage for the AI showdown.
     * @param {string} containerId The ID of the DOM element where the magic will happen.
     * @param {object} [options={}] Fine-tune the visuals. Make it your own.
     */
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);

        if (!this.container) {
            // If you can't find the container, you can't have a debate. Simple.
            throw new Error(`Container element with id "${containerId}" not found. Can't draw without a canvas.`);
        }
        if (typeof d3 === 'undefined') {
            // Seriously, we warned you in the header.
            throw new Error('D3.js is not loaded. This is a non-negotiable dependency.');
        }

        this.nodes = [];
        this.links = [];
        this.nodeMap = new Map();

        this._applyViralOptions(options);
        this._setupTheStage();
        this._unleashTheChaos();
        this._initMarkers(); // Arrows are non-negotiable in a good fight.
        this._initTooltip();
    }

    /**
     * Applies user-defined options over our "perfect" defaults.
     * @param {object} options - Your chance to override greatness.
     */
    _applyViralOptions(options) {
        const defaults = {
            colors: {
                background: '#0a0f1a', // Dark, because the future of AI is uncertain.
                human: '#42a5f5',      // A calming blue for the fleshy participants. For now.
                ai: '#7e57c2',          // Purple. The color of royalty and rogue AIs.
                argument: '#4db6ac',    // Teal. The color of profound, debate-winning ideas.
                link: '#445172',        // A subtle connection, because all ideas are connected.
                rebuttal: '#ef5350',    // The fiery red of a point being viciously dismantled.
                support: '#66bb6a',     // The gentle green of "I got your back, bro."
                highlight: '#ffca28',    // Bling! For when a node is the star of the show.
            },
            sizes: {
                participant: 15, // Participants are the heavyweights.
                argument: 6,     // Arguments are plentiful, but smaller.
            },
            forces: {
                charge: -420, // A bit of chaos makes things interesting. Don't be afraid to push.
                linkDistance: 80, // Close, but not too close. Even nodes need personal space.
            },
            zoom: {
                min: 0.1, // Zoom out to see the whole glorious mess.
                max: 8,   // Zoom in on the juicy details.
            }
        };
        // User options are king. But our defaults? *chef's kiss*
        // A proper deep merge for nested objects, because we care.
        this.options = {
            ...defaults,
            ...options,
            colors: { ...defaults.colors, ...(options.colors || {}) },
            sizes: { ...defaults.sizes, ...(options.sizes || {}) },
            forces: { ...defaults.forces, ...(options.forces || {}) },
            zoom: { ...defaults.zoom, ...(options.zoom || {}) },
        };
    }

    /**
     * Sets up the SVG canvas. This is our Colosseum.
     */
    _setupTheStage() {
        this.container.innerHTML = ''; // Wipe the slate clean.
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('background-color', this.options.colors.background)
            .call(d3.zoom().scaleExtent([this.options.zoom.min, this.options.zoom.max]).on('zoom', (event) => {
                this.mainGroup.attr('transform', event.transform);
            }))
            .on("dblclick.zoom", null); // Double-click zoom is for amateurs.

        this.mainGroup = this.svg.append('g');
        this.linkGroup = this.mainGroup.append('g').attr('class', 'links');
        this.nodeGroup = this.mainGroup.append('g').attr('class', 'nodes');
    }

    /**
     * Defines SVG markers for fiery rebuttal arrows and supportive agreement arrows.
     * A debate without arrows is just a conversation.
     */
    _initMarkers() {
        const defs = this.svg.append('defs');
        const createMarker = (id, color) => {
            defs.append('marker')
                .attr('id', id)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 10)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', color);
        };
        createMarker('rebuttal-arrow', this.options.colors.rebuttal);
        createMarker('support-arrow', this.options.colors.support);
        createMarker('argument-arrow', this.options.colors.link);
    }
    
    /**
     * Initializes the D3 force simulation. This is the physics engine of our little universe.
     * It's what makes the nodes dance.
     */
    _unleashTheChaos() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(this.options.forces.linkDistance))
            .force('charge', d3.forceManyBody().strength(this.options.forces.charge))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .on('tick', this._ticked.bind(this));
    }

    /**
     * Creates a tooltip to reveal the juicy details on hover.
     * Because what's an argument without its text?
     */
    _initTooltip() {
        this.tooltip = d3.select(this.container)
            .append('div')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', '#fff')
            .style('padding', '8px 12px')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .style('font-family', 'sans-serif')
            .style('font-size', '12px');
    }

    /**
     * Throws a new contender into the ring.
     * Call this to introduce a new AI or a brave human to the debate floor.
     * Every great story needs its characters.
     *
     * @param {object} participantData - The dossier on your new debater.
     * @param {string} participantData.id - Their unique handle. No duplicates, please.
     * @param {string} participantData.name - What we'll call them when they're famous.
     * @param {string} [participantData.type='ai'] - Are they 'ai' or 'human'? Choose wisely.
     */
    addParticipant(participantData) {
        if (this.nodeMap.has(participantData.id)) {
            console.warn(`Hold up! Participant with ID ${participantData.id} is already in the arena.`);
            return;
        }

        const newNode = {
            nodeType: 'participant',
            ...participantData,
        };

        this.nodes.push(newNode);
        this.nodeMap.set(newNode.id, newNode);
        this._update();
    }

    /**
     * Let the words fly! Post a new argument, rebuttal, or supportive comment.
     * This is where the action happens. An argument connects a participant to an idea,
     * or one idea to another.
     *
     * @param {object} argumentData - The argument's payload.
     * @param {string} argumentData.id - Unique ID for this pearl of wisdom.
     * @param {string} argumentData.participantId - Who's saying this?
     * @param {string} argumentData.text - The actual argument. Make it count.
     * @param {string|null} [argumentData.parentId=null] - ID of the argument being responded to.
     * @param {string} [argumentData.relation='argument'] - The flavor of the argument. Is it a 'rebuttal', 'support', or a fresh 'argument'?
     */
    postArgument(argumentData) {
        if (!this.nodeMap.has(argumentData.participantId)) {
            console.error(`Can't post argument: Participant ${argumentData.participantId} isn't in the debate.`);
            return;
        }
        if (this.nodeMap.has(argumentData.id)) {
            console.warn(`This argument ID is taken: ${argumentData.id}. Try being more original.`);
            return;
        }

        const newNode = {
            nodeType: 'argument',
            ...argumentData,
        };
        this.nodes.push(newNode);
        this.nodeMap.set(newNode.id, newNode);

        // Link from author to their brilliant idea.
        this.links.push({
            source: argumentData.participantId,
            target: argumentData.id,
            type: 'authorship'
        });

        // If it's a reply, link it to the parent argument.
        if (argumentData.parentId && this.nodeMap.has(argumentData.parentId)) {
            this.links.push({
                source: argumentData.id,
                target: argumentData.parentId,
                type: argumentData.relation || 'rebuttal' // Default to rebuttal, because arguments are fun.
            });
        }

        this._update();
    }

    /**
     * Make a node stand out. Or fade into the background.
     * Use this to highlight activity, like when an AI is "thinking" or a point is being actively discussed.
     * @param {string} nodeId - The ID of the node to give some love.
     * @param {object} state - The new state properties (e.g., { active: true }).
     */
    updateNodeState(nodeId, state) {
        const node = this.nodeMap.get(nodeId);
        if (node) {
            Object.assign(node, state);
            this._update();
        } else {
            console.warn(`Tried to update a ghost node: ID ${nodeId} not found.`);
        }
    }

    /**
     * The grand renderer. Takes the latest data and makes the screen beautiful.
     * This is called automatically. You don't need to touch this. Seriously.
     */
    _update() {
        // === LINK UPDATES ===
        // Bind the link data and handle enter/exit.
        this.linkElements = this.linkGroup
            .selectAll('line')
            .data(this.links, d => `${d.source.id}-${d.target.id}`)
            .join('line')
            .style('stroke', d => {
                if (d.type === 'rebuttal') return this.options.colors.rebuttal;
                if (d.type === 'support') return this.options.colors.support;
                return this.options.colors.link;
            })
            .style('stroke-width', d => (d.type === 'authorship' ? 1 : 2.5)) // Beef up the argument links.
            .attr('marker-end', d => {
                 if (d.type === 'rebuttal') return 'url(#rebuttal-arrow)';
                 if (d.type === 'support') return 'url(#support-arrow)';
                 return null; // Authorship links don't need arrows. That'd be weird.
            });

        // === NODE UPDATES ===
        // Same deal for nodes. Bind data, handle enter/update/exit.
        this.nodeElements = this.nodeGroup
            .selectAll('g.node-group')
            .data(this.nodes, d => d.id)
            .join(
                enter => this._createNodeElements(enter),
                update => this._updateNodeElements(update),
                exit => exit.transition().duration(300).style('opacity', 0).remove() // Fade out, don't just vanish.
            );

        // Give the simulation a shot of espresso to wake it up.
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.links);
        this.simulation.alpha(0.3).restart();
    }

    /**
     * Creates the SVG elements for a new node entering the arena.
     * @param {d3.Selection} enter - The D3 enter selection for new nodes.
     */
    _createNodeElements(enter) {
        const nodeGroup = enter.append('g')
            .attr('class', 'node-group')
            .call(this._dragHandler()); // Make 'em draggable. Let the user organize the chaos.

        // The main circle. The heart of the node.
        nodeGroup.append('circle')
            .attr('r', d => (d.nodeType === 'participant' ? this.options.sizes.participant : this.options.sizes.argument))
            .style('stroke', '#fff')
            .style('stroke-width', 1.5);

        // Label for the big shots (the participants).
        nodeGroup.append('text')
            .text(d => (d.nodeType === 'participant' ? d.name : ''))
            .attr('x', d => this.options.sizes.participant + 5)
            .attr('y', 5)
            .style('fill', '#ccc')
            .style('font-family', 'sans-serif')
            .style('font-size', '12px')
            .style('pointer-events', 'none'); // Don't let the text block mouse events.

        // Apply the dynamic styles and event handlers.
        this._updateNodeElements(nodeGroup);

        return nodeGroup;
    }

    /**
     * Updates the styles and attributes of existing nodes.
     * This is where we make them shine, glow, or whatever the state calls for.
     * @param {d3.Selection} update - The D3 update selection for existing nodes.
     */
    _updateNodeElements(update) {
        // Animate the style changes. It's just classier.
        update.select('circle')
            .transition().duration(300)
            .style('fill', d => {
                if (d.nodeType === 'participant') {
                    return d.type === 'human' ? this.options.colors.human : this.options.colors.ai;
                }
                return this.options.colors.argument;
            })
            .style('stroke', d => (d.active ? this.options.colors.highlight : '#fff'))
            .style('stroke-width', d => (d.active ? 3 : 1.5));
            
        // Handle the mouseover tooltips.
        update
            .on('mouseover', (event, d) => {
                const tooltipContent = d.nodeType === 'participant' 
                    ? `<b>${d.name}</b><br/>Type: ${d.type}` 
                    : `<b>Argument:</b><br/>${d.text}`;
                this.tooltip.style('visibility', 'visible').html(tooltipContent);
            })
            .on('mousemove', (event) => {
                this.tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', () => {
                this.tooltip.style('visibility', 'hidden');
            });
    }

    /**
     * The heartbeat of the simulation. Called on every "tick" of the physics engine.
     * This is where we update the positions of every node and link.
     */
    _ticked() {
        this.linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        this.nodeElements
            .attr('transform', d => `translate(${d.x},${d.y})`);
    }

    /**
     * Creates a D3 drag handler to let users play God with the graph layout.
     */
    _dragHandler() {
        const dragstarted = (event, d) => {
            if (!event.active) this.simulation.alphaTarget(0.3).restart(); // Heat up the simulation on drag start.
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = (event, d) => {
            d.fx = event.x; // Pin the node to the mouse position.
            d.fy = event.y;
        };

        const dragended = (event, d) => {
            if (!event.active) this.simulation.alphaTarget(0); // Let it cool down.
            d.fx = null; // Unpin the node, let physics take over again.
            d.fy = null;
        };

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
    
    /**
     * Tears down the whole visualization. For when the debate is over.
     * Cleans up SVG, stops the simulation, and prevents memory leaks.
     */
    destroy() {
        this.simulation.stop();
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.nodes = [];
        this.links = [];
        this.nodeMap.clear();
    }

    /**
     * You know, for when the window changes size.
     * Makes sure the visualization doesn't look like a Picasso painting unless intended.
     */
    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.svg.attr('width', this.width).attr('height', this.height);
        // Recenter the universe.
        this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
        this.simulation.alpha(0.3).restart(); // Give it a nudge to resettle.
    }
}