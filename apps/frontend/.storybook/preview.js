import { ThemeProvider } from 'styled-components';
import { theme } from '../src/styles/theme'; // Asegúrate de que el tema esté correctamente importado
import { GlobalStyles } from '../src/styles/globalStyles'; // Si tienes estilos globales

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
