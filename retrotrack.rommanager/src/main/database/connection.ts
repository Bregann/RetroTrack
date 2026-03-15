import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: Database.Database;

// ---------------------------------------------------------------------------
// Schema migrations
// ---------------------------------------------------------------------------
// MIGRATIONS[i] takes the database from user_version=i to user_version=i+1.
// NEVER edit a past migration — always append a new one.
// Bump SCHEMA_VERSION by 1 each time you add a migration.
// ---------------------------------------------------------------------------
const SCHEMA_VERSION = 1;

type MigrationFn = (db: Database.Database) => void;

const MIGRATIONS: MigrationFn[] = [
  // 0 → 1: initial schema (tables created via CREATE TABLE IF NOT EXISTS below)
  () => {},
];

function runMigrations(database: Database.Database): void {
  const currentVersion = database.pragma('user_version', { simple: true }) as number;
  if (currentVersion >= SCHEMA_VERSION) return;

  for (let v = currentVersion; v < SCHEMA_VERSION; v++) {
    const step = database.transaction(() => {
      MIGRATIONS[v](database);
      database.pragma(`user_version = ${v + 1}`);
    });
    step();
  }
}

export function initDatabase(): void {
  const dbPath = path.join(app.getPath('userData'), 'retrotrack.db');
  db = new Database(dbPath);

  db.pragma('journal_mode = WAL');

  // Create tables for fresh installs. Existing installs skip this silently
  // (IF NOT EXISTS). Schema changes to existing tables must go in MIGRATIONS.
  db.exec(`
    CREATE TABLE IF NOT EXISTS consoles (
      console_id    INTEGER PRIMARY KEY,
      console_name  TEXT NOT NULL,
      console_type  INTEGER NOT NULL
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
      highest_award        TEXT,
      last_played          TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_metadata (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS playlists (
      playlist_id TEXT PRIMARY KEY,
      name        TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS playlist_games (
      playlist_id TEXT NOT NULL,
      game_id     INTEGER NOT NULL,
      PRIMARY KEY (playlist_id, game_id)
    );

    CREATE TABLE IF NOT EXISTS scan_folders (
      path        TEXT NOT NULL,
      console_id  INTEGER NOT NULL,
      console_name TEXT NOT NULL,
      added_at    TEXT NOT NULL,
      PRIMARY KEY (path, console_id)
    );

    CREATE TABLE IF NOT EXISTS scanned_games (
      hash         TEXT NOT NULL,
      file_path    TEXT NOT NULL,
      file_name    TEXT NOT NULL,
      game_id      INTEGER NOT NULL,
      title        TEXT NOT NULL,
      console_id   INTEGER NOT NULL,
      console_name TEXT NOT NULL,
      image_icon   TEXT NOT NULL,
      image_box_art TEXT NOT NULL,
      folder_path  TEXT NOT NULL,
      added_at     TEXT NOT NULL,
      achievement_count INTEGER NOT NULL DEFAULT 0,
      points       INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (hash, file_path)
    );

    CREATE TABLE IF NOT EXISTS emulator_settings (
      emulator_id     INTEGER PRIMARY KEY,
      enabled         INTEGER NOT NULL DEFAULT 0,
      install_dir     TEXT NOT NULL DEFAULT '',
      executable_path TEXT NOT NULL DEFAULT '',
      args            TEXT NOT NULL DEFAULT '',
      core_assignments TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS game_emulator_prefs (
      game_id      INTEGER PRIMARY KEY,
      emulator_id  INTEGER NOT NULL,
      core_id      INTEGER
    );
  `);

  runMigrations(db);
}

export function getDb(): Database.Database {
  return db;
}
