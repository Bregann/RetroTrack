import { ipcMain } from 'electron';
import {
  upsertConsoles,
  getAllConsoles,
  upsertTrackedGames,
  getAllTrackedGames,
  setSyncMeta,
  getSyncMeta,
  clearUserData,
} from './database';

export function registerIpcHandlers(): void {
  ipcMain.handle('db:upsert-consoles', (_event, consoles) => upsertConsoles(consoles));
  ipcMain.handle('db:get-consoles', () => getAllConsoles());
  ipcMain.handle('db:upsert-tracked-games', (_event, games) => upsertTrackedGames(games));
  ipcMain.handle('db:get-tracked-games', () => getAllTrackedGames());
  ipcMain.handle('db:set-sync-meta', (_event, key, value) => setSyncMeta(key, value));
  ipcMain.handle('db:get-sync-meta', (_event, key) => getSyncMeta(key));
  ipcMain.handle('db:clear-user-data', () => clearUserData());
}
