import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BrainCircuit, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

interface SwarmAdvice {
  id: string;
  perspective: string;
  recommendation: string;
  confidence: number;
}

interface WalletState {
  sovereignBalance: number;
  currency: string;
  lastSync: string;
}

export const UBCIWallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    sovereignBalance: 12450.82,
    currency: 'UBCI-CRED',
    lastSync: new Date().toISOString()
  });

  const [swarmAdvice, setSwarmAdvice] = useState<SwarmAdvice[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchSwarmData = async () => {
      setIsSyncing(true);
      // Simulated FAPI call to the Deterministic AI Banking Infrastructure
      await new Promise(resolve => setTimeout(resolve, 800));
      setSwarmAdvice([
        { id: '1', perspective: 'Aggressive Growth', recommendation: 'Allocate 40% to sovereign infrastructure nodes.', confidence: 0.88 },
        { id: '2', perspective: 'Risk Mitigation', recommendation: 'Maintain liquidity in cold-storage mTLS vaults.', confidence: 0.92 },
        { id: '3', perspective: 'Systemic Arbitrage', recommendation: 'Execute cross-chain swap on latency-free settlement.', confidence: 0.74 }
      ]);
      setIsSyncing(false);
    };

    fetchSwarmData();
  }, []);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen font-sans border border-slate-800 rounded-xl shadow-2xl">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400">UBCI Sovereign Terminal</h1>
          <p className="text-slate-500 text-sm">Deterministic Asset Management v1.0</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-light">{wallet.sovereignBalance.toLocaleString()}</div>
          <div className="text-emerald-600 text-xs uppercase tracking-widest">{wallet.currency}</div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {swarmAdvice.map((advice, index) => (
            <motion.div
              key={advice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900 p-5 rounded-lg border border-slate-800 hover:border-emerald-900 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3 text-emerald-500">
                <BrainCircuit size={18} />
                <span className="text-xs font-bold uppercase">{advice.perspective}</span>
              </div>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">{advice.recommendation}</p>
              <div className="flex justify-between items-center text-[10px] text-slate-600">
                <span>CONFIDENCE: {(advice.confidence * 100).toFixed(0)}%</span>
                <ShieldCheck size={14} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <footer className="mt-12 pt-6 border-t border-slate-800 flex justify-between items-center">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors text-xs"
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          SYNCING WITH 1,200 NODES
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-emerald-700">
            <TrendingUp size={14} />
            <span className="text-[10px]">SETTLEMENT: INSTANT</span>
          </div>
          <div className="flex items-center gap-1 text-amber-700">
            <AlertTriangle size={14} />
            <span className="text-[10px]">HUMAN ERROR: 0%</span>
          </div>
        </div>
      </footer>
    </div>
  );
};