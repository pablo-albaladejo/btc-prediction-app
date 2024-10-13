import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
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
  prediction: PredictionDirection | null;
  sendMessage: (message: string) => void;
  clearPrediction: () => void;
}

const initialState: WebSocketState = {
  btcPrice: null,
  score: null,
  prediction: null,
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
        const { userId } = await getCurrentUser();
        const websocketUrl = `${websocketBaseUrl}?userUUID=${encodeURIComponent(userId)}`;
        ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
          console.log('WebSocket connected');

          const messages = [
            createRequestLatestPriceMessage(),
            createRequestUserScoreMessage({ userUUID: userId }),
            createRequestPredictionMessage({ userUUID: userId }),
          ].map((message) => JSON.stringify(message));

          messages.forEach((message) => {
            ws?.send(message);
          });

          setState((prevState) => ({
            ...prevState,
            sendMessage: (message: string) => {
              if (ws?.readyState === WebSocket.OPEN) {
                console.log('Sending message:', message);
                ws.send(message);
              }
            },
            clearPrediction: () => {
              setState((prevState) => ({
                ...prevState,
                prediction: null,
              }));
            },
          }));
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected', event);
          setTimeout(connect, 1000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws?.close();
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
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
              prediction: message.prediction,
            }));
          }
        };
      } catch (error) {
        console.error('Failed to connect:', error);
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
