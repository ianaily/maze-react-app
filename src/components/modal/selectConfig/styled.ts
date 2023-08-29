import styled from 'styled-components';
import { styles } from 'src/styles/styles';

export const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: ${styles.offsets.s};
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: ${styles.offsets.s};
  max-height: 75vh;
  overflow: auto;
`;

export const ConfigList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${styles.offsets.s};
`;

export const ConfigItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${styles.offsets.s};
  cursor: pointer;
`;

export const MetaInfo = styled.span`
  color: ${styles.colors.transparent.dark5};
`;
