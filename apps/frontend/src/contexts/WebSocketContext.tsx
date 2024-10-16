import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';
import {
  createRequestLatestPriceMessage,
  createRequestPredictionMessage,
  createRequestUserScoreMessage,
  isUpdatePriceMessage,
  isUpdateUserScoreMessage,
  isUpdatePredictionMessage,
  PredictionDirection,
} from '@my-org/shared';

// TODO: Replace when localstack is available
const websocketBaseUrl =
  import.meta.env.VITE_WEBSOCKET_API_ENDPOINT || 'wss://localhost:3001';

interface WebSocketState {
  btcPrice: number | null;
  score: number | null;
  direction: PredictionDirection | null;
  sendMessage: (message: string) => void;
  clearPrediction: () => void;
}

const initialState: WebSocketState = {
  btcPrice: null,
  score: null,
  direction: null,
  sendMessage: () => {},
  clearPrediction: () => {},
};

export const WebSocketContext = createContext<WebSocketState>(initialState);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [state, setState] = useState<WebSocketState>(initialState);

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connect = async () => {
      try {
        const session = await fetchAuthSession();
        const jwtToken = session.tokens?.accessToken.toString();
        if (!jwtToken) {
          throw new Error('JWT token not available. Please log in again.');
        }

        const websocketUrl = `${websocketBaseUrl}?Authorization=${encodeURIComponent(jwtToken)}`;
        ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
          const messages = [
            createRequestLatestPriceMessage(),
            createRequestUserScoreMessage(),
            createRequestPredictionMessage(),
          ].map((message) => JSON.stringify(message));

          messages.forEach((message) => {
            ws?.send(message);
          });

          setState((prevState) => ({
            ...prevState,
            sendMessage: (message: string) => {
              if (ws?.readyState === WebSocket.OPEN) {
                ws.send(message);
              }
            },
            clearPrediction: () => {
              setState((prevState) => ({
                ...prevState,
                direction: null,
              }));
            },
          }));
        };

        ws.onclose = () => {
          setTimeout(connect, 1000);
        };

        ws.onerror = () => {
          ws?.close();
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (isUpdatePriceMessage(message)) {
            setState((prevState) => ({
              ...prevState,
              btcPrice: message.price,
            }));
          } else if (isUpdateUserScoreMessage(message)) {
            setState((prevState) => ({ ...prevState, score: message.score }));
          } else if (isUpdatePredictionMessage(message)) {
            setState((prevState) => ({
              ...prevState,
              direction: message.direction,
            }));
          }
        };
      } catch {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }
    };

    connect();

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={state}>
      {children}
    </WebSocketContext.Provider>
  );
};
