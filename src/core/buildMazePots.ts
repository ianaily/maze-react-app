import { Size } from 'src/types/size';
import { Point } from 'src/types/point';
import { Area, AreaTypes, Maze } from 'src/types/maze';
import { random, randomBoolean } from 'src/utils/random';

export const buildMazePots = ({ width, height }: Size, name?: string): Maze => {
  return {
    name: name || '_',
    size: { width, height },
    areas: [],
    center: buildCenterArea(),
    ...buildInOutAreas(),
  };

  function buildCenterArea(): Area {
    const x = random(width - (8 % width)) + (4 % height);
    const y = random(height - (8 % height)) + (4 % height);

    return { x, y, type: AreaTypes.Thread };
  }

  function buildInOutAreas(): { enter: Area; exit: Area } {
    const exit: Point = buildBorderPoint(width, height);
    let enter: Point = { x: 0, y: 0 };
    let needToReGenerate = true;

    while (needToReGenerate) {
      enter = buildBorderPoint(width, height);

      const horizontalDistanceIsCorrect = Math.abs(enter.x - exit.x) < width / 3;
      const verticalDistanceIsCorrect = Math.abs(enter.y - exit.y) < height / 3;
      const distanceIsCorrect = horizontalDistanceIsCorrect && verticalDistanceIsCorrect;
      const isSame = enter.x === exit.x || enter.y === exit.y;

      needToReGenerate = isSame || distanceIsCorrect;
    }

    return {
      enter: {
        ...enter,
        type: AreaTypes.Enter,
      },
      exit: {
        ...exit,
        type: AreaTypes.Exit,
      },
    };
  }

  function buildBorderPoint(width: number, height: number): Point {
    const isHorizontal = randomBoolean();

    if (isHorizontal) {
      const isRight = randomBoolean();

      return {
        x: isRight ? 0 : width - 1,
        y: random(height - 3, 0) + 1,
      };
    } else {
      const isTop = randomBoolean();

      return {
        x: random(width - 3, 0) + 1,
        y: isTop ? 0 : height - 1,
      };
    }
  }
};
