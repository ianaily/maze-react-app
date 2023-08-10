import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';
import { Panel } from 'src/components/containers/styled';

export const GenerateContainer = styled(Panel)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: calc(${styles.offsets.xl} * 4);
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
