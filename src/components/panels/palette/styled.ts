import styled from 'styled-components';
import { areaFillColors } from 'src/const/areaTypes';
import { AreaTypeKeys } from 'src/types/maze';
import { styles } from 'src/styles/styles';
import { Panel } from '../styled';

export const AreaPaletteBlock = styled.div`
  display: flex;
  gap: ${styles.offsets.s};

  &:first-child ~ &:nth-child(2) {
    padding-left: ${styles.offsets.s};
    border-left: 1px solid ${styles.colors.transparent.light2};
  }
`;

export const AreaInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${styles.offsets.xs};

  & > span:first-child {
    font-size: 16px;
    color: ${styles.colors.font.white};
  }

  & > span:last-child {
    font-size: 12px;
    color: ${styles.colors.font.grey};
  }
`;

export const AreaPalette = styled.div<{ type: AreaTypeKeys }>`
  display: block;
  width: 42px;
  height: 42px;
  padding: ${styles.offsets.s};
  border-radius: ${styles.borderRadius.m};
  background-color: ${({ type }) => areaFillColors[type]};
  cursor: pointer;
`;

export const AreaTypeList = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: ${styles.offsets.s};
  width: calc(42px * 2 + ${styles.offsets.s});
  margin: ${styles.offsets.s};
  border-radius: ${styles.borderRadius.m};

  & > ${AreaPalette} {
    border: 1px solid ${styles.colors.transparent.dark2};
  }
`;

export const Container = styled(Panel)`
  display: flex;
  align-items: center;
  gap: ${styles.offsets.s};
  position: relative;
`;
