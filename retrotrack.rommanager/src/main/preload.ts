// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'window-minimize' | 'window-maximize' | 'window-close' | 'scan:progress';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  db: {
    upsertConsoles: (consoles: unknown[]) =>
      ipcRenderer.invoke('db:upsert-consoles', consoles),
    getConsoles: () => ipcRenderer.invoke('db:get-consoles'),
    upsertTrackedGames: (games: unknown[]) =>
      ipcRenderer.invoke('db:upsert-tracked-games', games),
    getTrackedGames: () => ipcRenderer.invoke('db:get-tracked-games'),
    setSyncMeta: (key: string, value: string) =>
      ipcRenderer.invoke('db:set-sync-meta', key, value),
    getSyncMeta: (key: string) => ipcRenderer.invoke('db:get-sync-meta', key),
    clearUserData: () => ipcRenderer.invoke('db:clear-user-data'),
    upsertPlaylists: (playlists: unknown[]) =>
      ipcRenderer.invoke('db:upsert-playlists', playlists),
    getPlaylists: () => ipcRenderer.invoke('db:get-playlists'),
  },
  scanner: {
    browseFolder: () => ipcRenderer.invoke('scan:browse-folder') as Promise<string | null>,
    browseFile: () => ipcRenderer.invoke('scan:browse-file') as Promise<string | null>,
    addFolder: (folderPath: string, consoleId: number, consoleName: string) =>
      ipcRenderer.invoke('scan:add-folder', folderPath, consoleId, consoleName),
    getFolders: () => ipcRenderer.invoke('scan:get-folders'),
    removeFolder: (folderPath: string, consoleId: number) =>
      ipcRenderer.invoke('scan:remove-folder', folderPath, consoleId),
    scanFolder: (folderPath: string, consoleId: number, apiBaseUrl: string, accessToken: string) =>
      ipcRenderer.invoke('scan:scan-folder', folderPath, consoleId, apiBaseUrl, accessToken) as Promise<{ matched: number; total: number }>,
    scanFile: (filePath: string, consoleId: number, apiBaseUrl: string, accessToken: string) =>
      ipcRenderer.invoke('scan:scan-file', filePath, consoleId, apiBaseUrl, accessToken) as Promise<{ fileName: string; matched: boolean; title?: string; consoleName?: string; gameId?: number }>,
    getScannedGames: () => ipcRenderer.invoke('scan:get-scanned-games'),
    getScannedGamesByFolder: (folderPath: string) =>
      ipcRenderer.invoke('scan:get-scanned-games-by-folder', folderPath),
    onProgress: (callback: (progress: unknown) => void) => {
      const sub = (_event: IpcRendererEvent, progress: unknown) => callback(progress);
      ipcRenderer.on('scan:progress', sub);
      return () => ipcRenderer.removeListener('scan:progress', sub);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
