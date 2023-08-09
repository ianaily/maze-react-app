import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';

export const GenerateContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: ${styles.offsets.l};
  padding: ${styles.offsets.s};
  border-radius: ${styles.borderRadius.m};
  background-color: ${styles.colors.general.grey1};
`;

export const SizeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${styles.offsets.s};
`;

export const Input = styled.input<{ invalid: boolean }>`
  width: 90px;

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
