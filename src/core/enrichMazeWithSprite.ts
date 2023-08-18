import { walls } from 'src/const/spritesMap';
import { mazeUtils } from 'src/utils/mazeUtils';
import { toDirection } from 'src/utils/pointUtils';
import { Area, AreaType, AreaTypeKeys, Maze } from 'src/types/maze';
import Way from 'src/assets/sprites/way.png';
import Door from 'src/assets/sprites/door.png';

const spritesMap: { [key: string]: string } = {
  [AreaTypeKeys.Way]: Way,
  [AreaTypeKeys.Thread]: Way,
  [AreaTypeKeys.Center]: Way,
  [AreaTypeKeys.Enter]: Door,
  [AreaTypeKeys.Exit]: Door,
};

export const enrichMazeWithSprite = (maze: Maze) => {
  const { getAreaType } = mazeUtils(maze);

  const enrich = () => {
    return maze.areas.map((area) => {
      const sprite = spritesMap[area.type.name];

      if (sprite) {
        return { ...area, sprite };
      } else {
        return { ...area, sprite: getWallSprite(area) };
      }
    });
  };

  const getWallSprite = (area: Area) => {
    const neighborTop = getAreaType(toDirection(area, 'top'));
    const neighborRight = getAreaType(toDirection(area, 'right'));
    const neighborBottom = getAreaType(toDirection(area, 'bottom'));
    const neighborLeft = getAreaType(toDirection(area, 'left'));

    return (
      enrichWithWallByOrientation(
        [neighborTop, neighborRight, neighborBottom, neighborLeft],
        [],
        walls.middleMiddle,
      ) ||
      enrichWithWallByOrientation(
        [],
        [neighborTop, neighborRight, neighborBottom, neighborLeft],
        walls.narrowMiddle,
      ) ||
      enrichWithWallByOrientation(
        [neighborTop, neighborBottom],
        [neighborRight, neighborLeft],
        walls.narrowVertical,
      ) ||
      enrichWithWallByOrientation(
        [neighborRight, neighborLeft],
        [neighborTop, neighborBottom],
        walls.narrowHorizontal,
      ) ||
      enrichWithWallByOrientation(
        [neighborTop],
        [neighborRight, neighborBottom, neighborLeft],
        walls.narrowBottom,
      ) ||
      enrichWithWallByOrientation(
        [neighborRight],
        [neighborTop, neighborBottom, neighborLeft],
        walls.narrowLeft,
      ) ||
      enrichWithWallByOrientation(
        [neighborBottom],
        [neighborTop, neighborRight, neighborLeft],
        walls.narrowTop,
      ) ||
      enrichWithWallByOrientation(
        [neighborLeft],
        [neighborTop, neighborRight, neighborBottom],
        walls.narrowRight,
      ) ||
      enrichWithWallByDirection(
        [neighborTop, neighborBottom, neighborLeft, neighborRight],
        [walls.topMiddle, walls.topRight, walls.topLeft],
      ) ||
      enrichWithWallByDirection(
        [neighborRight, neighborLeft, neighborTop, neighborBottom],
        [walls.middleRight, walls.bottomRight, walls.topRight],
      ) ||
      enrichWithWallByDirection(
        [neighborBottom, neighborTop, neighborRight, neighborLeft],
        [walls.bottomMiddle, walls.bottomLeft, walls.bottomRight],
      ) ||
      enrichWithWallByDirection(
        [neighborLeft, neighborRight, neighborTop, neighborBottom],
        [walls.middleLeft, walls.bottomLeft, walls.topLeft],
      ) ||
      walls.narrowMiddle
    );
  };

  return enrich();
};

const enrichWithWallByOrientation = (areWall: AreaType[], notWall: AreaType[], spite: string) =>
  neighborsAreWall(areWall) && neighborsAreNotWall(notWall) && spite;

const enrichWithWallByDirection = (
  [direct, opposite, beside1, beside2]: AreaType[],
  [spriteMiddle, spriteBeside2, spriteBeside1]: string[],
) => {
  if (isWall(direct)) {
    return;
  }
  if (neighborsAreWall([opposite, beside1, beside2])) {
    return spriteMiddle;
  } else if (neighborsAreWall([beside1, opposite])) {
    return spriteBeside2;
  } else if (neighborsAreWall([beside2, opposite])) {
    return spriteBeside1;
  }
};

const neighborsAreWall = (areas: AreaType[]) => areas.every((area) => isWall(area));

const neighborsAreNotWall = (areas: AreaType[]) => areas.every((area) => !isWall(area));

const isWall = (area?: AreaType) =>
  area && [AreaTypeKeys.Wall, AreaTypeKeys.Enter, AreaTypeKeys.Exit].includes(area.name);
