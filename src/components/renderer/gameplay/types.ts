import { Maze } from 'src/types/maze';
import { Player } from 'src/types/player';
import { Camera } from 'src/types/camera';
import { Config } from 'src/types/config';

export interface GameplayRendererProps {
  maxCanvasWidth: number;
  maxCanvasHeight: number;
  maze: Maze;
  player: Player;
  camera: Camera;
  config: Config;
}
