import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { colors } from './colors';

import './reset.css';

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  html, body {
    font-family: 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    background-color: ${colors.background.grey0};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
    overflow-y: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  }

  a {
    text-decoration: none;
  }
`;
