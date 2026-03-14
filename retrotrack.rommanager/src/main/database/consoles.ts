import { getDb } from './connection';

export interface ConsoleRow {
  consoleId: number;
  consoleName: string;
  consoleType: string;
}

export function upsertConsoles(consoles: ConsoleRow[]): void {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO consoles (console_id, console_name, console_type)
    VALUES (@consoleId, @consoleName, @consoleType)
    ON CONFLICT(console_id) DO UPDATE SET
      console_name = excluded.console_name,
      console_type = excluded.console_type
  `);

  db.transaction((items: ConsoleRow[]) => {
    for (const item of items) upsert.run(item);
  })(consoles);
}

export function getAllConsoles(): ConsoleRow[] {
  return getDb()
    .prepare(
      'SELECT console_id as consoleId, console_name as consoleName, console_type as consoleType FROM consoles ORDER BY console_name'
    )
    .all() as ConsoleRow[];
}
