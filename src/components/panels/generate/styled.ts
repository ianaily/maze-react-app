import styled from 'styled-components';
import { styles } from 'src/styles/styles';
import { Input } from 'src/components/input';
import { Panel } from '../styled';

export const GenerateContainer = styled(Panel)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: calc(${styles.offsets.xl} * 4);
`;

export const SizeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${styles.offsets.s};
`;

export const SizeInput = styled(Input)`
  width: 90px;
`;
