import fs from 'fs-extra';
import path from 'path';

const configsPath = path.join(__dirname, 'configs');

export const saveConfig = async (_config) => {
  const config = { ..._config };
  const name = config.name.replace(/ /g, '_');

  const configPath = path.join(configsPath, name);
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

const getConfigPacks = async () =>
  new Promise((resolve) => {
    fs.readdir(configsPath, { withFileTypes: true }, (err, files = []) => {
      if (err) {
        fs.ensureDir(configsPath);
        resolve([]);
      }

      resolve(files.filter((file) => file.isDirectory()));
    });
  });

const getConfigFiles = async (configDirs) =>
  Promise.all(configDirs.map((configDir) => loadConfig(path.join(configsPath, configDir.name))));

const getConfig = (configPath) =>
  new Promise((resolve, reject) => {
    fs.readdir(configPath, { withFileTypes: true }, (err, files = []) => {
      err && reject(err);

      const configFile = files.find((file) => file.name === 'config.json');

      fs.readJson(path.join(configPath, configFile.name)).then((config) => {
        config.types = config.types.map((type) => {
          type.sprite = fs.readFileSync(type.sprite, 'utf8');
          return type;
        });
        config.customTypes = config.customTypes.map((type) => {
          type.sprite = fs.readFileSync(type.sprite, 'utf8');
          return type;
        });
        Object.keys(config.wallSprites).forEach(
          (key) => (config.wallSprites[key] = fs.readFileSync(config.wallSprites[key], 'utf8')),
        );
        resolve({ config, configPath });
      });
    });
  });

export const loadConfigs = async () => {
  const configPacks = await getConfigPacks();
  return await getConfigFiles(configPacks);
};

export const loadConfig = async (configPath) => getConfig(configPath);

export const deleteConfig = async (configPath) => {
  await fs.remove(configPath);
};
