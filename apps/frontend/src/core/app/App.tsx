import React from 'react';
import { WebSocketProvider } from '../../contexts/webSocketContext';
import BTCPrice from '../../components/btcPrice';

function App() {
  return (
    <WebSocketProvider>
      <div className="App">
        <BTCPrice />
      </div>
    </WebSocketProvider>
  );
}

export default App;
