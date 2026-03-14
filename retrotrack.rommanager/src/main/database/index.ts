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

import { clearTrackedGames } from './trackedGames';
import { clearSyncMeta } from './syncMeta';
import { clearPlaylists } from './playlists';

export function clearUserData(): void {
  clearTrackedGames();
  clearSyncMeta();
  clearPlaylists();
}
