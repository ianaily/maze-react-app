import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const SaveButton = styled.button`
  background-color: ${styles.colors.general.green};

  &:hover {
    background-color: ${styles.colors.general.darkGreen};
  }
`;

export const LoadButton = styled.button`
  background-color: ${styles.colors.general.blue};

  &:hover {
    background-color: ${styles.colors.general.darkBlue};
  }
`;

export const DeleteButton = styled.button`
  background-color: ${styles.colors.general.red};

  &:hover {
    background-color: ${styles.colors.general.darkRed};
  }
`;

export const CancelButton = styled.button`
  background-color: ${styles.colors.disabled.light};

  &:hover {
    background-color: ${styles.colors.disabled.dark};
  }
`;
