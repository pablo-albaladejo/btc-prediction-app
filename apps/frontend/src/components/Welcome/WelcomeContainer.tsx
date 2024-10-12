import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Welcome from './Welcome';

const WelcomeContainer = () => {
  const { user } = useAuthenticator();
  const username = user?.username;

  return <Welcome username={username} />;
};

export default WelcomeContainer;
