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

export const AreaType = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${styles.offsets.s};
`;

export const AreaTypeInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${styles.offsets.s};
`;

export const AreaTypeColor = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${styles.borderRadius.m};
  background-color: ${({ type }) => type};
`;

export const AreaTypeName = styled.span`
  width: 50px;
  font-family: monospace;
  color: ${styles.colors.font.black};
`;

export const AreaTypeShort = styled.pre`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  font-family: monospace;
  border-radius: ${styles.borderRadius.m};
  background-color: ${styles.colors.transparent.dark1};
  color: ${styles.colors.font.black};
`;

export const AreaTypeData = styled.span`
  width: 112px;
  padding: ${styles.offsets.s};
  font-family: monospace;
  border-radius: ${styles.borderRadius.m};
  background-color: ${styles.colors.transparent.dark1};
  color: ${styles.colors.font.black};
`;

export const Sprite = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

export const MultiSprite = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &::after {
    content: '...';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: ${styles.colors.font.white};
  }
`;

export const MultiSpriteDropdown = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: ${styles.offsets.s};
  width: calc(32px * 3 + ${styles.offsets.s} * 2);
  margin: ${styles.offsets.s};
  border-radius: ${styles.borderRadius.m};

  & ${Sprite} {
    box-shadow: ${styles.boxShadow.regular};
  }
`;