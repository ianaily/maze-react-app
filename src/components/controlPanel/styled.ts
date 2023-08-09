import styled from 'styled-components';
import { styles } from 'src/styles/styles';
import { Panel } from 'src/components/containers/styled';

export const ControlContainer = styled(Panel)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${styles.offsets.s};
`;
