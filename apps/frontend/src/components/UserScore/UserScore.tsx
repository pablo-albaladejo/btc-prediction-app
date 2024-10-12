import React from 'react';
import { Heading } from '@aws-amplify/ui-react';
import { useScore } from '../../hooks';

function UserScore() {
  const score = useScore();

  return (
    <Heading level={1}>
      Your Score: {score !== null ? score : 'Loading...'}
    </Heading>
  );
}

export default UserScore;
