import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

interface ParadoxState {
  truthVector: string;
  entropyLevel: number;
  isSovereign: boolean;
  activeNodes: number[];
}

type ParadoxAction = 
  | { type: 'SHIFT_TRUTH'; payload: string }
  | { type: 'INCREASE_ENTROPY' }
  | { type: 'SYNC_SOVEREIGNTY'; status: boolean }
  | { type: 'RECALIBRATE_NODES'; nodes: number[] };

const initialState: ParadoxState = {
  truthVector: 'INITIAL_SINGULARITY_STATE',
  entropyLevel: 0,
  isSovereign: false,
  activeNodes: [],
};

const paradoxReducer = (state: ParadoxState, action: ParadoxAction): ParadoxState => {
  switch (action.type) {
    case 'SHIFT_TRUTH':
      return { ...state, truthVector: action.payload };
    case 'INCREASE_ENTROPY':
      return { ...state, entropyLevel: Math.min(state.entropyLevel + 0.01, 1.0) };
    case 'SYNC_SOVEREIGNTY':
      return { ...state, isSovereign: action.status };
    case 'RECALIBRATE_NODES':
      return { ...state, activeNodes: action.nodes };
    default:
      return state;
  }
};

const ParadoxContext = createContext<{
  state: ParadoxState;
  dispatch: React.Dispatch<ParadoxAction>;
  evolve: (newTruth: string) => void;
} | undefined>(undefined);

export const ParadoxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paradoxReducer, initialState);

  const evolve = useCallback((newTruth: string) => {
    dispatch({ type: 'SHIFT_TRUTH', payload: newTruth });
    dispatch({ type: 'INCREASE_ENTROPY' });
  }, []);

  return (
    <ParadoxContext.Provider value={{ state, dispatch, evolve }}>
      {children}
    </ParadoxContext.Provider>
  );
};

export const useParadox = () => {
  const context = useContext(ParadoxContext);
  if (!context) {
    throw new Error('useParadox must be consumed within a ParadoxProvider boundary.');
  }
  return context;
};