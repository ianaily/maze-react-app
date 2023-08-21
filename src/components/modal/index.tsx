import React from 'react';
import { ModalVariants, VariantPropsMap } from './types';
import { LoadMazeModal } from './loadMaze';
import { ConfigModal } from './config';
import { PauseModal } from './pause';

export const Modal: { [key in ModalVariants]: React.FC<VariantPropsMap[key]> } = {
  LoadMaze: LoadMazeModal,
  Config: ConfigModal,
  Pause: PauseModal,
};
