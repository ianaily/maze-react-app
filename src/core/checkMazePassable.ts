import { Fork } from 'src/types/fork';
import { Point } from 'src/types/point';
import { Direction } from 'src/types/direction';
import { AreaType, AreaTypes, Maze } from 'src/types/maze';
import { toDirection } from 'src/utils/pointUtils';
import { addDirections, isNoWayFork, popFork } from 'src/utils/forkUtils';
import { mazeUtils } from 'src/utils/mazeUtils';

export const checkMazePassable = (maze: Maze) => {
  let forks: Fork[] = [];
  let position: Point = maze.enter;
  let target: Point = maze.exit;
  let moveNum = 0;
  const moveHistory: Point[] = [];
  const { getAreaType, setAreaType } = mazeUtils({ ...maze });

  const check = (): boolean => {
    const maxMoves = maze.size.width * maze.size.height;

    while (!checkFinish()) {
      try {
        step();
        moveNum++;
        moveHistory.push(position);
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
      return moveToLastFork();
    } else {
      return moveToNextFork(fork);
    }
  };

  const moveToLastFork = () => {
    toLastFork();
    removeEmptyForks();

    const lastFork = forks[forks.length - 1];

    if (isNoWayFork(lastFork)) {
      throw Error('Dead end');
    }

    const newPosition = popFork(lastFork);

    if (!newPosition) {
      throw Error('Dead end');
    } else {
      return newPosition;
    }
  };

  const moveToNextFork = (fork: Fork) => {
    const newPosition = popFork(fork);

    if (!newPosition) {
      throw Error('Dead end');
    } else {
      return newPosition;
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
    for (let index = moveHistory.length - 1; index >= 0; index--) {
      const isReturnToTarget = position.x === target.x && position.y === target.y;

      if (isReturnToTarget) {
        break;
      } else {
        position = moveHistory[index];
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

  const checkFinish = () =>
    checkType([AreaTypes.Exit], 'top') ||
    checkType([AreaTypes.Exit], 'right') ||
    checkType([AreaTypes.Exit], 'bottom') ||
    checkType([AreaTypes.Exit], 'left');

  return { isChecked: check(), moveHistory };
};
