import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';
import AppRouter from './pages/AppRouter';

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <AppRouter />
  </ThemeProvider>
);

export default App;
