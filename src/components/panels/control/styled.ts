import styled from 'styled-components';
import { styles } from 'src/styles/styles';
import { Panel } from '../styled';

export const ControlContainer = styled(Panel)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${styles.offsets.s};
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: ${styles.offsets.s};
  flex: 1;

  &:first-child {
    justify-content: start;
  }

  &:last-child {
    justify-content: end;
  }
`;
