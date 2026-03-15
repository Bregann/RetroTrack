// ---------- API types (from GET /api/Emulators/GetEmulatorConfig) ----------

export interface EmulatorConfigResponse {
  emulators: ApiEmulator[];
}

export interface ApiEmulator {
  id: number;
  name: string;
  defaultExe: string;
  isEnabled: boolean;
  sortOrder: number;
  supportedConsoles: ApiEmulatorConsole[];
  cores: ApiEmulatorCore[];
}

export interface ApiEmulatorConsole {
  consoleId: number;
  consoleName: string;
}

export interface ApiEmulatorCore {
  id: number;
  coreName: string;
  coreFileName: string;
  supportedConsoleIds: number[];
}

// ---------- Local settings (stored in SQLite) ----------

export interface LocalEmulatorSetting {
  emulator_id: number;
  enabled: number; // 0 or 1
  install_dir: string;
  executable_path: string;
  args: string;
  core_assignments: string; // JSON string of Record<number, number> (consoleId -> coreId)
}

// ---------- Merged entry used by the UI ----------

export interface EmulatorEntry {
  emulatorId: number;
  name: string;
  defaultExe: string;
  isEnabledOnServer: boolean;
  enabled: boolean;
  installDir: string;
  executablePath: string;
  args: string;
  supportedConsoles: ApiEmulatorConsole[];
  cores: ApiEmulatorCore[];
  /** consoleId -> coreId */
  coreAssignments: Record<number, number>;
}

/** Merge API catalog + local settings into UI entries */
export function mergeEmulatorData(
  apiEmulators: ApiEmulator[],
  localSettings: LocalEmulatorSetting[],
): EmulatorEntry[] {
  const localMap = new Map(localSettings.map((s) => [s.emulator_id, s]));

  return apiEmulators
    .filter((e) => e.isEnabled)
    .map((emu) => {
      const local = localMap.get(emu.id);
      let coreAssignments: Record<number, number> = {};
      if (local?.core_assignments) {
        try {
          coreAssignments = JSON.parse(local.core_assignments);
        } catch {
          /* ignore corrupt JSON */
        }
      }

      return {
        emulatorId: emu.id,
        name: emu.name,
        defaultExe: emu.defaultExe,
        isEnabledOnServer: emu.isEnabled,
        enabled: local ? local.enabled === 1 : false,
        installDir: local?.install_dir ?? '',
        executablePath: local?.executable_path ?? '',
        args: local?.args ?? '',
        supportedConsoles: emu.supportedConsoles,
        cores: emu.cores,
        coreAssignments,
      };
    });
}

/** Convert UI entries back to LocalEmulatorSetting rows for SQLite persistence */
export function toLocalSettings(entries: EmulatorEntry[]): LocalEmulatorSetting[] {
  return entries.map((e) => ({
    emulator_id: e.emulatorId,
    enabled: e.enabled ? 1 : 0,
    install_dir: e.installDir,
    executable_path: e.executablePath,
    args: e.args,
    core_assignments: JSON.stringify(e.coreAssignments),
  }));
}

