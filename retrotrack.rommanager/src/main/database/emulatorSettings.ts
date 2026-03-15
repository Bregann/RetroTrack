import { getDb } from './connection';

export interface EmulatorSettingRow {
  emulator_id: number;
  enabled: number; // 0 or 1
  install_dir: string;
  executable_path: string;
  args: string;
  core_assignments: string; // JSON string of Record<number, number> (consoleId -> coreId)
}

export function getEmulatorSetting(emulatorId: number): EmulatorSettingRow | undefined {
  const db = getDb();
  return db
    .prepare('SELECT * FROM emulator_settings WHERE emulator_id = ?')
    .get(emulatorId) as EmulatorSettingRow | undefined;
}

export function getAllEmulatorSettings(): EmulatorSettingRow[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM emulator_settings')
    .all() as EmulatorSettingRow[];
}

export function upsertEmulatorSetting(setting: EmulatorSettingRow): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO emulator_settings (emulator_id, enabled, install_dir, executable_path, args, core_assignments)
    VALUES (@emulator_id, @enabled, @install_dir, @executable_path, @args, @core_assignments)
    ON CONFLICT(emulator_id) DO UPDATE SET
      enabled = @enabled,
      install_dir = @install_dir,
      executable_path = @executable_path,
      args = @args,
      core_assignments = @core_assignments
  `).run(setting);
}

export function upsertAllEmulatorSettings(settings: EmulatorSettingRow[]): void {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO emulator_settings (emulator_id, enabled, install_dir, executable_path, args, core_assignments)
    VALUES (@emulator_id, @enabled, @install_dir, @executable_path, @args, @core_assignments)
    ON CONFLICT(emulator_id) DO UPDATE SET
      enabled = @enabled,
      install_dir = @install_dir,
      executable_path = @executable_path,
      args = @args,
      core_assignments = @core_assignments
  `);

  const transaction = db.transaction((rows: EmulatorSettingRow[]) => {
    for (const row of rows) {
      upsert.run(row);
    }
  });

  transaction(settings);
}
