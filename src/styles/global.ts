import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { styles } from './styles';
import './reset.css';

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  html, body {
    font-family: 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    background-color: ${styles.colors.background.dark};
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

  button {
    padding: ${styles.offsets.button};
    border: none;
    border-radius: ${styles.borderRadius.m};
    box-shadow: none;
    color: ${styles.colors.font.black};
    transition: background-color ${styles.transition.ease};
  
    &:disabled {
      background-color: ${styles.colors.disabled.button};
      color: ${styles.colors.font.white};
    }
  
    &:disabled:hover {
      background-color: ${styles.colors.disabled.button};
      color: ${styles.colors.font.white};
    }
  }
`;
