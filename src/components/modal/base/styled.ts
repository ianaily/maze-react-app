import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const ModalBackdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${styles.colors.transparent.dark1};
  backdrop-filter: blur(8px);
  z-index: ${styles.zIndex.above};
  transition: ${styles.transition.background};
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  min-width: 385px;
  border-radius: ${styles.borderRadius.m};
  color: ${styles.colors.font.white};
  box-shadow: ${styles.boxShadow.regular};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${styles.offsets.m};
  border-bottom: 1px solid ${styles.colors.general.grey0};
  border-radius: ${styles.borderRadius.m} ${styles.borderRadius.m} 0 0;
  background-color: ${styles.colors.transparent.light5};
  color: ${styles.colors.font.black};
`;

export const ModalBody = styled.div`
  width: 100%;
  min-height: 56px;
  padding: ${styles.offsets.m};
  background-color: ${styles.colors.transparent.light5};
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
  padding: ${styles.offsets.s};
  border-top: 1px solid ${styles.colors.general.grey0};
  border-radius: 0 0 ${styles.borderRadius.m} ${styles.borderRadius.m};
  background-color: ${styles.colors.transparent.light4};
`;
