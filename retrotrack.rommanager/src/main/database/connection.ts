import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: Database.Database;

export function initDatabase(): void {
  const dbPath = path.join(app.getPath('userData'), 'retrotrack.db');
  db = new Database(dbPath);

  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS consoles (
      console_id    INTEGER PRIMARY KEY,
      console_name  TEXT NOT NULL,
      console_type  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tracked_games (
      game_id              INTEGER PRIMARY KEY,
      title                TEXT NOT NULL,
      console_id           INTEGER NOT NULL,
      console_name         TEXT NOT NULL,
      image_icon           TEXT NOT NULL,
      image_box_art        TEXT NOT NULL,
      achievement_count    INTEGER NOT NULL DEFAULT 0,
      points               INTEGER NOT NULL DEFAULT 0,
      achievements_earned  INTEGER NOT NULL DEFAULT 0,
      percentage_complete  REAL NOT NULL DEFAULT 0,
      highest_award        TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_metadata (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export function getDb(): Database.Database {
  return db;
}
