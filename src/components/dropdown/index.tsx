import React from 'react';
import { useOutsideClick } from 'src/hooks/useOutsideClick';
import { DropdownProps } from './types';
import { Container } from './styled';
import { useCalculatePosition, useCorrectPosition } from './hooks';

export const Dropdown: React.FC<DropdownProps> = ({
  isOpened,
  onHide,
  triggerRef,
  children,
  customPosition,
  theme = 'light',
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const position = useCalculatePosition(triggerRef);
  const correctedPosition = useCorrectPosition(ref, customPosition || position);

  useOutsideClick([ref, triggerRef], onHide);

  return (
    <Container
      ref={ref}
      isOpened={isOpened}
      x={correctedPosition.x}
      y={correctedPosition.y}
      theme={theme}
    >
      {children}
    </Container>
  );
};
