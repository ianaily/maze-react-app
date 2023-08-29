import fs from 'fs-extra';
import path from 'path';

export const saveConfig = async (_config) => {
  const config = { ..._config };
  const relativeDir = path.relative(process.cwd(), __dirname);
  const [datePostfix] = new Date().toLocaleString().split(',');
  const name = `${config.name.replace(/ /g, '_')}_${datePostfix}`;

  const configPath = path.join(relativeDir, 'configs', name);
  const spritesPath = path.join(configPath, 'sprites');
  const typesSpritesPath = path.join(spritesPath, 'types');
  const customTypesSpritesPath = path.join(spritesPath, 'customTypes');
  const wallsSpritesPath = path.join(spritesPath, 'walls');

  await fs.ensureDir(spritesPath);
  await fs.ensureDir(typesSpritesPath);
  await fs.ensureDir(customTypesSpritesPath);
  await fs.ensureDir(wallsSpritesPath);

  config.types.forEach((type, index) => {
    const spritePath = path.join(typesSpritesPath, type.name);
    fs.writeFile(spritePath, type.sprite);

    config.types[index].sprite = spritePath;
  });

  config.customTypes.map((type, index) => {
    const spritePath = path.join(customTypesSpritesPath, type.name);
    fs.writeFile(spritePath, type.sprite);

    config.customTypes[index].sprite = spritePath;
  });

  Object.keys(config.wallSprites).map((wallDirection) => {
    const spritePath = path.join(wallsSpritesPath, wallDirection);
    fs.writeFile(spritePath, config.wallSprites[wallDirection]);

    config.wallSprites[wallDirection] = spritePath;
  });

  await fs.writeJson(path.join(configPath, 'config.json'), config);
};
