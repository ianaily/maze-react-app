import { AreaConfig } from 'src/types/config';
import { AreaTypeKeys, AreaTypes } from 'src/types/maze';
import { spritesMap, walls } from 'src/const/spritesMap';
import { areaFillColors } from 'src/const/areaTypes';

export const initialTypes = {
  [AreaTypeKeys.Center]: {
    ...AreaTypes.Center,
    color: areaFillColors[AreaTypeKeys.Center],
    sprite: spritesMap[AreaTypeKeys.Center],
  },
  [AreaTypeKeys.Way]: {
    ...AreaTypes.Way,
    color: areaFillColors[AreaTypeKeys.Way],
    sprite: spritesMap[AreaTypeKeys.Way],
  },
  [AreaTypeKeys.Thread]: {
    ...AreaTypes.Thread,
    color: areaFillColors[AreaTypeKeys.Thread],
    sprite: spritesMap[AreaTypeKeys.Thread],
  },
  [AreaTypeKeys.Enter]: {
    ...AreaTypes.Enter,
    color: areaFillColors[AreaTypeKeys.Enter],
    sprite: spritesMap[AreaTypeKeys.Enter],
  },
  [AreaTypeKeys.Exit]: {
    ...AreaTypes.Exit,
    color: areaFillColors[AreaTypeKeys.Exit],
    sprite: spritesMap[AreaTypeKeys.Exit],
  },
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
