import { Meta, StoryObj } from '@storybook/react';
import Welcome from './Welcome';

export default {
  component: Welcome,
  title: 'Components/Welcome',
} satisfies Meta<typeof Welcome>;

type Story = StoryObj<typeof Welcome>;

export const WithUsername: Story = {
  args: {
    username: 'Pablo',
  },
};
