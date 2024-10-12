import React from 'react';
import { CustomSignOutButton } from './SignOut.styles';

interface SignOutProps {
  onSignOut: () => void;
}

const SignOut = ({ onSignOut }: SignOutProps) => {
  return (
    <CustomSignOutButton onClick={onSignOut}>Sign Out</CustomSignOutButton>
  );
};

export default SignOut;
