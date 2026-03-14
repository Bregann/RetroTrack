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
}

export function upsertTrackedGames(games: TrackedGameRow[]): void {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO tracked_games (
      game_id, title, console_id, console_name, image_icon, image_box_art,
      achievement_count, points, achievements_earned, percentage_complete, highest_award
    )
    VALUES (
      @gameId, @title, @consoleId, @consoleName, @imageIcon, @imageBoxArt,
      @achievementCount, @points, @achievementsEarned, @percentageComplete, @highestAward
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
      highest_award = excluded.highest_award
  `);

  db.transaction((items: TrackedGameRow[]) => {
    for (const item of items) upsert.run(item);
  })(games);
}

export function getAllTrackedGames(): TrackedGameRow[] {
  return getDb()
    .prepare(`
      SELECT
        game_id as gameId, title, console_id as consoleId, console_name as consoleName,
        image_icon as imageIcon, image_box_art as imageBoxArt,
        achievement_count as achievementCount, points,
        achievements_earned as achievementsEarned, percentage_complete as percentageComplete,
        highest_award as highestAward
      FROM tracked_games ORDER BY title
    `)
    .all() as TrackedGameRow[];
}

export function clearTrackedGames(): void {
  getDb().exec('DELETE FROM tracked_games');
}
