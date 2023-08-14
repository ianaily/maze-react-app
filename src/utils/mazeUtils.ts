import { Area, AreaType, AreaTypes, Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { areaTypeByShort } from './areaUtils';

// prettier-ignore
export const mazeUtils = (maze: Maze) => {
  const {width, height} = maze.size;

  const getFlatIndex = (x: number, y: number): number =>
    x * height + y;

  const getX = (flatIndex: number): number =>
    Math.floor(flatIndex / height);

  const getY = (flatIndex: number): number =>
    flatIndex % height;

  const setAreaType = (point: Point, type: AreaType, ignoreRewritable?: boolean) => {
    const ableToChange = ignoreRewritable || getAreaType(point).rewritable;
    ableToChange && (maze.areas[getFlatIndex(point.x, point.y)].type = type);

    return maze;
  };

  const getAreaType = (point: Point) =>
    maze.areas[getFlatIndex(point.x, point.y)].type;

  const fillEmpty = () => {
    maze.areas = [...Array(width * height)].map((_, index) => ({
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

export const stringifyMaze = (maze: Maze): string => {
  const infoParsed = `${maze.name}`;
  const sizeParsed = `${maze.size.width}:${maze.size.height}`;
  const metaParsed = [
    `${stringifyPoint(maze.enter)}`,
    `${stringifyPoint(maze.center)}`,
    `${stringifyPoint(maze.exit)}`,
  ].join(';');
  const areasParsed = maze.areas.reduce(
    (memo, area, index) =>
      `${memo}${maze.areas[index - 1]?.x !== area.x ? '\n' : ''}${area.type.short}`,
    '',
  );

  return `${infoParsed}-${sizeParsed}-${metaParsed}-${areasParsed}`;
};

export const parseMaze = (parsed: string): Maze => {
  const [name, sizeString, metaString, areasString] = parsed.split('-');

  const [width, height] = sizeString.split(':');
  const [enter, center, exit] = metaString.split(';');
  const areas: Area[] = [];

  areasString
    .trim()
    .split('\n')
    .forEach((row, indexX) => {
      Array.from(row).map((areaShort, indexY) =>
        areas.push({
          x: indexX,
          y: indexY,
          type: areaTypeByShort(areaShort),
        }),
      );
    });

  return {
    name,
    size: { width: +width, height: +height },
    enter: parsePoint(enter, AreaTypes.Enter),
    center: parsePoint(center, AreaTypes.Center),
    exit: parsePoint(exit, AreaTypes.Exit),
    areas: areas,
  };
};

const stringifyPoint = ({ x, y }: Point) => `${x}:${y}`;

const parsePoint = (coords: string, type: AreaType): Area => {
  const [x, y] = coords.split(':');

  return { x: +x, y: +y, type };
};
