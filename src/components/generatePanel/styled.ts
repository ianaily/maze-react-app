import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const GenerateContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: ${styles.offsets.l};
  padding: ${styles.offsets.s};
  border-radius: ${styles.borderRadius.m};
  background-color: ${styles.colors.background.grey1};
`;

export const SizeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${styles.offsets.s};
`;

export const Input = styled.input``;
