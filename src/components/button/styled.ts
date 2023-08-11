import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const GreenButton = styled.button`
  background-color: ${styles.colors.general.green};

  &:hover {
    background-color: ${styles.colors.general.darkGreen};
  }
`;

export const BlueButton = styled.button`
  background-color: ${styles.colors.general.blue};

  &:hover {
    background-color: ${styles.colors.general.darkBlue};
  }
`;

export const YellowButton = styled.button`
  background-color: ${styles.colors.general.yellow};

  &:hover {
    background-color: ${styles.colors.general.darkYellow};
  }
`;

export const RedButton = styled.button`
  background-color: ${styles.colors.general.red};

  &:hover {
    background-color: ${styles.colors.general.darkRed};
  }
`;

export const GreyButton = styled.button`
  background-color: ${styles.colors.disabled.light};

  &:hover {
    background-color: ${styles.colors.disabled.dark};
  }
`;
