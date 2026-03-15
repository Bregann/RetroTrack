import { getDb } from './connection';

export function setSyncMeta(key: string, value: string): void {
  getDb()
    .prepare(
      'INSERT INTO sync_metadata (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    )
    .run(key, value);
}

export function getSyncMeta(key: string): string | undefined {
  const row = getDb()
    .prepare('SELECT value FROM sync_metadata WHERE key = ?')
    .get(key) as { value: string } | undefined;
  return row?.value;
}

export function clearSyncMeta(): void {
  getDb().exec('DELETE FROM sync_metadata');
}
