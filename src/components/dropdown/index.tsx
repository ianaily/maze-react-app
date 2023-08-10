import React from 'react';
import { useOutsideClick } from 'src/hooks/useOutsideClick';
import { DropdownProps } from './types';
import { Container } from './styled';

export const Dropdown: React.FC<DropdownProps> = ({ isOpened, onHide, triggerRef, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useOutsideClick([ref, triggerRef], onHide);

  return (
    <Container ref={ref} isOpened={isOpened}>
      {children}
    </Container>
  );
};
