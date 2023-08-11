import { Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { Cursor } from 'src/types/cursor';

export interface RendererProps {
  maze: Maze;
  cursor: Cursor;
  canvasWidth: number;
  onKeyDown: (key: string) => void;
  onAreaClick: (area: Point) => void;
  onMouseMove: (area: Point) => void;
  onContextMenu: (area: Point, offset: Point) => void;
  enableCoords: boolean;
}
