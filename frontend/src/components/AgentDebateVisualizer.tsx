import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface AgentDebateVisualizerProps {
  agentCount?: number;
  debateIntensity?: number;
}

const AgentDebateVisualizer: React.FC<AgentDebateVisualizerProps> = ({ 
  agentCount = 100, 
  debateIntensity = 0.5 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(agentCount * 3);
    const colors = new Float32Array(agentCount * 3);

    for (let i = 0; i < agentCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5 + Math.random() * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      colors[i * 3] = 0.2 + Math.random() * 0.8;
      colors[i * 3 + 1] = 0.5;
      colors[i * 3 + 2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 15;

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.002 * (1 + debateIntensity);
      points.rotation.x += 0.001 * (1 + debateIntensity);
      
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < agentCount; i++) {
        pos[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01 * debateIntensity;
      }
      geometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, [agentCount, debateIntensity]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'radial-gradient(circle, #0a0a12 0%, #000000 100%)',
        zIndex: 0 
      }} 
    />
  );
};

export default AgentDebateVisualizer;