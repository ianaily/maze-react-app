import { AreaType } from './maze';
import { WallDirections } from './direction';

export interface AreaConfig extends AreaType {
  color: string;
  sprite: string;
}

export interface Config {
  name: string;
  types: AreaConfig[];
  wallSprites: { [key in WallDirections]: string };
  customTypes: AreaConfig[];
}

export interface ConfigInfo {
  name: string;
  configPath: string;
  customTypesCount: number;
}
