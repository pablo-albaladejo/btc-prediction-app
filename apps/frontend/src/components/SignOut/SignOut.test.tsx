import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import SignOut from './SignOut';
import { renderWithTheme } from '../../utils/renderWithTheme';

test('calls onSignOut when the button is clicked', () => {
  const mockSignOut = vi.fn();

  renderWithTheme(<SignOut onSignOut={mockSignOut} />);

  const button = screen.getByText('Sign Out');
  expect(button).toBeInTheDocument();

  fireEvent.click(button);

  expect(mockSignOut).toHaveBeenCalledTimes(1);
});
