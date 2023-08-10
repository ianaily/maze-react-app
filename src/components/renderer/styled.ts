import styled from 'styled-components';
import { Panel } from 'src/components/containers/styled';
import { styles } from 'src/styles/styles';

export const Container = styled(Panel)`
  position: relative;
  width: calc(100% - ${styles.offsets.l} * 2);
  height: 74vh;
  overflow: auto;
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: calc(100% - 4px);
`;
