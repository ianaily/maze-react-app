import styled from 'styled-components';
import { styles } from 'src/styles/styles';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';

export const Container = styled.div``;

export const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${styles.offsets.s};
  padding: ${styles.offsets.xs};
`;

export const InlineInput = styled(Input)`
  width: 128px;
  padding: ${styles.offsets.s} !important;
`;

export const AcceptButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
  box-shadow: none;
`;
