import { getDb } from './connection';

export interface PlaylistRow {
  playlistId: string;
  name: string;
}

export interface PlaylistGameRow {
  playlistId: string;
  gameId: number;
}

export function upsertPlaylists(
  playlists: Array<PlaylistRow & { gameIds: number[] }>,
): void {
  const db = getDb();

  const upsertPlaylist = db.prepare(`
    INSERT INTO playlists (playlist_id, name)
    VALUES (@playlistId, @name)
    ON CONFLICT(playlist_id) DO UPDATE SET
      name = excluded.name
  `);

  const deleteGames = db.prepare(
    `DELETE FROM playlist_games WHERE playlist_id = @playlistId`,
  );

  const insertGame = db.prepare(
    `INSERT OR IGNORE INTO playlist_games (playlist_id, game_id) VALUES (@playlistId, @gameId)`,
  );

  db.transaction((items: Array<PlaylistRow & { gameIds: number[] }>) => {
    for (const pl of items) {
      upsertPlaylist.run({ playlistId: pl.playlistId, name: pl.name });
      deleteGames.run({ playlistId: pl.playlistId });
      for (const gid of pl.gameIds) {
        insertGame.run({ playlistId: pl.playlistId, gameId: gid });
      }
    }
  })(playlists);
}

export function getAllPlaylists(): Array<PlaylistRow & { gameIds: number[] }> {
  const db = getDb();
  const rows = db
    .prepare(`SELECT playlist_id as playlistId, name FROM playlists ORDER BY name`)
    .all() as PlaylistRow[];

  const gameRows = db
    .prepare(`SELECT playlist_id as playlistId, game_id as gameId FROM playlist_games`)
    .all() as PlaylistGameRow[];

  const gameMap = new Map<string, number[]>();
  for (const r of gameRows) {
    if (!gameMap.has(r.playlistId)) gameMap.set(r.playlistId, []);
    gameMap.get(r.playlistId)!.push(r.gameId);
  }

  return rows.map((pl) => ({ ...pl, gameIds: gameMap.get(pl.playlistId) ?? [] }));
}

export function clearPlaylists(): void {
  const db = getDb();
  db.exec('DELETE FROM playlist_games; DELETE FROM playlists;');
}
