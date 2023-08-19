import { Fork } from 'src/types/fork';
import { Point } from 'src/types/point';
import { Direction } from 'src/types/direction';
import { toBottom, toLeft, toRight, toTop } from './pointUtils';

export const getForkDirectionsCount = (fork: Fork): number => {
  let count = 0;

  fork.top && (count += 1);
  fork.right && (count += 1);
  fork.bottom && (count += 1);
  fork.left && (count += 1);

  return count;
};

export const isNoWayFork = (fork: Fork) => !getForkDirectionsCount(fork);

export const popFork = (fork: Fork): Point | undefined => {
  if (fork.top) {
    const value = { ...fork.top };
    fork.top = undefined;

    return value;
  }
  if (fork.right) {
    const value = { ...fork.right };
    fork.right = undefined;

    return value;
  }
  if (fork.bottom) {
    const value = { ...fork.bottom };
    fork.bottom = undefined;

    return value;
  }
  if (fork.left) {
    const value = { ...fork.left };
    fork.left = undefined;

    return value;
  }

  return;
};

export const addDirections = (fork: Fork, direction: Direction) => {
  direction === 'top' && (fork.top = toTop(fork.point));
  direction === 'right' && (fork.right = toRight(fork.point));
  direction === 'bottom' && (fork.bottom = toBottom(fork.point));
  direction === 'left' && (fork.left = toLeft(fork.point));

  return fork;
};
