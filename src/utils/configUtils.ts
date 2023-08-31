import { Config } from 'src/types/config';
import { AreaType } from 'src/types/maze';

export const getAreaConfigByType = (config: Config, areaType: AreaType) =>
  config.types.find((configType) => configType.name === areaType.name) ||
  config.customTypes.find((customType) => customType.name === areaType.name);
