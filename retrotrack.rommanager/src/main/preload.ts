// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'window-minimize' | 'window-maximize' | 'window-close';

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
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
