import { getDb } from './connection';

export interface GameEmulatorPrefRow {
  game_id: number;
  emulator_id: number;
  core_id: number | null;
}

export function getGameEmulatorPref(gameId: number): GameEmulatorPrefRow | undefined {
  const db = getDb();
  return db
    .prepare('SELECT game_id, emulator_id, core_id FROM game_emulator_prefs WHERE game_id = ?')
    .get(gameId) as GameEmulatorPrefRow | undefined;
}

export function setGameEmulatorPref(gameId: number, emulatorId: number, coreId: number | null): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO game_emulator_prefs (game_id, emulator_id, core_id)
    VALUES (?, ?, ?)
    ON CONFLICT(game_id) DO UPDATE SET
      emulator_id = excluded.emulator_id,
      core_id = excluded.core_id
  `).run(gameId, emulatorId, coreId);
}

export function clearGameEmulatorPref(gameId: number): void {
  const db = getDb();
  db.prepare('DELETE FROM game_emulator_prefs WHERE game_id = ?').run(gameId);
}
