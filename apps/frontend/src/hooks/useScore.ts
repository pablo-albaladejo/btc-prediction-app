import { useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { isUpdateUserScoreMessage } from '@my-org/shared';

export const useScore = () => {
  const [score, setScore] = useState<number | null>(null);

  const handleScoreUpdate = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    if (isUpdateUserScoreMessage(data)) {
      console.log('Received message at UserScore:', data);
      setScore(data.score);
    }
  }, []);

  useWebSocket(handleScoreUpdate);

  return score;
};
