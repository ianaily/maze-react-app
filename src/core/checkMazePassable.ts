import { Fork } from 'src/types/fork';
import { Point } from 'src/types/point';
import { Direction } from 'src/types/direction';
import { AreaType, AreaTypes, Maze } from 'src/types/maze';
import { toBottom, toDirection, toLeft, toRight, toTop, updatePoint } from 'src/utils/pointUtils';
import { addDirections, isNoWayFork, popFork } from 'src/utils/forkUtils';
import { mazeUtils } from 'src/utils/mazeUtils';

export const checkMazePassable = (maze: Maze) => {
  let forks: Fork[] = [];
  let position: Point = maze.enter;
  let target: Point = maze.exit;
  let moveNum = 0;
  const history: Point[] = [];
  const { getAreaType, setAreaType } = mazeUtils({ ...maze });

  const check = (): boolean => {
    const maxMoves = maze.size.width * maze.size.height;
    history.push(position);

    while (!checkFinish()) {
      try {
        step();
        moveNum++;
        history.push(position);
      } catch {
        return false;
      }

      if (moveNum > maxMoves) {
        return false;
      }
    }

    return true;
  };

  const step = () => {
    const fork = getFork();

    position = getPosition(fork);
    markAreaPassed(position);

    if (!isNoWayFork(fork)) {
      forks.push(fork);
    }

    removeEmptyForks();
  };

  const getPosition = (fork: Fork) => {
    if (isNoWayFork(fork)) {
      toLastFork();
      if (isNoWayFork(fork)) {
        throw Error('Dead end');
      }

      const newPosition = popFork(forks[forks.length - 1]);

      if (!newPosition) {
        throw Error('Dead end');
      } else {
        return newPosition;
      }
    } else {
      const newPosition = popFork(fork);

      if (!newPosition) {
        throw Error('Dead end');
      } else {
        return newPosition;
      }
    }
  };

  const getFork = (): Fork => initForkDirections({ point: position });

  const initForkDirections = (fork: Fork): Fork => {
    checkType([AreaTypes.Thread, AreaTypes.Center], 'top') && addDirections(fork, 'top');
    checkType([AreaTypes.Thread, AreaTypes.Center], 'right') && addDirections(fork, 'right');
    checkType([AreaTypes.Thread, AreaTypes.Center], 'bottom') && addDirections(fork, 'bottom');
    checkType([AreaTypes.Thread, AreaTypes.Center], 'left') && addDirections(fork, 'left');

    return fork;
  };

  const removeEmptyForks = () => {
    forks = forks.filter((fork) => {
      const updated = initForkDirections({ ...fork });

      return !isNoWayFork(updated);
    });
  };

  const initTargetPoint = () => {
    if (!forks.length) {
      throw Error('Dead end');
    }

    target = forks[forks.length - 1].point;
  };

  const toLastFork = () => {
    initTargetPoint();
    toTarget();
    target = maze.exit;
  };

  const toTarget = () => {
    let attempts = (maze.size.width + maze.size.height) * 2;
    // prettier-ignore
    while (position.x !== target.x && position.y !== target.y) {
      position.x < target.x &&
        checkPassable('right') &&
        markAreaPassed(updatePoint(position, toRight));
      position.x > target.x &&
        checkPassable('left') &&
        markAreaPassed(updatePoint(position, toLeft));
      position.y < target.y &&
        checkPassable('bottom') &&
        markAreaPassed(updatePoint(position, toBottom));
      position.y > target.y &&
        checkPassable('top') &&
        markAreaPassed(updatePoint(position, toTop));

      if (!attempts--) {
        throw Error('Bot Lost');
      }
    }
  };

  const markAreaPassed = (position: Point) => {
    setAreaType(position, AreaTypes.Way, true);
  };

  const checkType = (types: AreaType[], direction: Direction) => {
    const typeName = getAreaType(toDirection(position, direction))?.name;
    const typeNames = types.map((type) => type.name);

    return typeNames.includes(typeName);
  };

  const checkPassable = (direction: Direction) => {
    return getAreaType(toDirection(position, direction))?.passable;
  };

  const checkFinish = () =>
    checkType([AreaTypes.Exit], 'top') ||
    checkType([AreaTypes.Exit], 'right') ||
    checkType([AreaTypes.Exit], 'bottom') ||
    checkType([AreaTypes.Exit], 'left');

  return { isChecked: check(), history };
};
