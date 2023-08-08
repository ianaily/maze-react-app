import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const ModalBackdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${styles.colors.transparent.dark1};
  backdrop-filter: blur(8px);
  transition: ${styles.transition.background};
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  min-width: 385px;
  min-height: 256px;
  border-radius: ${styles.borderRadius.m};
  background-color: ${styles.colors.background.grey1};
  color: ${styles.colors.font.white};
  box-shadow: ${styles.boxShadow.regular};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${styles.offsets.m};
  border-bottom: 1px solid ${styles.colors.background.grey0};
  border-radius: ${styles.borderRadius.m} ${styles.borderRadius.m} 0 0;
  background-color: ${styles.colors.background.grey2};
`;

export const ModalBody = styled.div`
  width: 100%;
  padding: ${styles.offsets.m};
  background-color: ${styles.colors.background.grey1};
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
  padding: ${styles.offsets.m};
  border-top: 1px solid ${styles.colors.background.grey0};
  border-radius: 0 0 ${styles.borderRadius.m} ${styles.borderRadius.m};
  background-color: ${styles.colors.background.grey2};
`;
