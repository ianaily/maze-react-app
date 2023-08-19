import styled from 'styled-components';
import { Size } from 'src/types/size';

export const Container = styled.div<Size>`
  width: ${({ width }) => width || 0}px;
  height: ${({ height }) => height || 0}px;
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: calc(100% - 4px);
`;
