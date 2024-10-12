import React from 'react';
import { ScoreText } from './UserScore.styles';

interface UserScoreProps {
  score: number | null;
}

const UserScore = ({ score }: UserScoreProps) => {
  return (
    <ScoreText>Your Score: {score !== null ? score : 'Loading...'}</ScoreText>
  );
};

export default UserScore;
