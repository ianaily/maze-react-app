import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';
import { Container as DropdownContainer } from 'src/components/dropdown/styled';
import { AreaPalette } from 'src/components/panels/palette/styled';

export const ContextDropdown = styled(DropdownContainer)<{ x: number; y: number }>`
  display: flex;
  flex-direction: column;

  ${({ x, y }) => css`
    top: ${y}px;
    left: ${x}px;
  `})
`;

export const AreaTypeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${styles.offsets.s};
  padding: ${styles.offsets.s};
  cursor: pointer;

  &:hover {
    background-color: ${styles.colors.transparent.dark1};
  }
`;

export const AreaTypePalette = styled(AreaPalette)`
  width: 32px;
  height: 32px;
`;
