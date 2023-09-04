import { LoadMazeModalProps } from './loadMaze/types';
import { PauseModalProps } from './pause/types';
import { ConfigModalProps } from './config/types';
import { SelectConfigModalProps } from './selectConfig/types';
import { GameMessageProps } from './gameMessage/types';

export type ModalVariants = 'LoadMaze' | 'Pause' | 'Config' | 'SelectConfig' | 'GameMessage';

export type VariantPropsMap = {
  LoadMaze: LoadMazeModalProps;
  Pause: PauseModalProps;
  Config: ConfigModalProps;
  SelectConfig: SelectConfigModalProps;
  GameMessage: GameMessageProps;
};
