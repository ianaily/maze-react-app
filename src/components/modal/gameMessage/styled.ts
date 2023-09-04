import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const ModalBody = styled.div`
  width: 100%;
  padding: ${styles.offsets.l};
  border-radius: ${styles.borderRadius.m};
  text-align: center;
  text-transform: uppercase;
  background-color: ${styles.colors.general.dark};
`;
