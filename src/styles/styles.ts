import { colors } from './colors';

export const styles = {
  colors,
  offsets: {
    s: '8px',
    m: '16px',
    xm: '24px',
    l: '32px',
    button: '16px 24px',
  },
  borderRadius: {
    s: '4px',
    m: '8px',
    l: '12px',
  },
  boxShadow: {
    likeButton: `inset 0 -4px 0 0 ${colors.transparent.dark3}`,
    beside: `inset 24px 0 0px -18px ${colors.background.blue}`,
    regular: '0 4px 16px rgba(0, 20, 40, 0.2)',
  },
  transition: {
    background: 'background-color ease 0.2s',
    boxShadow: 'box-shadow ease 0.2s',
    ease: 'ease 0.2s',
  },
};
