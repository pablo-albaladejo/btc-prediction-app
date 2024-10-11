import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import Home from './pages/home';
import Login from './pages/login';
import { WebSocketProvider } from './contexts/webSocketContext';

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <Authenticator>
            <WebSocketProvider>
              <Home />
            </WebSocketProvider>
          </Authenticator>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
);

export default App;
