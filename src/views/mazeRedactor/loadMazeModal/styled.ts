import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';

export const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: ${styles.offsets.s};
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
    background-color: ${styles.colors.background.darkBlue};
    ${({ selected }) =>
      !selected &&
      css`
        box-shadow: ${styles.boxShadow.likeButton};
      `}
  }
`;
