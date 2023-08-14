import React from 'react';
import { ContextMenuVariants, VariantPropsMap } from './types';
import { RedactorContextMenu } from './redactor';

export const ContextMenu: { [key in ContextMenuVariants]: React.FC<VariantPropsMap[key]> } = {
  Redactor: RedactorContextMenu,
};
