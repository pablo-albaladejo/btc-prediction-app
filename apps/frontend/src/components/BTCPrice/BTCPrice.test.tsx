import React from 'react';
import { screen } from '@testing-library/react';
import BTCPrice from './BTCPrice';
import { renderWithTheme } from '../../utils/renderWithTheme';

test('displays the BTC price when a value is passed', () => {
  renderWithTheme(<BTCPrice btcPrice={63108.0578} />);
  expect(screen.getByText('BTC: $63108.0578')).toBeInTheDocument();
});

test('displays "Loading..." when btcPrice is null', () => {
  renderWithTheme(<BTCPrice btcPrice={null} />);
  expect(screen.getByText('BTC: Loading...')).toBeInTheDocument();
});
