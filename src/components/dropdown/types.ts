export interface DropdownProps {
  isOpened: boolean;
  onHide: VoidFunction;
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}
