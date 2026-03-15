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
  getAllEmulatorSettings,
  upsertAllEmulatorSettings,
  getGameEmulatorPref,
  setGameEmulatorPref,
  clearGameEmulatorPref,
} from './database';
import { scanFolder, scanFile, type ScanProgress } from './scanner';
import { clearImageCache } from './imageCache';
import { getLaunchContext, launchGame, type LaunchRequest } from './launcher';
import { startSession, getActiveSession, forceEndSession } from './sessionTracker';

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

  ipcMain.handle('scan:browse-executable', async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return null;
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [
        { name: 'Executables', extensions: ['exe'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    return result.canceled ? null : result.filePaths[0] ?? null;
  });

  ipcMain.handle('scan:auto-detect-exe', async (_event, folderPath: string, defaultExe: string) => {
    const fs = await import('fs');
    const pathMod = await import('path');
    // Try exact match first (with and without .exe)
    for (const name of [defaultExe, `${defaultExe}.exe`]) {
      const full = pathMod.default.join(folderPath, name);
      if (fs.existsSync(full)) return full;
    }
    // Scan folder for .exe files and return first match containing the base name
    try {
      const entries = fs.readdirSync(folderPath);
      const baseLower = defaultExe.toLowerCase().replace(/\.exe$/, '');
      const match = entries.find(
        (e) => e.toLowerCase().endsWith('.exe') && e.toLowerCase().includes(baseLower),
      );
      if (match) return pathMod.default.join(folderPath, match);
    } catch { /* folder might not exist */ }
    return null;
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

  ipcMain.handle('cache:clear-image-cache', () => clearImageCache());

  // Emulator settings
  ipcMain.handle('emu:get-settings', () => getAllEmulatorSettings());
  ipcMain.handle('emu:save-settings', (_event, settings) => upsertAllEmulatorSettings(settings));

  // Game emulator preferences (remember choice)
  ipcMain.handle('emu:get-game-pref', (_event, gameId: number) => getGameEmulatorPref(gameId));
  ipcMain.handle('emu:set-game-pref', (_event, gameId: number, emulatorId: number, coreId: number | null) =>
    setGameEmulatorPref(gameId, emulatorId, coreId),
  );
  ipcMain.handle('emu:clear-game-pref', (_event, gameId: number) => clearGameEmulatorPref(gameId));

  // Game launching
  ipcMain.handle('launch:get-context', (_event, gameId: number, consoleId: number, apiEmulators: unknown) =>
    getLaunchContext(gameId, consoleId, apiEmulators as Parameters<typeof getLaunchContext>[2]),
  );
  ipcMain.handle(
    'launch:launch-game',
    (
      _event,
      request: LaunchRequest & { gameTitle?: string; consoleName?: string; imageIcon?: string | null },
      apiEmulators: unknown,
    ) => {
      const result = launchGame(request, apiEmulators as Parameters<typeof launchGame>[1]);

      // If launch succeeded (returned PID), start session tracking
      if (typeof result === 'number') {
        startSession({
          gameId: request.gameId,
          gameTitle: request.gameTitle ?? 'Unknown Game',
          consoleName: request.consoleName ?? 'Unknown Console',
          imageIcon: request.imageIcon ?? null,
          pid: result,
        });
      }

      // Return true for success (PID) or the error string
      return typeof result === 'number' ? true : result;
    },
  );

  // Session tracking
  ipcMain.handle('session:get-active', () => {
    const session = getActiveSession();
    if (!session) return null;
    return {
      gameId: session.gameId,
      gameTitle: session.gameTitle,
      consoleName: session.consoleName,
      startedAt: session.startedAt,
    };
  });
  ipcMain.handle('session:force-end', () => forceEndSession());
}
