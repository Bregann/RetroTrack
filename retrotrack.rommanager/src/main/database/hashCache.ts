import { getDb } from './connection';

export interface HashCacheRow {
  file_path: string;
  console_id: number;
  file_size: number;
  file_mtime: number;
  hash: string;
  created_at: string;
}

/**
 * Look up a cached hash. Returns the hash only if the file size and mtime
 * still match (i.e. the file hasn't changed since the hash was cached).
 */
export function getCachedHash(
  filePath: string,
  consoleId: number,
  fileSize: number,
  fileMtime: number,
): string | undefined {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT hash FROM hash_cache
       WHERE file_path = ? AND console_id = ? AND file_size = ? AND file_mtime = ?`,
    )
    .get(filePath, consoleId, fileSize, fileMtime) as { hash: string } | undefined;
  return row?.hash;
}

/**
 * Store (or update) a hash in the cache.
 */
export function setCachedHash(
  filePath: string,
  consoleId: number,
  fileSize: number,
  fileMtime: number,
  hash: string,
): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO hash_cache (file_path, console_id, file_size, file_mtime, hash, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(file_path, console_id) DO UPDATE SET
       file_size = excluded.file_size,
       file_mtime = excluded.file_mtime,
       hash = excluded.hash,
       created_at = excluded.created_at`,
  ).run(filePath, consoleId, fileSize, fileMtime, hash, new Date().toISOString());
}
