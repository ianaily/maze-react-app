import styled from 'styled-components';
import { IconLoading } from 'src/components/icons/loading';
import { styles } from 'src/styles/styles';

export const Loading = styled(IconLoading)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  rect {
    fill: ${styles.colors.font.white};
  }
`;
