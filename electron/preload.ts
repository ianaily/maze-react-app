import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const api = {};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('electronAPI', {
      saveConfig: (config) => ipcRenderer.invoke('app:save-config', config),
      loadConfig: (configPath) => ipcRenderer.invoke('app:load-config', configPath),
      loadConfigs: () => ipcRenderer.invoke('app:load-configs'),
      deleteConfig: (configPath) => ipcRenderer.invoke('app:delete-config', configPath),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron = electronAPI;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api = api;
}
