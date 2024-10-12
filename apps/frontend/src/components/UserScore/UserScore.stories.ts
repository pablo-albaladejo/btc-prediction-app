import { Meta, StoryObj } from '@storybook/react';
import UserScore from './UserScore';

export default {
  component: UserScore,
  title: 'Components/UserScore',
} satisfies Meta<typeof UserScore>;

type Story = StoryObj<typeof UserScore>;

export const WithScore: Story = {
  args: {
    score: 85,
  },
};

export const Loading: Story = {
  args: {
    score: null,
  },
};
