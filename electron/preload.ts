import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const api = {};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
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
