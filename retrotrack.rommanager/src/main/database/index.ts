export { initDatabase, getDb } from './connection';
export { upsertConsoles, getAllConsoles, type ConsoleRow } from './consoles';
export {
  upsertTrackedGames,
  getAllTrackedGames,
  clearTrackedGames,
  type TrackedGameRow,
} from './trackedGames';
export { setSyncMeta, getSyncMeta, clearSyncMeta } from './syncMeta';

import { clearTrackedGames } from './trackedGames';
import { clearSyncMeta } from './syncMeta';

export function clearUserData(): void {
  clearTrackedGames();
  clearSyncMeta();
}
