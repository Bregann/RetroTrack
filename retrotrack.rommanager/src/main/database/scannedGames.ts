import { getDb } from './connection';

export interface ScannedGameRow {
  hash: string;
  filePath: string;
  fileName: string;
  gameId: number;
  title: string;
  consoleId: number;
  consoleName: string;
  imageIcon: string;
  imageBoxArt: string;
  folderPath: string;
  addedAt: string;
}

export function upsertScannedGames(games: ScannedGameRow[]): void {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO scanned_games (hash, file_path, file_name, game_id, title, console_id, console_name, image_icon, image_box_art, folder_path, added_at)
    VALUES (@hash, @filePath, @fileName, @gameId, @title, @consoleId, @consoleName, @imageIcon, @imageBoxArt, @folderPath, @addedAt)
    ON CONFLICT(hash, file_path) DO UPDATE SET
      file_name = excluded.file_name,
      game_id = excluded.game_id,
      title = excluded.title,
      console_id = excluded.console_id,
      console_name = excluded.console_name,
      image_icon = excluded.image_icon,
      image_box_art = excluded.image_box_art,
      folder_path = excluded.folder_path
  `);

  db.transaction((items: ScannedGameRow[]) => {
    for (const item of items) upsert.run(item);
  })(games);
}

export function getScannedGamesByFolder(folderPath: string): ScannedGameRow[] {
  return getDb()
    .prepare(
      `SELECT hash, file_path as filePath, file_name as fileName, game_id as gameId, title,
              console_id as consoleId, console_name as consoleName, image_icon as imageIcon,
              image_box_art as imageBoxArt, folder_path as folderPath, added_at as addedAt
       FROM scanned_games WHERE folder_path = ? ORDER BY title`,
    )
    .all(folderPath) as ScannedGameRow[];
}

export function getAllScannedGames(): ScannedGameRow[] {
  return getDb()
    .prepare(
      `SELECT hash, file_path as filePath, file_name as fileName, game_id as gameId, title,
              console_id as consoleId, console_name as consoleName, image_icon as imageIcon,
              image_box_art as imageBoxArt, folder_path as folderPath, added_at as addedAt
       FROM scanned_games ORDER BY title`,
    )
    .all() as ScannedGameRow[];
}

export function removeScannedGamesByFolder(folderPath: string): void {
  getDb().prepare('DELETE FROM scanned_games WHERE folder_path = ?').run(folderPath);
}

export function clearScannedGames(): void {
  getDb().exec('DELETE FROM scanned_games');
}
