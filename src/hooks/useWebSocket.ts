import { useEffect, useRef, useCallback, useState } from "react";

type WSStatus = "connecting" | "connected" | "disconnected" | "error";

interface FuzzyPayload {
  inputs: Record<string, number>;
  crossfader: number;
  leftPlaying: boolean;
  rightPlaying: boolean;
  knobs: Record<string, number>;
  activePads?: number[];
}

interface UseWebSocketReturn {
  status: WSStatus;
  sendInputs: (payload: FuzzyPayload) => void;
  audioUrl: string | null;
  lastMessage: unknown;
}

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws";

export function useWebSocket(): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>("disconnected");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    setStatus("connecting");

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);

        // If the Flask server sends back an audio URL or base64 audio
        if (data.audioUrl) setAudioUrl(data.audioUrl);
        if (data.audio_b64) {
          const blob = new Blob(
            [Uint8Array.from(atob(data.audio_b64), (c) => c.charCodeAt(0))],
            { type: "audio/wav" }
          );
          setAudioUrl(URL.createObjectURL(blob));
        }
      } catch {
        // non-JSON message
        setLastMessage(event.data);
      }
    };

    ws.onerror = () => setStatus("error");

    ws.onclose = () => {
      setStatus("disconnected");
      // Auto-reconnect after 3s
      reconnectTimer.current = setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendInputs = useCallback((payload: FuzzyPayload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "fuzzy_update", ...payload }));
    }
  }, []);

  return { status, sendInputs, audioUrl, lastMessage };
}
