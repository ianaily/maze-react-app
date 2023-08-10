import { css } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
export const toastify = css`
  :root {
    --toastify-color-dark: ${styles.colors.general.dark};
    --toastify-color-info: ${styles.colors.general.blue};
    --toastify-color-success: ${styles.colors.general.green};
    --toastify-color-warning: ${styles.colors.general.yellow};
    --toastify-color-error: ${styles.colors.general.red};
    --toastify-color-transparent: ${styles.colors.transparent.light5};
    --toastify-icon-color-info: ${styles.colors.general.blue};
    --toastify-icon-color-success: ${styles.colors.general.green};
    --toastify-icon-color-warning: ${styles.colors.general.yellow};
    --toastify-icon-color-error: ${styles.colors.general.red};
    --toastify-text-color-dark: ${styles.colors.general.dark};
    --toastify-color-progress-dark: ${styles.colors.general.grey2};
  }

  .Toastify__toast-container {
    padding: ${styles.offsets.s};
  }

  .Toastify__toast {
    border-radius: ${styles.borderRadius.m};
    background-color: ${styles.colors.transparent.light5};
    box-shadow: ${styles.boxShadow.regular};
  }

  @media only screen and (max-width: 480px) {
    .Toastify__toast-container {
      padding: ${styles.offsets.s};
    }

    .Toastify__toast {
      background-color: ${styles.colors.transparent.light7};
      color: ${styles.colors.font.black};
      box-shadow: none;
    }
  }

  .Toastify--animate {
    animation-duration: 0.5s;
  }

  .Toastify__close-button {
    display: none;
  }
`;

import { styles } from './styles';
