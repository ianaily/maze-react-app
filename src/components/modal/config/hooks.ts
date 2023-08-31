import React from 'react';
import { AreaConfig } from 'src/types/config';
import { initialWallType } from 'src/const/config';

export const useValidate = (configName, types, customTypes) => {
  const isUniq = React.useCallback(
    (key: string, value: string) => {
      const customUniq = customTypes.filter((type) => type[key] === value);
      const typesUniq = types.filter((type) => type[key] === value);
      const wallUniq = initialWallType[key] !== value;

      return typesUniq.length === 0 && wallUniq && customUniq.length <= 1;
    },
    [customTypes],
  );

  const isValidName = (value: string) => isUniq('name', value);

  const isValidShort = (value: string) => isUniq('short', value) && value !== '&';

  const isValidColor = (value: string) => {
    const colorHexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    return isUniq('color', value) && colorHexRegex.test(value);
  };

  const isUniqRow = React.useCallback(
    (item: AreaConfig) =>
      isUniq('name', item.name) && isValidShort(item.short) && isValidColor(item.color),
    [isUniq],
  );

  const isValid = React.useMemo(
    () => customTypes.every((type) => isUniqRow(type)) && configName.length,
    [customTypes],
  );

  return {
    isValidType: isUniqRow,
    isValidName,
    isValidShort,
    isValidColor,
    isValid,
  };
};
