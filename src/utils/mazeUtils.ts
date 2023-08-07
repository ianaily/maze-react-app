import { areaTypeByShort } from 'src/utils/areaUtils';
import { Area, AreaType, AreaTypes, Maze } from 'src/types/maze';
import { Point } from 'src/types/point';

// prettier-ignore
export const mazeUtils = (maze: Maze) => {
  const getFlatIndex = (x: number, y: number): number =>
    x * maze.height + y;

  const getX = (flatIndex: number): number =>
    Math.floor(flatIndex / maze.height);

  const getY = (flatIndex: number): number =>
    flatIndex % maze.height;

  const setAreaType = (point: Point, type: AreaType, ignoreRewritable?: boolean) => {
    const ableToChange = ignoreRewritable || getAreaType(point).rewritable;
    ableToChange && (maze.areas[getFlatIndex(point.x, point.y)].type = type);

    return maze;
  };

  const getAreaType = (point: Point) =>
    maze.areas[getFlatIndex(point.x, point.y)].type;

  const fillEmpty = () => {
    maze.areas = [...Array(maze.width * maze.height)].map((_, index) => ({
      x: getX(index),
      y: getY(index),
      type: AreaTypes.Wall,
    }));

    setAreaType(maze.enter, AreaTypes.Enter);
    setAreaType(maze.exit, AreaTypes.Exit);
    setAreaType(maze.center, AreaTypes.Center);
  };

  return { getFlatIndex, setAreaType, getAreaType, fillEmpty };
};
