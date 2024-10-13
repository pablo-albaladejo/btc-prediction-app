import React, { useContext } from 'react';
import UserScore from './UserScore';
import { WebSocketContext } from '../../contexts';
const UserScoreContainer = () => {
  const { score } = useContext(WebSocketContext);

  return <UserScore score={score} />;
};

export default UserScoreContainer;
