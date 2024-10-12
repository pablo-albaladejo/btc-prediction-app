import React from 'react';
import UserScore from './UserScore';
import { useScore } from '../../hooks';

const UserScoreContainer = () => {
  const score = useScore();

  return <UserScore score={score} />;
};

export default UserScoreContainer;
