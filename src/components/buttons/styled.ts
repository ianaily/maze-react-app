import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const SaveButton = styled.button`
  background-color: ${styles.colors.background.green};

  &:hover {
    background-color: ${styles.colors.background.darkGreen};
  }
`;

export const LoadButton = styled.button`
  background-color: ${styles.colors.background.blue};

  &:hover {
    background-color: ${styles.colors.background.darkBlue};
  }
`;

export const CancelButton = styled.button`
  background-color: ${styles.colors.disabled.light};

  &:hover {
    background-color: ${styles.colors.disabled.dark};
  }
`;
