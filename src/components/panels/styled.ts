import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const Panel = styled.div`
  margin: ${styles.offsets.l};
  padding: ${styles.offsets.s};
  border-radius: ${styles.borderRadius.m};
  border: 1px solid ${styles.colors.transparent.light0};
  background-color: ${styles.colors.transparent.light1};
  backdrop-filter: blur(2px);
`;
