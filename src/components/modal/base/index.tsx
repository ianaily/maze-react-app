import React from 'react';
import { ModalProps } from './types';
import { ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from './styled';

export const Modal: React.FC<ModalProps> = ({ title, children, footer }) => {
  return (
    <ModalBackdrop>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </ModalBackdrop>
  );
};
