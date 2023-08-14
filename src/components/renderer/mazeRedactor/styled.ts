import styled from 'styled-components';
import { Panel } from 'src/components/panels/styled';
import { styles } from 'src/styles/styles';

export const Container = styled(Panel)`
  position: relative;
  width: calc(100% - ${styles.offsets.l} * 2);
  height: 74vh;
  margin-top: 0;
  margin-bottom: 0;
  overflow: auto;
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: calc(100% - 4px);
`;
