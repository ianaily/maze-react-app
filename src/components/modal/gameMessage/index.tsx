import React from 'react';
import { ModalBackdrop, ModalContent } from '../base/styled';
import { GameMessageProps } from './types';
import { ModalBody } from './styled';

export const GameMessageModal: React.FC<GameMessageProps> = ({ children }) => {
  return (
    <ModalBackdrop>
      <ModalContent>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalBackdrop>
  );
};
