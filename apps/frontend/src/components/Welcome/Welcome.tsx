import React from 'react';
import { Heading } from '@aws-amplify/ui-react';

export const Welcome = () => {
  //const username = useAuthenticator().user.username;
  const username = 'foo';
  return <Heading>Welcome, {`${username}`}</Heading>;
};

export default Welcome;
