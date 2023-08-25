import { Point } from 'src/types/point';

export interface DropdownProps {
  isOpened: boolean;
  onHide: VoidFunction;
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  customPosition?: Point;
  theme?: 'dark' | 'light';
}
