/**
 * AI Debate Visualizer
 * A JavaScript library for visualizing real-time debates between multiple AI entities.
 * This component uses D3.js for rendering a force-directed graph of the debate.
 *
 * @version 1.0.0
 * @author Project Architect
 *
 * Assumes D3.js (v6 or later) is available in the environment.
 */

class AIDebateVisualizer {
    /**
     * Initializes the debate visualizer.
     * @param {string} containerId The ID of the DOM element to render the visualization in.
     * @param {object} [options={}] Configuration options for the visualizer.
     */
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);

        if (!this.container) {
            throw new Error(`Container element with id "${containerId}" not found.`);
        }
        if (typeof d3 === 'undefined') {
            throw new Error('D3.js is not loaded. This library is a required dependency.');
        }

        this.nodes = [];
        this.links = [];
        this.nodeMap = new Map();

        this._applyOptions(options);
        this._initSVG();
        this._initSimulation();
        this._initMarkers();
        this._initTooltip();
    }

    /**
     * Applies user-defined options over defaults.
     * @param {object} options - The user-provided options.
     */
    _applyOptions(options) {
        const defaults = {
            colors: {
                background: '#0a0f1a',
                human: '#42a5f5',
                ai: '#7e57c2',
                argument: '#4db6ac',
                link: '#445172',
                rebuttal: '#ef5350',
                support: '#66bb6a',
                highlight: '#ffca28',
            },
            sizes: {
                participant: 15,
                argument: 6,
            },
            forces: {
                charge: -250,
                linkDistance: 70,
            },
            zoom: {
                min: 0.1,
                max: 8,
            }
        };
        this.options = { ...defaults, ...options };
    }

    /**
     * Sets up the main SVG container and groups.
     */
    _initSVG() {
        this.container.innerHTML = ''; // Clear previous content
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
            .on("dblclick.zoom", null); // Disable double-click zoom

        this.mainGroup = this.svg.append('g');
        this.linkGroup = this.mainGroup.append('g').attr('class', 'links');
        this.nodeGroup = this.mainGroup.append('g').attr('class', 'nodes');
    }

    /**
     * Defines SVG markers for arrowheads on links.
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
     * Initializes the D3 force simulation.
     */
    _initSimulation() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(this.options.forces.linkDistance))
            .force('charge', d3.forceManyBody().strength(this.options.forces.charge))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .on('tick', this._ticked.bind(this));
    }

    /**
     * Creates a tooltip element to show node details on hover.
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
     * Adds a participant to the debate.
     * @param {object} participantData - The participant's data.
     * @param {string} participantData.id - Unique ID for the participant.
     * @param {string} participantData.name - Display name.
     * @param {string} [participantData.type='ai'] - 'ai' or 'human'.
     */
    addParticipant(participantData) {
        if (this.nodeMap.has(participantData.id)) {
            console.warn(`Participant with ID ${participantData.id} already exists.`);
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
     * Posts a new argument to the debate.
     * @param {object} argumentData - The argument's data.
     * @param {string} argumentData.id - Unique ID for the argument.
     * @param {string} argumentData.participantId - ID of the participant making the argument.
     * @param {string} argumentData.text - The content of the argument.
     * @param {string|null} [argumentData.parentId=null] - ID of the argument being responded to.
     * @param {string} [argumentData.relation='argument'] - 'argument', 'rebuttal', or 'support'.
     */
    postArgument(argumentData) {
        if (!this.nodeMap.has(argumentData.participantId)) {
            console.error(`Participant with ID ${argumentData.participantId} not found.`);
            return;
        }
        if (this.nodeMap.has(argumentData.id)) {
            console.warn(`Argument with ID ${argumentData.id} already exists.`);
            return;
        }

        const newNode = {
            nodeType: 'argument',
            ...argumentData,
        };
        this.nodes.push(newNode);
        this.nodeMap.set(newNode.id, newNode);

        // Link from participant to the new argument
        this.links.push({
            source: argumentData.participantId,
            target: argumentData.id,
            type: 'authorship'
        });

        // Link from parent argument if it's a reply
        if (argumentData.parentId && this.nodeMap.has(argumentData.parentId)) {
            this.links.push({
                source: argumentData.id,
                target: argumentData.parentId,
                type: argumentData.relation || 'rebuttal'
            });
        }

        this._update();
    }

    /**
     * Updates the visual state of a node (participant or argument).
     * @param {string} nodeId - The ID of the node to update.
     * @param {object} state - The new state properties (e.g., { active: true }).
     */
    updateNodeState(nodeId, state) {
        const node = this.nodeMap.get(nodeId);
        if (node) {
            Object.assign(node, state);
            this._update();
        } else {
            console.warn(`Node with ID ${nodeId} not found for state update.`);
        }
    }

    /**
     * Updates the D3 simulation and re-renders the graph.
     */
    _update() {
        // Update links
        this.linkElements = this.linkGroup
            .selectAll('line')
            .data(this.links, d => `${d.source.id}-${d.target.id}`)
            .join('line')
            .style('stroke', d => {
                if (d.type === 'rebuttal') return this.options.colors.rebuttal;
                if (d.type === 'support') return this.options.colors.support;
                return this.options.colors.link;
            })
            .style('stroke-width', d => (d.type === 'authorship' ? 1 : 2))
            .attr('marker-end', d => {
                 if (d.type === 'rebuttal') return 'url(#rebuttal-arrow)';
                 if (d.type === 'support') return 'url(#support-arrow)';
                 return null;
            });

        // Update nodes
        this.nodeElements = this.nodeGroup
            .selectAll('g.node-group')
            .data(this.nodes, d => d.id)
            .join(
                enter => this._createNodeElements(enter),
                update => this._updateNodeElements(update),
                exit => exit.transition().duration(300).attr('opacity', 0).remove()
            );

        // Restart simulation with new data
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.links);
        this.simulation.alpha(0.3).restart();
    }

    /**
     * Creates new SVG elements for entering nodes.
     * @param {d3.Selection} enter - The D3 enter selection.
     */
    _createNodeElements(enter) {
        const nodeGroup = enter.append('g')
            .attr('class', 'node-group')
            .call(this._dragHandler());

        // Main circle for the node
        nodeGroup.append('circle')
            .attr('r', d => (d.nodeType === 'participant' ? this.options.sizes.participant : this.options.sizes.argument))
            .style('stroke', '#fff')
            .style('stroke-width', 1.5);

        // Label for participants
        nodeGroup.append('text')
            .text(d => (d.nodeType === 'participant' ? d.name : ''))
            .attr('x', d => this.options.sizes.participant + 5)
            .attr('y', 5)
            .style('fill', '#ccc')
            .style('font-family', 'sans-serif')
            .style('font-size', '12px')
            .style('pointer-events', 'none');

        // Apply initial styles and event handlers
        this._updateNodeElements(nodeGroup);

        return nodeGroup;
    }

    /**
     * Updates attributes of existing SVG elements for nodes.
     * @param {d3.Selection} update - The D3 update selection.
     */
    _updateNodeElements(update) {
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
            
        update
            .on('mouseover', (event, d) => {
                this.tooltip.style('visibility', 'visible')
                           .html(d.nodeType === 'participant' ? `<b>${d.name}</b><br/>Type: ${d.type}` : `<b>Argument:</b><br/>${d.text}`);
            })
            .on('mousemove', (event) => {
                this.tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', () => {
                this.tooltip.style('visibility', 'hidden');
            });
    }

    /**
     * The 'tick' function called by D3 on each simulation step.
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
     * Creates a D3 drag handler for nodes.
     */
    _dragHandler() {
        const dragstarted = (event, d) => {
            if (!event.active) this.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragended = (event, d) => {
            if (!event.active) this.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        };

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
    
    /**
     * Cleans up the visualizer, removing SVG and event listeners.
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
     * Resizes the visualization to fit its container. Should be called on window resize.
     */
    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.svg.attr('width', this.width).attr('height', this.height);
        this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
        this.simulation.alpha(0.3).restart();
    }
}
