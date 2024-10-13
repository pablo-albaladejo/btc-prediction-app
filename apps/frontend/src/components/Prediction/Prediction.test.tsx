import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../utils/renderWithTheme';
import Prediction from './Prediction';
import { PredictionDirection } from '@my-org/shared';

test('renders the default state when no prediction is pending', () => {
  const mockOnPrediction = vi.fn();

  renderWithTheme(
    <Prediction
      direction={PredictionDirection.NONE}
      onPrediction={mockOnPrediction}
    />,
  );

  expect(screen.getByText('Make your prediction:')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Up'));
  expect(mockOnPrediction).toHaveBeenCalledWith('up');

  fireEvent.click(screen.getByText('Down'));
  expect(mockOnPrediction).toHaveBeenCalledWith('down');
});

test('renders the pending state when prediction is pending', () => {
  renderWithTheme(
    <Prediction direction={PredictionDirection.Up} onPrediction={vi.fn()} />,
  );

  expect(
    screen.getByText(
      'You have a pending prediction: up. Please wait for it to be resolved.',
    ),
  ).toBeInTheDocument();

  expect(screen.queryByText('Up')).not.toBeInTheDocument();
  expect(screen.queryByText('Down')).not.toBeInTheDocument();
});
