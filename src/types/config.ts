import { AreaType } from './maze';
import { Direction, WallDirections } from './direction';

export interface AreaConfig extends AreaType {
  color: string;
  sprite: string;
}

export interface Config {
  name: string;
  types: AreaConfig[];
  customTypes: AreaConfig[];
  wallSprites: { [key in WallDirections]: string };
  charSprites: { [key in Direction]: string };
}

export interface ConfigInfo {
  name: string;
  configPath: string;
  customTypesCount: number;
}
