import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import { WebSocketProvider } from './contexts/WebSocketContext';

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
