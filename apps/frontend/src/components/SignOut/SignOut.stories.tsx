import { Meta, StoryObj } from '@storybook/react';
import SignOut from './SignOut';

export default {
  component: SignOut,
  title: 'Components/SignOut',
} satisfies Meta<typeof SignOut>;

type Story = StoryObj<typeof SignOut>;

export const Default: Story = {
  args: {
    onSignOut: () => alert('Signing out...'),
  },
};
