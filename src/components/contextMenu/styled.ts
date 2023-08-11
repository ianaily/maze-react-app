import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';
import { Container as DropdownContainer } from 'src/components/dropdown/styled';

export const ContextDropdown = styled(DropdownContainer)<{ x: number; y: number }>`
  display: flex;
  flex-direction: column;
  gap: ${styles.offsets.s};
  padding: ${styles.offsets.m};

  ${({ x, y }) => css`
    top: ${y}px;
    left: ${x}px;
  `})
`;

export const AreaTypeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${styles.offsets.s};
  cursor: pointer;
`;
