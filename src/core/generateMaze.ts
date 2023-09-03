import { Area, AreaType, Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { AreaTypes } from 'src/const/areaTypes';
import { mazeUtils } from 'src/utils/mazeUtils';
import { random } from 'src/utils/random';
import { toBottom, toLeft, toRight, toTop, updatePoint } from 'src/utils/pointUtils';

export const generateMaze = (maze: Maze) => {
  const { setAreaType, getAreaType, fillEmpty } = mazeUtils(maze);
  const { width, height } = maze.size;
  let enterPort: Point;
  let exitPort: Point;
  let center: Area;

  generate();

  function generate() {
    fillEmpty();
    generatePorts();
    generateLeftPaths();
    generateMainPath();
  }

  function generatePorts() {
    enterPort = buildPortPoint(maze.enter);
    exitPort = buildPortPoint(maze.exit);
    center = maze.center;

    setAreaType(enterPort, AreaTypes.Thread);
    setAreaType(exitPort, AreaTypes.Thread);
  }

  function generateMainPath() {
    const center2 = {
      x: random(width - (8 % width)) + (4 % height),
      y: random(height - (8 % height)) + (4 % height),
    };
    setAreaType(center2, AreaTypes.Center);
    generatePath(enterPort, center, AreaTypes.Thread, calcMinMoves(enterPort, center));
    generatePath(center, center2, AreaTypes.Thread, calcMinMoves(center, center2));
    generatePath(center2, exitPort, AreaTypes.Thread, calcMinMoves(center, exitPort));
  }

  function generateLeftPaths() {
    const point1 = {
      x: random(width - (8 % width)) + (4 % height),
      y: random(height - (8 % height)) + (4 % height),
    };
    const point2 = {
      x: random(width - (8 % width)) + (4 % height),
      y: random(height - (8 % height)) + (4 % height),
    };

    generatePath(enterPort, point1, AreaTypes.Way, random((width * height) / 3));
    generatePath(enterPort, point2, AreaTypes.Way, random((width * height) / 3));
    generatePath(point1, point2, AreaTypes.Way, random((width * height) / 3));
  }

  function buildPortPoint(point: Point): Point {
    // prettier-ignore
    return {
      x: point.x === 0
        ? 1 : point.x === width - 1
          ? toLeft(point).x : point.x,
      y: point.y === 0
        ? 1 : point.y === height - 1
          ? toTop(point).y : point.y,
    };
  }

  function calcMinMoves(fromPoint: Point, toPoint: Point): number {
    const minMoves = Math.abs(fromPoint.x - toPoint.x) + Math.abs(fromPoint.y - toPoint.y);
    const additionalMultiplierByWidth = random(width / 5) + 1;
    const additionalMultiplierByHeight = random(height / 5) + 1;

    return additionalMultiplierByWidth * additionalMultiplierByHeight + minMoves;
  }

  function generatePath(from: Point, end: Point, type: AreaType, stepsCount: number) {
    const current = { ...from };
    const maxChance = width / 2;

    for (let step = stepsCount; ; step--) {
      const distance = Math.abs(end.y - current.y) + Math.abs(end.x - current.x);
      const chanceToEnd = random(maxChance) === 1;

      if (step <= distance) {
        break;
      }

      if (chanceToEnd) {
        initNextArea(current, end, type);
      } else {
        const chance = random(100);

        chance >= 0 && chance < 25 && initBottomArea(current, type);
        chance >= 25 && chance < 50 && initTopArea(current, type);
        chance >= 50 && chance < 75 && initLeftArea(current, type);
        chance >= 75 && initRightArea(current, type);
      }
    }

    const checkDone = (a: number, b: number) => Math.abs(a - b) < 2;

    while (!checkDone(current.x, end.x) || !checkDone(current.y, end.y)) {
      initNextArea(current, end, type);
    }
  }

  function initBottomArea(current: Point, type: AreaType) {
    if (isBorder(current)) {
      return;
    }

    const notSameBottomRight = getAreaType(toBottom(toRight(current))).name !== type.name;
    const notSameBottomLeft = getAreaType(toBottom(toLeft(current))).name !== type.name;

    // prettier-ignore
    notSameBottomRight && notSameBottomLeft
      && updatePoint(current, toBottom)
      && setAreaType(current, type);
  }

  function initTopArea(current: Point, type: AreaType) {
    if (isBorder(current)) {
      return;
    }

    const notSameTopRight = getAreaType(toTop(toRight(current))).name !== type.name;
    const notSameTopLeft = getAreaType(toTop(toLeft(current))).name !== type.name;

    // prettier-ignore
    notSameTopRight && notSameTopLeft
      && updatePoint(current, toTop)
      && setAreaType(current, type);
  }

  function initLeftArea(current: Point, type: AreaType) {
    if (isBorder(current)) {
      return;
    }

    const notSameTopLeft = getAreaType(toLeft(toTop(current))).name !== type.name;
    const notSameBottomLeft = getAreaType(toLeft(toBottom(current))).name !== type.name;

    // prettier-ignore
    notSameTopLeft && notSameBottomLeft
      && updatePoint(current, toLeft)
      && setAreaType(current, type);
  }

  function initRightArea(current: Point, type: AreaType) {
    if (isBorder(current)) {
      return;
    }

    const notSameTopRight = getAreaType(toRight(toTop(current))).name !== type.name;
    const notSameBottomRight = getAreaType(toRight(toBottom(current))).name !== type.name;

    // prettier-ignore
    notSameTopRight && notSameBottomRight
      && updatePoint(current, toRight)
      && setAreaType(current, type);
  }

  function initNextArea(current: Point, end: Point, type: AreaType) {
    current.y > end.y && updatePoint(current, toTop) && setAreaType(current, type);
    current.x < end.x && updatePoint(current, toRight) && setAreaType(current, type);
    current.y < end.y && updatePoint(current, toBottom) && setAreaType(current, type);
    current.x > end.x && updatePoint(current, toLeft) && setAreaType(current, type);
  }

  function isBorder(current: Point) {
    return (
      toTop(current).y < 1 ||
      toRight(current).x >= width - 1 ||
      toBottom(current).y >= height - 1 ||
      toLeft(current).x < 1
    );
  }

  return maze;
};
