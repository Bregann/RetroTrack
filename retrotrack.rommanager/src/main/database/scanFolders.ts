import { getDb } from './connection';

export interface ScanFolderRow {
  path: string;
  consoleId: number;
  consoleName: string;
  addedAt: string;
}

export function addScanFolder(folderPath: string, consoleId: number, consoleName: string): void {
  getDb()
    .prepare(
      `INSERT OR REPLACE INTO scan_folders (path, console_id, console_name, added_at) VALUES (?, ?, ?, ?)`,
    )
    .run(folderPath, consoleId, consoleName, new Date().toISOString());
}

export function getAllScanFolders(): ScanFolderRow[] {
  return getDb()
    .prepare('SELECT path, console_id as consoleId, console_name as consoleName, added_at as addedAt FROM scan_folders ORDER BY path')
    .all() as ScanFolderRow[];
}

export function removeScanFolder(folderPath: string, consoleId: number): void {
  getDb().prepare('DELETE FROM scan_folders WHERE path = ? AND console_id = ?').run(folderPath, consoleId);
}

export function clearScanFolders(): void {
  getDb().exec('DELETE FROM scan_folders');
}
