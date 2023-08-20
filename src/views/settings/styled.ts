import styled from 'styled-components';
import { styles } from '../../styles/styles';

export const Container = styled.div`
  position: relative;
`;

export const HeadControl = styled.div`
  display: flex;
  gap: ${styles.offsets.xs};
`;

export const ImportExportContainer = styled.div`
  display: flex;
  gap: ${styles.offsets.s};
`;

export const FileInput = styled.input`
  display: none;
`;
