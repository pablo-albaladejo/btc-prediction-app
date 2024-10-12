import React from 'react';
import { screen } from '@testing-library/react';
import UserScore from './UserScore';
import { renderWithTheme } from '../../utils/renderWithTheme';

test('renders score when a value is passed', () => {
  renderWithTheme(<UserScore score={85} />);
  expect(screen.getByText('Your Score: 85')).toBeInTheDocument();
});

test('renders loading when score is null', () => {
  renderWithTheme(<UserScore score={null} />);
  expect(screen.getByText('Your Score: Loading...')).toBeInTheDocument();
});
