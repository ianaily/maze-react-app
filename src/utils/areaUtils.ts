import { AreaType, AreaTypes } from 'src/types/maze';

const areaTypes = Object.keys(AreaTypes);

export const getNextAreaType = (typeName: string): AreaType => {
  const typeIndex = areaTypes.indexOf(typeName);
  const newTypeIndex = typeIndex + 1 > areaTypes.length - 1 ? 0 : typeIndex + 1;
  const typeKey = areaTypes[newTypeIndex];

  return AreaTypes[typeKey];
};

export const areaTypeByShort = (shortSymbol: string): AreaType =>
  Object.values(AreaTypes).find((areaType) => areaType.short === shortSymbol) || AreaTypes.Wall;
