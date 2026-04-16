import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TruthOmeterProps {
  inputEntropy: number;
  onTruthExtracted: (truth: string) => void;
}

export const TruthOmeter: React.FC<TruthOmeterProps> = ({ inputEntropy, onTruthExtracted }) => {
  const [energy, setEnergy] = useState(100);
  const [isRefining, setIsRefining] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('INITIALIZING_SINGULARITY');

  useEffect(() => {
    if (inputEntropy > 0 && energy > 0) {
      setIsRefining(true);
      const interval = setInterval(() => {
        setEnergy((prev) => {
          const next = prev - (inputEntropy * 0.5);
          return next <= 0 ? 0 : next;
        });
      }, 100);

      if (energy < 70 && energy > 40) setCurrentPhase('STRIPPING_LEGACY_BIAS');
      if (energy < 40 && energy > 10) setCurrentPhase('DETERMINISTIC_COMPRESSION');
      if (energy <= 0) {
        clearInterval(interval);
        setIsRefining(false);
        setCurrentPhase('TRUTH_COMMITTED_TO_LEDGER');
        onTruthExtracted('MATHEMATICAL_PURITY_ACHIEVED');
      }

      return () => clearInterval(interval);
    }
  }, [inputEntropy, energy, onTruthExtracted]);

  const color = useMemo(() => {
    if (energy > 66) return '#3b82f6';
    if (energy > 33) return '#a855f7';
    return '#ef4444';
  }, [energy]);

  return (
    <div className="relative w-full h-64 bg-black border border-zinc-800 p-6 flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 to-transparent" />
      
      <div className="z-10">
        <h2 className="text-zinc-500 text-xs tracking-widest uppercase">Intellectual Juicing Engine</h2>
        <div className="text-white font-mono text-2xl mt-2">{currentPhase}</div>
      </div>

      <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden z-10">
        <motion.div 
          className="h-full transition-all duration-300"
          style={{ width: `${energy}%`, backgroundColor: color }}
          initial={{ width: '100%' }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-zinc-600 z-10">
        <span>ENTROPY: {inputEntropy.toFixed(4)}</span>
        <span>STATUS: {isRefining ? 'REFINING' : 'STABLE'}</span>
      </div>

      <AnimatePresence>
        {energy === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 z-20"
          >
            <div className="text-emerald-500 font-bold tracking-tighter text-xl">
              [LEDGER_COMMIT_SUCCESS]
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};