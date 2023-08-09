import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const Container = styled.div`
  position: relative;
  margin: ${styles.offsets.l};
  padding: ${styles.offsets.s};
  border-radius: ${styles.borderRadius.m};
  background-color: ${styles.colors.general.grey1};
`;

export const Canvas = styled.canvas``;
