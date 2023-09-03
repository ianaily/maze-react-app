import { AreaType, AreaTypeKeys } from 'src/types/maze';
import { AreaConfig } from 'src/types/config';
import { AreaTypes } from 'src/const/areaTypes';

const areaTypes = Object.keys(AreaTypes) as (AreaTypeKeys | string)[];

export const getNextAreaType = (type: AreaConfig): AreaConfig => {
  const typeIndex = areaTypes.indexOf(type.name);
  const newTypeIndex = typeIndex + 1 > areaTypes.length - 1 ? 0 : typeIndex + 1;
  const typeKey = areaTypes[newTypeIndex];

  return AreaTypes[typeKey];
};

export const areaTypeByShort = (shortSymbol: string): AreaType =>
  Object.values(AreaTypes).find((areaType) => areaType.short === shortSymbol) || AreaTypes.Wall;
