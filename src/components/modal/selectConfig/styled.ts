import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';

export const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: ${styles.offsets.s};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ConfigList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${styles.offsets.xs};
`;

export const ConfigItem = styled.div<{ selected: boolean; toDelete: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${styles.offsets.s};
  padding: ${styles.offsets.m} ${styles.offsets.l};
  border-radius: ${styles.borderRadius.m};
  cursor: pointer;
  ${({ selected, toDelete }) =>
    selected &&
    css`
      background-color: ${toDelete
        ? styles.colors.general.darkRed
        : styles.colors.transparent.dark4};
    `}

  &:hover {
    ${({ selected }) =>
      !selected &&
      css`
        background-color: ${styles.colors.transparent.dark2};
      `};
  }
`;

export const ConfigName = styled.span`
  color: ${styles.colors.font.black};
`;

export const MetaInfo = styled.span`
  color: ${styles.colors.transparent.dark5};
`;
