import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';
import { Container as DropdownContainer } from 'src/components/dropdown/styled';
import { AreaPalette } from 'src/components/panels/palette/styled';

export const ContextDropdown = styled(DropdownContainer)<{ top: number; left: number }>`
  display: flex;
  flex-direction: column;

  ${({ top, left }) => css`
    top: ${top}px;
    left: ${left}px;
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
