import React from 'react';
import { WelcomeHeading } from './Welcome.styles';

interface WelcomeProps {
  username: string;
}

const Welcome = ({ username }: WelcomeProps) => {
  return <WelcomeHeading>Welcome, {username}</WelcomeHeading>;
};

export default Welcome;
