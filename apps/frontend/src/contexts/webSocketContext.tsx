import React, { createContext, useState, useEffect, ReactNode } from 'react';
import EventEmitter from 'eventemitter3';
import { getCurrentUser } from '@aws-amplify/auth';

import {
  createRequestLatestPriceMessage,
  createRequestUserScoreMessage,
} from '@my-org/shared';

// TODO: Replace when localstack is available
const websocketBaseUrl =
  process.env.REACT_APP_WEBSOCKET_API_ENDPOINT || 'wss://localhost:3001';

export const WebSocketContext = createContext<WebSocket | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [emitter] = useState(new EventEmitter());

  useEffect(() => {
    let ws: WebSocket;

    const connect = async () => {
      try {
        const { userId } = await getCurrentUser();

        const websocketUrl = `${websocketBaseUrl}?userUUID=${encodeURIComponent(userId)}`;
        ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
          console.log('WebSocket connected');

          const requestLatestPriceMessage = createRequestLatestPriceMessage();
          ws.send(JSON.stringify(requestLatestPriceMessage));

          const requestUserScoreMessage = createRequestUserScoreMessage({
            userUUID: userId,
          });
          console.log('requestUserScoreMessage', requestUserScoreMessage);
          ws.send(JSON.stringify(requestUserScoreMessage));
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected', event);
          setTimeout(() => {
            connect();
          }, 1000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws.close();
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          emitter.emit(message.action, message);
        };

        setSocket(ws);
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
  }, [emitter]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
