import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electronAPI: any;
    electron: ElectronAPI;
    api: unknown;
  }
}
