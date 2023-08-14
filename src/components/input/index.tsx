import React from 'react';
import { InputWrap } from './styled';
import { InputProps } from './types';

export const Input: React.FC<InputProps> = (props) => {
  return <InputWrap {...props} />;
};
