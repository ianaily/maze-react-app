import { Area, AreaType, AreaTypes, Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { mazeUtils } from 'src/utils/mazeUtils';
import { random } from 'src/utils/random';
import { toBottom, toLeft, toRight, toTop, updatePoint } from 'src/utils/pointUtils';

export const generateMaze = (maze: Maze) => {
  const { setAreaType, getAreaType, fillEmpty } = mazeUtils(maze);
  let enterPort: Point;
  let exitPort: Point;
  let center: Area;

  generateMaze();

  function generateMaze() {
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
    const c2 = {
      x: random(maze.width - (8 % maze.width)) + (4 % maze.height),
      y: random(maze.height - (8 % maze.height)) + (4 % maze.height),
    };
    setAreaType(c2, AreaTypes.Center);
    generatePath(enterPort, center, AreaTypes.Thread, calcMinMoves(enterPort, center));
    generatePath(center, exitPort, AreaTypes.Thread, calcMinMoves(center, exitPort));
  }

  function generateLeftPaths() {
    // todo write random points with cycle
    // todo from: enter, center and some random
    const c2 = {
      x: random(maze.width - (8 % maze.width)) + (4 % maze.height),
      y: random(maze.height - (8 % maze.height)) + (4 % maze.height),
    };
    const c3 = {
      x: random(maze.width - (8 % maze.width)) + (4 % maze.height),
      y: random(maze.height - (8 % maze.height)) + (4 % maze.height),
    };

    generatePath(enterPort, c2, AreaTypes.Way, random((maze.width * maze.height) / 3));
    generatePath(enterPort, c3, AreaTypes.Way, random((maze.width * maze.height) / 3));
    generatePath(center, c2, AreaTypes.Way, random((maze.width * maze.height) / 3));
  }

  function buildPortPoint(point: Point): Point {
    // prettier-ignore
    return {
      x: point.x === 0
        ? 1 : point.x === maze.width - 1
          ? toLeft(point).x : point.x,
      y: point.y === 0
        ? 1 : point.y === maze.height - 1
          ? toTop(point).y : point.y,
    };
  }

  function calcMinMoves(fromPoint: Point, toPoint: Point): number {
    const minMoves = Math.abs(fromPoint.x - toPoint.x) + Math.abs(fromPoint.y - toPoint.y);
    const additionalMultiplier = random(maze.height / 2) + 1;

    return maze.width * additionalMultiplier + minMoves;
  }

  function generatePath(from: Point, end: Point, type: AreaType, stepsCount: number) {
    const current = { ...from };
    const maxChance = maze.width / 2;
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

    for (let a = 500; a > 0; a--) {
      initNextArea(current, end, type);

      if (!checkDone(current.x, end.x) || !checkDone(current.y, end.y)) {
        return;
      }
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
      toRight(current).x >= maze.width - 1 ||
      toBottom(current).y >= maze.height - 1 ||
      toLeft(current).x < 1
    );
  }

  return maze;
};
