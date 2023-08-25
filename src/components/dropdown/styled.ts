import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';

export const Container = styled.div<{
  isOpened: boolean;
  x: number;
  y: number;
  theme: 'dark' | 'light';
}>`
  display: block;
  position: fixed;
  height: max-content;
  margin-top: ${styles.offsets.xm};
  border-radius: ${styles.borderRadius.m};
  background-color: ${({ theme }) =>
    theme === 'light' ? styles.colors.transparent.light4 : styles.colors.transparent.dark5};
  box-shadow: ${styles.boxShadow.regular};
  opacity: 1;
  backdrop-filter: blur(4px);
  z-index: ${styles.zIndex.above};
  transition: height ${styles.transition.ease}, opacity ${styles.transition.ease};

  ${({ x, y }) => css`
    top: ${y}px;
    left: ${x}px;
  `})

  ${({ isOpened }) =>
    !isOpened &&
    css`
      display: none;
      height: 0;
      opacity: 0;
    `}
`;
