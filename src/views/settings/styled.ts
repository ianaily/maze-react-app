import styled from 'styled-components';
import { styles } from 'src/styles/styles';
import { Panel } from 'src/components/panels/styled';

export const Container = styled.div`
  position: relative;
`;

export const HeadControl = styled.div`
  display: flex;
  gap: ${styles.offsets.xs};
`;

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export const SettingsPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: ${styles.offsets.m};
  width: 100%;
  max-width: 384px;
  padding: ${styles.offsets.l};
`;

export const ButtonsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${styles.offsets.s};
`;
