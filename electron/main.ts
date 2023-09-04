import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { join } from 'path';
import appIcon from '../public/favicon.ico?asset';
import { deleteConfig, loadConfig, loadConfigs, saveConfig } from './io';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    icon: appIcon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: false,
      sandbox: false,
      enableWebSQL: true,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  ipcMain.handle('app:save-config', (_, config) => {
    return saveConfig(config);
  });

  ipcMain.handle('app:load-config', (_, configPath) => {
    return loadConfig(configPath);
  });

  ipcMain.handle('app:load-configs', () => {
    return loadConfigs();
  });

  ipcMain.handle('app:delete-config', (_, configPath) => {
    return deleteConfig(configPath);
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// app.on('ready', createWindow);
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.lmripu');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
