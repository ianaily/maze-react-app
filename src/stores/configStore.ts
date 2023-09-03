import { makeAutoObservable } from 'mobx';
import localforage from 'localforage';
import { AreaType } from 'src/types/maze';
import { AreaConfig, Config, ConfigInfo } from 'src/types/config';
import { defaultConfig, selectedConfigKey } from 'src/const/config';
import { getAreaConfigByType } from 'src/utils/configUtils';

type LoadConfig = { config: Config; configPath: string };

export class ConfigStore {
  constructor() {
    makeAutoObservable(this);
    this.saveConfig(defaultConfig).then();
    this.preloadConfig().then();
  }

  configsInfo: ConfigInfo[] = [];
  config: Config = defaultConfig;
  areaTypes: AreaConfig[] = [];

  preloadConfig = async () => {
    const configPath = await localforage.getItem<string | null>(selectedConfigKey);
    !configPath && (await this.loadConfig(defaultConfig.name));
    configPath && (await this.loadConfig(configPath));
  };

  saveConfig = async (config: Config) => {
    await window.electronAPI?.saveConfig(config);
    await this.loadConfigs();
  };

  loadConfigs = async () => {
    const configs: LoadConfig[] = await window.electronAPI?.loadConfigs();

    this.configsInfo = configs.map(({ config, configPath }) => ({
      name: config.name,
      configPath: configPath,
      customTypesCount: config.customTypes.length,
    }));
  };

  loadConfig = async (configPath: string) => {
    const { config } = await window.electronAPI?.loadConfig(configPath);

    if (!config) {
      return;
    }

    this.config = config;

    await localforage.setItem<string>(selectedConfigKey, configPath);
    this.areaTypes = [...config.types, ...config.customTypes];
  };

  deleteConfig = async (configPath: string) => {
    await window.electronAPI?.deleteConfig(configPath);
    await this.loadConfigs();
  };

  getAreaConfigByType(type: AreaType) {
    return getAreaConfigByType(this.config, type);
  }
}

export default new ConfigStore();
