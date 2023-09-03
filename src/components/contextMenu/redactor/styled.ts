import styled from 'styled-components';
import { styles } from 'src/styles/styles';
import { AreaPalette } from 'src/components/panels/palette/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AreaTypeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${styles.offsets.s};
  padding: ${styles.offsets.s};
  cursor: pointer;

  & > span {
    color: ${styles.colors.font.black};
  }

  &:hover {
    background-color: ${styles.colors.transparent.dark1};
  }
`;

export const AreaTypePalette = styled(AreaPalette)`
  width: 32px;
  height: 32px;
`;
