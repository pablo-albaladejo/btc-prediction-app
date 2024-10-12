import React from 'react';
import { Button, useAuthenticator } from '@aws-amplify/ui-react';

const SignOut = () => {
  const { signOut } = useAuthenticator();

  return (
    <Button variation="destructive" onClick={signOut}>
      Sign Out
    </Button>
  );
};

export default SignOut;
