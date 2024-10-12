import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f4f8;
    color: #333;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1rem;
  }

  button {
    font-family: inherit;
  }
`;
