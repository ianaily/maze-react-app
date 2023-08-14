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

export const MenuPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: ${styles.offsets.s};
  width: 100%;
  max-width: 384px;
  padding: ${styles.offsets.l};
`;

export const MenuTitle = styled.h2`
  margin: 0;
  padding-bottom: ${styles.offsets.m};
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  color: ${styles.colors.font.grey};
`;

export const Title = styled.h1`
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  color: ${styles.colors.font.white};
`;
