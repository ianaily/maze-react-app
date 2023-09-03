import styled from 'styled-components';

export const FileInput = styled.input`
  display: none;
`;

export const ImportWrap = styled.button<{ fullWidth: boolean }>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'max-content')};
  padding: 0;
  box-shadow: none;
  border: none;
  background-color: transparent;
`;
