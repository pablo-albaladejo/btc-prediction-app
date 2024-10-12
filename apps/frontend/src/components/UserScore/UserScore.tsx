import React from 'react';
import { useScore } from '../../hooks';
import { ScoreText } from './UserScore.styles';

function UserScore() {
  const score = useScore();

  return (
    <ScoreText>Your Score: {score !== null ? score : 'Loading...'}</ScoreText>
  );
}

export default UserScore;
