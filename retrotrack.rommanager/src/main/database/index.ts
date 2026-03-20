export { initDatabase, getDb } from './connection';
export { upsertConsoles, getAllConsoles, type ConsoleRow } from './consoles';
export {
  upsertTrackedGames,
  getAllTrackedGames,
  clearTrackedGames,
  type TrackedGameRow,
} from './trackedGames';
export { setSyncMeta, getSyncMeta, clearSyncMeta } from './syncMeta';
export {
  upsertPlaylists,
  getAllPlaylists,
  clearPlaylists,
  type PlaylistRow,
} from './playlists';
export {
  addScanFolder,
  getAllScanFolders,
  removeScanFolder,
  clearScanFolders,
  type ScanFolderRow,
} from './scanFolders';
export {
  upsertScannedGames,
  getScannedGamesByFolder,
  getAllScannedGames,
  getScannedGamesByGameId,
  removeScannedGamesByFolder,
  removeScannedGamesByGameId,
  clearScannedGames,
  type ScannedGameRow,
} from './scannedGames';
export {
  getEmulatorSetting,
  getAllEmulatorSettings,
  upsertEmulatorSetting,
  upsertAllEmulatorSettings,
  type EmulatorSettingRow,
} from './emulatorSettings';
export {
  getGameEmulatorPref,
  setGameEmulatorPref,
  clearGameEmulatorPref,
  type GameEmulatorPrefRow,
} from './gameEmulatorPrefs';
export {
  getCachedHash,
  setCachedHash,
} from './hashCache';

import { clearTrackedGames } from './trackedGames';
import { clearSyncMeta } from './syncMeta';
import { clearPlaylists } from './playlists';
import { clearScanFolders } from './scanFolders';
import { clearScannedGames } from './scannedGames';

export function clearUserData(): void {
  clearTrackedGames();
  clearSyncMeta();
  clearPlaylists();
  clearScanFolders();
  clearScannedGames();
}
