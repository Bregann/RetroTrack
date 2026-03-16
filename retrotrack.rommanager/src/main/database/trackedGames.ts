import { getDb } from './connection';

export interface TrackedGameRow {
  gameId: number;
  title: string;
  consoleId: number;
  consoleName: string;
  imageIcon: string;
  imageBoxArt: string;
  achievementCount: number;
  points: number;
  achievementsEarned: number;
  percentageComplete: number;
  highestAward: string | null;
  lastPlayedUtc: string | null;
  isTracked: boolean;
}

interface DbTrackedGameRow extends Omit<TrackedGameRow, 'isTracked'> {
  isTracked: 0 | 1;
}

export function upsertTrackedGames(games: TrackedGameRow[]): void {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO tracked_games (
      game_id, title, console_id, console_name, image_icon, image_box_art,
      achievement_count, points, achievements_earned, percentage_complete, highest_award, last_played, is_tracked
    )
    VALUES (
      @gameId, @title, @consoleId, @consoleName, @imageIcon, @imageBoxArt,
      @achievementCount, @points, @achievementsEarned, @percentageComplete, @highestAward, @lastPlayedUtc, @isTracked
    )
    ON CONFLICT(game_id) DO UPDATE SET
      title = excluded.title,
      console_id = excluded.console_id,
      console_name = excluded.console_name,
      image_icon = excluded.image_icon,
      image_box_art = excluded.image_box_art,
      achievement_count = excluded.achievement_count,
      points = excluded.points,
      achievements_earned = excluded.achievements_earned,
      percentage_complete = excluded.percentage_complete,
      highest_award = excluded.highest_award,
      last_played = excluded.last_played,
      is_tracked = excluded.is_tracked
  `);

  db.transaction((items: TrackedGameRow[]) => {
    for (const item of items) {
      const dbRow: DbTrackedGameRow = { ...item, isTracked: item.isTracked ? 1 : 0 };
      upsert.run(dbRow);
    }
  })(games);
}

export function getAllTrackedGames(): TrackedGameRow[] {
  const rows = getDb()
    .prepare(`
      SELECT
        game_id as gameId, title, console_id as consoleId, console_name as consoleName,
        image_icon as imageIcon, image_box_art as imageBoxArt,
        achievement_count as achievementCount, points,
        achievements_earned as achievementsEarned, percentage_complete as percentageComplete,
        highest_award as highestAward, last_played as lastPlayedUtc,
        is_tracked as isTracked
      FROM tracked_games ORDER BY title
    `)
    .all() as DbTrackedGameRow[];
  return rows.map((row) => ({ ...row, isTracked: !!row.isTracked }));
}

export function clearTrackedGames(): void {
  getDb().exec('DELETE FROM tracked_games');
}
