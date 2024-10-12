import type { Meta, StoryObj } from '@storybook/react';
import BTCPrice from './BTCPrice';

const meta = {
  component: BTCPrice,
} satisfies Meta<typeof BTCPrice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithValue: Story = {
  args: {
    btcPrice: 63108.0578,
  },
};

export const Loading: Story = {
  args: {
    btcPrice: null,
  },
};
