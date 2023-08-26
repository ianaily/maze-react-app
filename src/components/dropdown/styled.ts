import styled, { css } from 'styled-components';
import { styles } from 'src/styles/styles';
import { Offset } from './types';

const getOffset = (offset: Offset) =>
  ({
    s: styles.offsets.s,
    m: styles.offsets.m,
    xm: styles.offsets.xm,
    l: styles.offsets.l,
    xl: styles.offsets.xl,
  }[offset]);

export const Container = styled.div<{
  isOpened: boolean;
  x: number;
  y: number;
  theme: 'dark' | 'light';
  offsetTop?: Offset;
  offsetLeft?: Offset;
}>`
  display: ${({ isOpened }) => (isOpened ? 'block' : 'none')};
  position: fixed;
  height: max-content;
  margin-top: ${({ offsetTop }) => (offsetTop ? getOffset(offsetTop) : styles.offsets.xs)};
  margin-left: ${({ offsetLeft }) => (offsetLeft ? getOffset(offsetLeft) : 0)};
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
      height: 0;
      opacity: 0;
    `}
`;
