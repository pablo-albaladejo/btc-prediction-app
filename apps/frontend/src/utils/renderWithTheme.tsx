import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { GlobalStyles } from '../styles/globalStyles';

const renderWithTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) =>
  render(
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {ui}
    </ThemeProvider>,
    options,
  );

export * from '@testing-library/react';
export { renderWithTheme };
