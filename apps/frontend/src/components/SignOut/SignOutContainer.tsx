import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import SignOut from './SignOut';

const SignOutContainer = () => {
  const { signOut } = useAuthenticator();

  return <SignOut onSignOut={signOut} />;
};

export default SignOutContainer;
