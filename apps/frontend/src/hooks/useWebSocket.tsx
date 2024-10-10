import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../contexts/webSocketContext';

type OnMessageHandler = (event: MessageEvent) => void;

export const useWebSocket = (onMessage: OnMessageHandler) => {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket, onMessage]);

  const sendMessage = (message: MessageEvent) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return { socket, sendMessage };
};
