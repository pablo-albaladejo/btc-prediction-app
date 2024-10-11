import React from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { WebSocketProvider } from '../../contexts/webSocketContext';
import BTCPrice from '../../components/btcPrice';

import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

export default function App() {
  return (
    <Authenticator>
      {() => (
        <WebSocketProvider>
          <div className="App">
            <BTCPrice />
          </div>
        </WebSocketProvider>
      )}
    </Authenticator>
  );
}
