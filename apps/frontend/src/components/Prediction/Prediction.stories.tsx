import type { Meta, StoryObj } from '@storybook/react';
import Prediction from './Prediction';

const meta = {
  component: Prediction,
  title: 'Components/Prediction',
} satisfies Meta<typeof Prediction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hasPendingPrediction: false,
    onPrediction: (direction: string) =>
      console.log(`Prediction submitted: ${direction}`),
  },
};

export const PendingPrediction: Story = {
  args: {
    hasPendingPrediction: true,
    onPrediction: (direction: string) =>
      console.log(`Prediction submitted: ${direction}`),
  },
};
