import React from 'react';
import { RendererVariants, VariantPropsMap } from './types';
import { MazeRedactorRenderer } from './mazeRedactor';

export const Renderer: { [key in RendererVariants]: React.FC<VariantPropsMap[key]> } = {
  MazeRedactor: MazeRedactorRenderer,
};
