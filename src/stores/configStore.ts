import { makeAutoObservable } from 'mobx';
import { Config, ConfigInfo } from 'src/types/config';

type LoadConfig = { config: Config; configPath: string };

export class ConfigStore {
  constructor() {
    makeAutoObservable(this);
  }

  configsInfo: ConfigInfo[] = [];
  config: Config | null = null;

  saveConfig = async (config: Config) => {
    await window.electronAPI.saveConfig(config);
    await this.loadConfigs();
  };

  loadConfigs = async () => {
    const configs: LoadConfig[] = await window.electronAPI.loadConfigs();

    this.configsInfo = configs.map(({ config, configPath }) => ({
      name: config.name,
      configPath: configPath,
      customTypesCount: config.customTypes.length,
    }));
  };

  loadConfig = async (configPath: string) => {
    this.config = await window.electronAPI.loadConfig(configPath);
  };

  deleteConfig = async (configPath: string) => {
    await window.electronAPI.deleteConfig(configPath);
    await this.loadConfigs();
  };
}

export default new ConfigStore();
