import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { WelcomeHeading } from './Welcome.styles';

export const Welcome = () => {
  const username = useAuthenticator().user.username;

  return <WelcomeHeading>Welcome, {`${username}`}</WelcomeHeading>;
};

export default Welcome;
