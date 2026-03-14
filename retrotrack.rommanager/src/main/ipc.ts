import { ipcMain, dialog, BrowserWindow } from 'electron';
import {
  upsertConsoles,
  getAllConsoles,
  upsertTrackedGames,
  getAllTrackedGames,
  setSyncMeta,
  getSyncMeta,
  clearUserData,
  upsertPlaylists,
  getAllPlaylists,
  addScanFolder,
  getAllScanFolders,
  removeScanFolder,
  getAllScannedGames,
  getScannedGamesByFolder,
  removeScannedGamesByFolder,
} from './database';
import { scanFolder, scanFile, type ScanProgress } from './scanner';

export function registerIpcHandlers(): void {
  ipcMain.handle('db:upsert-consoles', (_event, consoles) => upsertConsoles(consoles));
  ipcMain.handle('db:get-consoles', () => getAllConsoles());
  ipcMain.handle('db:upsert-tracked-games', (_event, games) => upsertTrackedGames(games));
  ipcMain.handle('db:get-tracked-games', () => getAllTrackedGames());
  ipcMain.handle('db:set-sync-meta', (_event, key, value) => setSyncMeta(key, value));
  ipcMain.handle('db:get-sync-meta', (_event, key) => getSyncMeta(key));
  ipcMain.handle('db:clear-user-data', () => clearUserData());
  ipcMain.handle('db:upsert-playlists', (_event, playlists) => upsertPlaylists(playlists));
  ipcMain.handle('db:get-playlists', () => getAllPlaylists());

  // Scan folders
  ipcMain.handle('scan:browse-folder', async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return null;
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    });
    return result.canceled ? null : result.filePaths[0] ?? null;
  });

  ipcMain.handle('scan:browse-file', async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return null;
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [{ name: 'ROM Files', extensions: ['nes', 'sfc', 'smc', 'gb', 'gbc', 'gba', 'nds', 'md', 'gen', 'sms', 'gg', 'bin', 'cue', 'iso', 'chd', 'z64', 'n64', 'v64', 'pce', 'a26', 'a78', 'col', 'sg', 'ngp', 'ws', 'wsc', 'pbp', 'lnx', '32x', 'min', 'vec'] }],
    });
    return result.canceled ? null : result.filePaths[0] ?? null;
  });

  ipcMain.handle(
    'scan:scan-file',
    async (_event, filePath: string, consoleId: number, apiBaseUrl: string, accessToken: string) => {
      return scanFile(filePath, consoleId, apiBaseUrl, accessToken);
    },
  );

  ipcMain.handle('scan:add-folder', (_event, folderPath: string, consoleId: number, consoleName: string) => {
    addScanFolder(folderPath, consoleId, consoleName);
    return getAllScanFolders();
  });

  ipcMain.handle('scan:get-folders', () => getAllScanFolders());

  ipcMain.handle('scan:remove-folder', (_event, folderPath: string, consoleId: number) => {
    removeScannedGamesByFolder(folderPath);
    removeScanFolder(folderPath, consoleId);
    return getAllScanFolders();
  });

  ipcMain.handle('scan:get-scanned-games', () => getAllScannedGames());
  ipcMain.handle('scan:get-scanned-games-by-folder', (_event, folderPath: string) =>
    getScannedGamesByFolder(folderPath),
  );

  ipcMain.handle(
    'scan:scan-folder',
    async (_event, folderPath: string, consoleId: number, apiBaseUrl: string, accessToken: string) => {
      const win = BrowserWindow.getFocusedWindow();
      const onProgress = (progress: ScanProgress) => {
        win?.webContents.send('scan:progress', progress);
      };
      return scanFolder(folderPath, consoleId, apiBaseUrl, accessToken, onProgress);
    },
  );
}
