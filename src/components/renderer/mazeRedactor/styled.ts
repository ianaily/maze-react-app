import styled from 'styled-components';
import { Panel } from 'src/components/panels/styled';
import { styles } from 'src/styles/styles';

export const Container = styled(Panel)`
  width: calc(100% - ${styles.offsets.l} * 2);
  height: calc(100vh - ${styles.offsets.l} * 4 - ${styles.offsets.s} * 4 - 132px);
  margin-top: 0;
  margin-bottom: 0;
  overflow: auto;
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: calc(100% - 4px);
`;
