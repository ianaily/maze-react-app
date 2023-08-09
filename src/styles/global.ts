import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { styles } from './styles';
import { toastify } from './toastify';
import './reset.css';

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  ${toastify}
  html, body {
    font-family: 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    background-color: ${styles.colors.general.dark};
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
    box-shadow: ${styles.boxShadow.likeButton};
    color: ${styles.colors.font.black};
    transition: ${styles.transition.background}, ${styles.transition.boxShadow};

    &:hover {
      box-shadow: none;
    }

    &:disabled {
      background-color: ${styles.colors.disabled.button};
      color: ${styles.colors.font.white};
      box-shadow: none;
    }
  
    &:disabled:hover {
      background-color: ${styles.colors.disabled.button};
      color: ${styles.colors.font.white};
    }
  }

  input[type=text], input[type=number] {
    padding: ${styles.offsets.button};
    border: none;
    border-radius: ${styles.borderRadius.m};
    background-color: ${styles.colors.transparent.light3};
    color: ${styles.colors.font.black};
    transition: ${styles.transition.background}, ${styles.transition.boxShadow};
  }
`;
