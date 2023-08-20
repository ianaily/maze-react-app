import styled from 'styled-components';
import { styles } from 'src/styles/styles';
import { Panel } from 'src/components/panels/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export const DifficultPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: ${styles.offsets.s};
  width: 100%;
  max-width: 384px;
  padding: ${styles.offsets.l};
`;

export const MainMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 384px;
  padding: ${styles.offsets.l};
`;
