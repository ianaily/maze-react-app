import { Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { Cursor } from 'src/types/cursor';

export interface MazeRedactorRendererProps {
  maze: Maze;
  cursor: Cursor;
  route: Point[];
  canvasWidth: number;
  onKeyDown: (key: string) => void;
  onAreaClick: (area: Point) => void;
  onMouseMove: (area: Point) => void;
  onMouseHoldMove: (area: Point) => void;
  onContextMenu: (area: Point, offset: Point) => void;
}
