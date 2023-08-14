import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const Container = styled.div`
  position: relative;
`;

export const HeadControl = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${styles.offsets.xs};
`;

export const LeftHeadControl = styled.div`
  display: flex;
  gap: ${styles.offsets.xs};

  & > div:first-child {
    margin-right: 0;
  }
`;
