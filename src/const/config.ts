import { AreaTypeKeys } from 'src/types/maze';
import { WallDirections } from 'src/types/direction';
import { Config } from 'src/types/config';
import { areaFillColors, AreaTypes } from './areaTypes';
import { walls } from './spritesMap';

export const selectedConfigKey = 'selectedConfig';

export const initialTypes = [
  AreaTypes.Center,
  AreaTypes.Way,
  AreaTypes.Thread,
  AreaTypes.Enter,
  AreaTypes.Exit,
];

export const initialWallType = {
  ...AreaTypes.Wall,
  color: areaFillColors[AreaTypeKeys.Wall],
  sprite: walls[WallDirections.middleMiddle],
};

export const initialWalls = { ...walls };

export const defaultConfig: Config = {
  name: 'default',
  customTypes: [],
  types: [...initialTypes, initialWallType],
  wallSprites: initialWalls,
};
