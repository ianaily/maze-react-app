import { Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { Cursor } from 'src/types/cursor';
import { Config } from 'src/types/config';

export interface MazeRedactorRendererProps {
  maze: Maze;
  cursor: Cursor;
  config: Config;
  route: Point[];
  canvasWidth: number;
  onAreaClick: (area: Point) => void;
  onMouseMove: (area: Point) => void;
  onMouseHoldMove: (area: Point) => void;
  onContextMenu: (area: Point, offset: Point) => void;
}
