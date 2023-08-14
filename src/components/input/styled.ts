import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';

export const InputWrap = styled.input<{ invalid: boolean }>`
  &:focus {
    box-shadow: ${styles.boxShadow.underlineBlue};
    background-color: ${styles.colors.general.light};
  }

  ${({ invalid }) =>
    invalid &&
    css`
      &:not(:focus) {
        background-color: ${styles.colors.transparent.darkRed};
        color: ${styles.colors.general.red};
        box-shadow: ${styles.boxShadow.besideRed};
      }

      &:focus {
        box-shadow: ${styles.boxShadow.underlineRed};
      }
    `}
`;
