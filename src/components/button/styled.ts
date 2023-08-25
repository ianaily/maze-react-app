import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';

const Button = styled.button<{ fullWidth?: boolean }>`
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

export const GreenButton = styled(Button)`
  background-color: ${styles.colors.general.green};

  &:hover {
    background-color: ${styles.colors.general.darkGreen};
  }
`;

export const BlueButton = styled(Button)`
  background-color: ${styles.colors.general.blue};

  &:hover {
    background-color: ${styles.colors.general.darkBlue};
  }
`;

export const YellowButton = styled(Button)`
  background-color: ${styles.colors.general.yellow};

  &:hover {
    background-color: ${styles.colors.general.darkYellow};
  }
`;

export const RedButton = styled(Button)`
  background-color: ${styles.colors.general.red};

  &:hover {
    background-color: ${styles.colors.general.darkRed};
  }
`;

export const GreyButton = styled(Button)`
  background-color: ${styles.colors.disabled.light};

  &:hover {
    background-color: ${styles.colors.disabled.dark};
  }
`;
