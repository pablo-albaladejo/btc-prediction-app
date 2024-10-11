import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

const Login = () => (
  <Authenticator>
    {({ signOut, user }) => (
      <main>
        <h1>Welcome, {user?.username}</h1>
        <button onClick={signOut}>Sign Out</button>
      </main>
    )}
  </Authenticator>
);

export default Login;
