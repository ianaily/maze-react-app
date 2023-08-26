import { Point } from 'src/types/point';

export type Offset = 's' | 'm' | 'xm' | 'l' | 'xl';

export interface DropdownProps {
  isOpened: boolean;
  onHide: VoidFunction;
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  customPosition?: Point;
  offsetTop?: Offset;
  offsetLeft?: Offset;
  theme?: 'dark' | 'light';
}
