import styled, { css } from 'styled-components';
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
  gap: 2px;
`;

export const MazeItem = styled.div<{ selected: boolean }>`
  padding: ${styles.offsets.m} ${styles.offsets.l};
  border-radius: ${styles.borderRadius.m};
  ${({ selected }) =>
    selected &&
    css`
      background-color: ${styles.colors.background.darkBlue};
    `}
  cursor: pointer;
  transition: ${styles.transition.background}, ${styles.transition.boxShadow};

  &:hover {
    ${({ selected }) =>
      !selected &&
      css`
        background-color: ${styles.colors.background.blue};
        box-shadow: ${styles.boxShadow.likeButton};
      `}
  }
`;