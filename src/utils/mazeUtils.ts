import { squareEasy, squareNormal } from 'src/const/maze';
import { Area, AreaType, Maze } from 'src/types/maze';
import { Size } from 'src/types/size';
import { Point } from 'src/types/point';
import { Difficult } from 'src/types/game';
import { AreaTypes } from 'src/const/areaTypes';
import { areaTypeByShort } from './areaUtils';

// prettier-ignore
export const mazeUtils = (maze: Maze) => {
  const {width, height} = maze.size;

  const getFlatIndex = (x: number, y: number) =>
    (x < width && y < height && x >= 0 && y >= 0) ? x * height + y : -1;

  const getX = (flatIndex: number): number =>
    Math.floor(flatIndex / height);

  const getY = (flatIndex: number): number =>
    flatIndex % height;

  const setAreaType = (point: Point, type: AreaType, ignoreRewritable?: boolean) => {
    const ableToChange = ignoreRewritable || getAreaType(point).rewritable;
    const index = getFlatIndex(point.x, point.y);

    ableToChange && index >= 0 && (maze.areas[index].type = type);

    return maze;
  };

  const getAreaType = (point: Point) =>
    maze.areas[getFlatIndex(point.x, point.y)]?.type;

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

export const getAreaDifficult = ({ width, height }: Size): Difficult => {
  const square = width * height;

  return square < squareEasy
    ? Difficult.easy
    : square < squareNormal
    ? Difficult.normal
    : Difficult.hard;
};

export const getSizeByDifficult = (difficult: Difficult): Size => {
  return {
    [Difficult.easy]: { width: 16, height: 16 },
    [Difficult.normal]: { width: 32, height: 32 },
    [Difficult.hard]: { width: 64, height: 64 },
  }[difficult];
};

export const stringifyMaze = (maze: Maze): string => {
  const infoParsed = `${encodeURIComponent(maze.name)}:${encodeURIComponent(maze.configName)}`;
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

  return `${infoParsed}&${sizeParsed}&${metaParsed}&${areasParsed}`;
};

export const parseMaze = (parsed: string): Maze => {
  const [infoString, sizeString, metaString, areasString] = parsed.split('&');

  const [name, configName] = infoString.split(':');
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
    name: decodeURIComponent(name),
    configName: decodeURIComponent(configName),
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
