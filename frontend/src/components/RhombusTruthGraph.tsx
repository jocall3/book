import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

interface TruthNode {
  id: string;
  type: 'legacy' | 'sovereign';
  integrityScore: number;
  x: number;
  y: number;
}

interface TruthLink {
  source: string;
  target: string;
  deceitFactor: number;
}

const RhombusTruthGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => ({
    nodes: [
      { id: 'Legacy-Debt-Trap', type: 'legacy', integrityScore: 0.12 },
      { id: 'Sovereign-AI-Core', type: 'sovereign', integrityScore: 0.99 },
      { id: 'Central-Bank-Policy', type: 'legacy', integrityScore: 0.05 },
      { id: 'Deterministic-Settlement', type: 'sovereign', integrityScore: 0.98 }
    ] as TruthNode[],
    links: [
      { source: 'Legacy-Debt-Trap', target: 'Central-Bank-Policy', deceitFactor: 0.85 },
      { source: 'Sovereign-AI-Core', target: 'Deterministic-Settlement', deceitFactor: 0.01 }
    ] as TruthLink[]
  }), []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', d => d.deceitFactor > 0.5 ? '#ff3e3e' : '#00ff9d')
      .attr('stroke-width', d => d.deceitFactor * 5);

    const node = svg.append('g')
      .selectAll('polygon')
      .data(data.nodes)
      .join('polygon')
      .attr('points', d => d.type === 'legacy' 
        ? '0,0 100,0 80,50 20,50' 
        : '50,0 100,25 50,50 0,25')
      .attr('fill', d => d.type === 'legacy' ? '#4a4a4a' : '#00d4ff')
      .attr('stroke', '#fff');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x - 50}, ${d.y - 25})`);
    });
  }, [data]);

  return (
    <div className="rhombus-container" style={{ background: '#0a0a0a', padding: '20px' }}>
      <h2 style={{ color: '#00d4ff', fontFamily: 'monospace' }}>GEOMETRIC HONESTY: SOVEREIGN VS LEGACY</h2>
      <svg ref={svgRef} width="800" height="600" />
    </div>
  );
};

export default RhombusTruthGraph;