import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../utils/renderWithTheme';
import Prediction from './Prediction';

test('renders the default state when no prediction is pending', () => {
  const mockOnPrediction = jest.fn();

  renderWithTheme(
    <Prediction hasPendingPrediction={false} onPrediction={mockOnPrediction} />,
  );

  expect(screen.getByText('Make your prediction:')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Up'));
  expect(mockOnPrediction).toHaveBeenCalledWith('up');

  fireEvent.click(screen.getByText('Down'));
  expect(mockOnPrediction).toHaveBeenCalledWith('down');
});

test('renders the pending state when prediction is pending', () => {
  renderWithTheme(
    <Prediction hasPendingPrediction={true} onPrediction={jest.fn()} />,
  );

  expect(
    screen.getByText(
      'You have a pending prediction. Please wait for it to be resolved.',
    ),
  ).toBeInTheDocument();

  expect(screen.queryByText('Up')).not.toBeInTheDocument();
  expect(screen.queryByText('Down')).not.toBeInTheDocument();
});
