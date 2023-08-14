import styled from 'styled-components';
import { styles } from 'src/styles/styles';
import { Panel } from '../styled';

export const Container = styled(Panel)`
  display: flex;
  align-items: center;
  gap: ${styles.offsets.s};
  position: relative;
`;
