import React from 'react';
import { ButtonProps } from './types';
import { RedButton, GreenButton, BlueButton, YellowButton, GreyButton } from './styled';

export const Button: React.FC<ButtonProps> = ({ variant, ...props }) =>
  ({
    green: <GreenButton {...props} />,
    blue: <BlueButton {...props} />,
    yellow: <YellowButton {...props} />,
    red: <RedButton {...props} />,
    grey: <GreyButton {...props} />,
  }[variant]);
