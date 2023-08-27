import { AreaConfig } from 'src/types/config';
import { WallDirections } from 'src/types/direction';
import { AreaTypeKeys, AreaTypes } from 'src/types/maze';
import { spritesMap, walls } from 'src/const/spritesMap';
import { areaFillColors } from 'src/const/areaTypes';

export const initialTypes = [
  {
    ...AreaTypes.Center,
    color: areaFillColors[AreaTypeKeys.Center],
    sprite: spritesMap[AreaTypeKeys.Center],
  },
  {
    ...AreaTypes.Way,
    color: areaFillColors[AreaTypeKeys.Way],
    sprite: spritesMap[AreaTypeKeys.Way],
  },
  {
    ...AreaTypes.Thread,
    color: areaFillColors[AreaTypeKeys.Thread],
    sprite: spritesMap[AreaTypeKeys.Thread],
  },
  {
    ...AreaTypes.Enter,
    color: areaFillColors[AreaTypeKeys.Enter],
    sprite: spritesMap[AreaTypeKeys.Enter],
  },
  {
    ...AreaTypes.Exit,
    color: areaFillColors[AreaTypeKeys.Exit],
    sprite: spritesMap[AreaTypeKeys.Exit],
  },
];

export const initialWallType = {
  ...AreaTypes.Wall,
  color: areaFillColors[AreaTypeKeys.Wall],
  sprite: walls[WallDirections.middleMiddle],
};

export const initialWalls = { ...walls };

export const initialCustomTypes: AreaConfig[] = [];

export const initialCustomType: AreaConfig = {
  name: 'blank',
  short: '-',
  rewritable: false,
  passable: false,
  color: '#000',
  sprite: walls.narrowMiddle,
};
