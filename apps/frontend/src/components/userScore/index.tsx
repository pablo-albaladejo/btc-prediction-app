import React, { useState, useCallback } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { isUpdateUserScoreMessage } from '@my-org/shared';
import { Heading } from '@aws-amplify/ui-react';

function UserScore() {
  const [score, setScore] = useState<number | null>(null);

  const handleScoreUpdate = useCallback((message: MessageEvent) => {
    const data = JSON.parse(message.data);
    if (isUpdateUserScoreMessage(data)) {
      console.log('Received message at UserScore:', data);
      setScore(data.score);
    }
  }, []);

  useWebSocket(handleScoreUpdate);

  return (
    <Heading level={1}>
      Your Score: {score !== null ? score : 'Loading...'}
    </Heading>
  );
}

export default UserScore;
