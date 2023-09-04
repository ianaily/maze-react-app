import React from 'react';
import { ModalVariants, VariantPropsMap } from './types';
import { GameMessageModal } from './gameMessage';
import { SelectConfig } from './selectConfig';
import { LoadMazeModal } from './loadMaze';
import { ConfigModal } from './config';
import { PauseModal } from './pause';

export const Modal: { [key in ModalVariants]: React.FC<VariantPropsMap[key]> } = {
  SelectConfig: SelectConfig,
  LoadMaze: LoadMazeModal,
  Config: ConfigModal,
  Pause: PauseModal,
  GameMessage: GameMessageModal,
};
