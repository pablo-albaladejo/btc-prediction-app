import type { Meta, StoryObj } from '@storybook/react';
import Prediction from './Prediction';
import { PredictionDirection } from '@my-org/shared';

const meta = {
  component: Prediction,
  title: 'Components/Prediction',
} satisfies Meta<typeof Prediction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prediction: PredictionDirection.NONE,
    onPrediction: (direction: string) =>
      console.log(`Prediction submitted: ${direction}`),
  },
};

export const PendingPrediction: Story = {
  args: {
    prediction: PredictionDirection.Up,
    onPrediction: (direction: string) =>
      console.log(`Prediction submitted: ${direction}`),
  },
};

export const LoadingPrediction: Story = {
  args: {
    prediction: null,
    onPrediction: (direction: string) =>
      console.log(`Prediction submitted: ${direction}`),
  },
};
