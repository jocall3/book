import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface ConflictEvent {
  id: string;
  timestamp: number;
  payload: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ConflictStreamState {
  data: ConflictEvent[];
  isConnected: boolean;
  throughput: number;
}

export const useConflictStream = (endpoint: string) => {
  const [state, setState] = useState<ConflictStreamState>({
    data: [],
    isConnected: false,
    throughput: 0,
  });

  const socketRef = useRef<WebSocket | null>(null);
  const bufferRef = useRef<ConflictEvent[]>([]);
  const lastUpdateRef = useRef<number>(performance.now());
  const countRef = useRef<number>(0);

  const processBuffer = useCallback(() => {
    if (bufferRef.current.length === 0) return;

    const now = performance.now();
    const delta = (now - lastUpdateRef.current) / 1000;
    const currentThroughput = countRef.current / delta;

    setState((prev) => ({
      ...prev,
      data: [...bufferRef.current.slice(-1000)],
      throughput: currentThroughput,
    }));

    bufferRef.current = [];
    countRef.current = 0;
    lastUpdateRef.current = now;
  }, []);

  useEffect(() => {
    const ws = new WebSocket(endpoint);
    socketRef.current = ws;

    ws.onopen = () => setState((s) => ({ ...s, isConnected: true }));
    ws.onclose = () => setState((s) => ({ ...s, isConnected: false }));
    
    ws.onmessage = (event: MessageEvent) => {
      const rawData = JSON.parse(event.data);
      bufferRef.current.push(rawData);
      countRef.current++;
    };

    const interval = setInterval(processBuffer, 16); // ~60fps UI sync

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [endpoint, processBuffer]);

  return useMemo(() => ({
    ...state,
    sendResolution: (resolution: any) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'RESOLUTION', ...resolution }));
      }
    }
  }), [state]);
};