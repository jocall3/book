import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { FAPIClient } from './services/fapi-client';
import { ParadoxProvider } from './context/ParadoxContext';
import { SovereignRouter } from './router/SovereignRouter';
import { SecurityLayer } from './components/SecurityLayer';

const AppStateContext = createContext<{
  isSynchronized: boolean;
  nodeLatency: number;
}>({ isSynchronized: false, nodeLatency: 0 });

export const App: React.FC = () => {
  const [fapi] = useState(() => new FAPIClient({
    endpoint: import.meta.env.VITE_SWARM_GATEWAY,
    mtlsEnabled: true,
    deterministicMode: true
  }));

  const [connectionState, setConnectionState] = useState({
    isSynchronized: false,
    nodeLatency: 0
  });

  useEffect(() => {
    const initializeSovereignLink = async () => {
      try {
        const status = await fapi.establishSecureHandshake();
        setConnectionState({
          isSynchronized: status.verified,
          nodeLatency: status.ms
        });
      } catch (err) {
        console.error('Sovereign Link Interrupted: Deterministic failure detected.', err);
      }
    };

    initializeSovereignLink();
  }, [fapi]);

  const contextValue = useMemo(() => ({
    ...connectionState,
    fapi
  }), [connectionState, fapi]);

  return (
    <AppStateContext.Provider value={contextValue}>
      <ParadoxProvider>
        <SecurityLayer>
          <main className="sovereign-root-container">
            <SovereignRouter />
          </main>
        </SecurityLayer>
      </ParadoxProvider>
    </AppStateContext.Provider>
  );
};

export default App;