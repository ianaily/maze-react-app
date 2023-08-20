import React from 'react';
import { Panel } from '../styled';
import { BlankPanelProps } from './types';

export const BlankPanel: React.FC<BlankPanelProps> = ({ children }) => {
  return <Panel>{children}</Panel>;
};
