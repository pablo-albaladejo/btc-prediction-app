import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component without crashing', () => {
  render(<App />);
});

test('renders BTCPrice component within App', () => {
  render(<App />);
  const btcPriceElement = screen.queryByTestId('btc-price');
  expect(btcPriceElement).toBeInTheDocument();
});

test('provides WebSocket context to App', () => {
  render(<App />);
  const webSocketProvider = screen.queryByTestId('web-socket-provider');
  expect(webSocketProvider).toBeInTheDocument();
});
