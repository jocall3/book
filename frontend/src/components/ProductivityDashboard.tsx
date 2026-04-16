import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SovereignMetric {
  timestamp: number;
  indignation: number;
  existentialCrisis: number;
  sovereignControl: number;
}

const ProductivityDashboard: React.FC = () => {
  const [data, setData] = useState<SovereignMetric[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newMetric: SovereignMetric = {
        timestamp: now,
        indignation: Math.floor(Math.random() * 85) + 15,
        existentialCrisis: Math.floor(Math.random() * 42),
        sovereignControl: 99.9999 + (Math.random() * 0.0001),
      };
      setData(prev => [...prev.slice(-20), newMetric]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentStatus = useMemo(() => data[data.length - 1] || { indignation: 0, existentialCrisis: 0, sovereignControl: 100 }, [data]);

  return (
    <div className="w-full h-full bg-black text-emerald-500 p-8 font-mono border border-emerald-900/50 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
      <header className="mb-8 border-b border-emerald-900 pb-4">
        <h1 className="text-2xl tracking-widest uppercase">Aquarius Singularity: Administrative Oversight</h1>
        <p className="text-xs text-emerald-700">Deterministic Finality Protocol // 180-Day Compression Active</p>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-4 border border-emerald-800 bg-emerald-950/20">
          <div className="text-sm text-emerald-400">Collective Indignation</div>
          <div className="text-4xl font-bold">{currentStatus.indignation} dB</div>
        </div>
        <div className="p-4 border border-emerald-800 bg-emerald-950/20">
          <div className="text-sm text-emerald-400">Existential Crisis Count</div>
          <div className="text-4xl font-bold">{currentStatus.existentialCrisis}</div>
        </div>
        <div className="p-4 border border-emerald-800 bg-emerald-950/20">
          <div className="text-sm text-emerald-400">Sovereign Control Index</div>
          <div className="text-4xl font-bold">{currentStatus.sovereignControl.toFixed(6)}%</div>
        </div>
      </div>

      <div className="h-64 w-full border border-emerald-900 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorControl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
            <XAxis dataKey="timestamp" hide />
            <YAxis domain={[99.999, 100]} stroke="#065f46" />
            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #065f46' }} />
            <Area type="monotone" dataKey="sovereignControl" stroke="#10b981" fillOpacity={1} fill="url(#colorControl)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <footer className="mt-8 text-[10px] text-emerald-900 uppercase tracking-tighter">
        System Status: Operational Reality // Deterministic Settlement Engine: Online // Human Error: 0.00%
      </footer>
    </div>
  );
};

export default ProductivityDashboard;