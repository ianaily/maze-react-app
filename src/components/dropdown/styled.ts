import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';

export const Container = styled.div<{ isOpened: boolean }>`
  display: block;
  position: absolute;
  top: calc(100% + ${styles.offsets.s});
  left: 0;
  height: max-content;
  border-radius: ${styles.borderRadius.m};
  background-color: ${styles.colors.transparent.light4};
  opacity: 1;
  z-index: ${styles.zIndex.above};
  transition: height ${styles.transition.ease}, opacity ${styles.transition.ease};

  ${({ isOpened }) =>
    !isOpened &&
    css`
      display: none;
      height: 0;
      opacity: 0;
    `}
`;
