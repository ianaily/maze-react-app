import styled, { css } from 'styled-components';
import { Difficult } from 'src/types/game';
import { styles } from 'src/styles/styles';

export const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: ${styles.offsets.s};
`;

export const MazeLoadList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${styles.offsets.xs};
`;

export const MazeItem = styled.div<{ selected: boolean; toDelete: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: ${styles.offsets.m} ${styles.offsets.l};
  border-radius: ${styles.borderRadius.m};
  color: ${styles.colors.font.black};
  ${({ selected, toDelete }) =>
    selected &&
    css`
      background-color: ${toDelete
        ? styles.colors.general.darkRed
        : styles.colors.general.darkBlue};
      color: ${styles.colors.font.white};
    `}
  cursor: pointer;
  transition: ${styles.transition.background}, ${styles.transition.boxShadow};

  &:hover {
    ${({ selected }) =>
      !selected &&
      css`
        background-color: ${styles.colors.general.blue};
        box-shadow: ${styles.boxShadow.likeButton};
      `}
  }
`;

const colors = {
  [Difficult.easy]: styles.colors.general.darkGreen,
  [Difficult.normal]: styles.colors.general.darkYellow,
  [Difficult.hard]: styles.colors.general.darkRed,
};

export const MazeSizeInfo = styled.span<{ difficult: Difficult }>`
  font-size: 12px;
  color: ${({ difficult }) => colors[difficult]};
`;
