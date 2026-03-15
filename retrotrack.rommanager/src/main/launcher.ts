import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import {
  getAllEmulatorSettings,
  getScannedGamesByGameId,
  getGameEmulatorPref,
} from './database';

export interface LaunchRequest {
  gameId: number;
  emulatorId: number;
  coreId: number | null;
}

export interface LaunchableEmulator {
  emulatorId: number;
  name: string;
  executablePath: string;
  coreAssignments: Record<number, number>;
}

export interface LaunchContext {
  romFiles: { filePath: string; consoleId: number }[];
  availableEmulators: LaunchableEmulator[];
  savedPref: { emulatorId: number; coreId: number | null } | null;
}

/**
 * Resolve the executable to a full path.
 * If it is already absolute and exists, return as-is.
 * Otherwise try resolving relative to installDir, with and without .exe suffix.
 */
function resolveExecutable(executablePath: string, installDir: string): string | null {
  // Already absolute and exists?
  if (path.isAbsolute(executablePath) && fs.existsSync(executablePath)) {
    return executablePath;
  }

  // Try inside installDir
  if (installDir) {
    for (const name of [executablePath, `${executablePath}.exe`]) {
      const full = path.join(installDir, name);
      if (fs.existsSync(full)) return full;
    }
  }

  // Try with .exe appended on the original path
  if (path.isAbsolute(executablePath)) {
    const withExe = executablePath.endsWith('.exe') ? executablePath : `${executablePath}.exe`;
    if (fs.existsSync(withExe)) return withExe;
  }

  return null;
}

/**
 * Gather everything needed to show the emulator picker or auto-launch.
 * Returns ROM files, enabled emulators that support the game's console,
 * and any saved preference.
 */
export function getLaunchContext(
  gameId: number,
  consoleId: number,
  apiEmulators: { id: number; name: string; cores: { id: number; coreFileName: string; supportedConsoleIds: number[] }[]; supportedConsoles: { consoleId: number }[] }[],
): LaunchContext {
  const scannedRows = getScannedGamesByGameId(gameId);
  const romFiles = scannedRows.map((r) => ({ filePath: r.filePath, consoleId: r.consoleId }));

  const localSettings = getAllEmulatorSettings();
  const localMap = new Map(localSettings.map((s) => [s.emulator_id, s]));

  // Filter to enabled emulators that support this console
  const availableEmulators: LaunchableEmulator[] = [];
  for (const apiEmu of apiEmulators) {
    const local = localMap.get(apiEmu.id);
    if (!local || local.enabled !== 1 || !local.executable_path) continue;

    // Resolve executable to a real path
    const resolvedExe = resolveExecutable(local.executable_path, local.install_dir);
    if (!resolvedExe) continue;

    const supportsConsole = apiEmu.supportedConsoles.some((sc) => sc.consoleId === consoleId);
    if (!supportsConsole) continue;

    let coreAssignments: Record<number, number> = {};
    try {
      coreAssignments = JSON.parse(local.core_assignments);
    } catch { /* ignore */ }

    availableEmulators.push({
      emulatorId: apiEmu.id,
      name: apiEmu.name,
      executablePath: resolvedExe,
      coreAssignments,
    });
  }

  const pref = getGameEmulatorPref(gameId);
  const savedPref = pref ? { emulatorId: pref.emulator_id, coreId: pref.core_id } : null;

  return { romFiles, availableEmulators, savedPref };
}

/**
 * Launch a game with the specified emulator.
 * Returns the child process PID on success, an error string on failure.
 */
export function launchGame(
  request: LaunchRequest,
  apiEmulators: { id: number; name: string; cores: { id: number; coreFileName: string; supportedConsoleIds: number[] }[]; supportedConsoles: { consoleId: number }[] }[],
): string | number {
  const { gameId, emulatorId, coreId } = request;

  // 1) Find the ROM
  const scannedRows = getScannedGamesByGameId(gameId);
  if (scannedRows.length === 0) {
    return 'No ROM file found for this game. Scan a folder containing this ROM first.';
  }
  const romPath = scannedRows[0].filePath;

  // 2) Find emulator settings
  const localSettings = getAllEmulatorSettings();
  const local = localSettings.find((s) => s.emulator_id === emulatorId);
  if (!local || !local.executable_path) {
    return 'Emulator executable path is not configured. Configure it in Emulators settings.';
  }

  // Resolve to full path
  const exePath = resolveExecutable(local.executable_path, local.install_dir);
  if (!exePath) {
    return `Could not find emulator executable "${local.executable_path}". Check the path in Emulators settings.`;
  }

  const apiEmu = apiEmulators.find((e) => e.id === emulatorId);
  const emulatorName = apiEmu?.name?.toLowerCase() ?? '';

  // 3) Build command args based on emulator type
  const args = buildLaunchArgs(emulatorName, local, romPath, coreId, apiEmu);

  // 4) Spawn the process
  try {
    const child = spawn(exePath, args, {
      detached: true,
      stdio: 'ignore',
      cwd: local.install_dir || path.dirname(exePath),
    });
    const pid = child.pid;
    child.unref();
    if (!pid) return 'Failed to get process ID from spawned emulator.';
    return pid;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Failed to launch emulator: ${msg}`;
  }
}

function buildLaunchArgs(
  emulatorName: string,
  local: { args: string; core_assignments: string },
  romPath: string,
  coreId: number | null,
  apiEmu?: { cores: { id: number; coreFileName: string }[] },
): string[] {
  // If user has custom args with {file} placeholder, use those
  if (local.args && local.args.trim()) {
    return local.args.replace(/\{file\}/gi, romPath).split(/\s+/);
  }

  // Otherwise, build default args per emulator
  const coreName = resolveCoreName(coreId, apiEmu);

  switch (emulatorName) {
    case 'retroarch':
      if (coreName) {
        return ['-L', coreName, romPath];
      }
      return [romPath];

    case 'duckstation':
      return [romPath];

    case 'pcsx2':
      return [romPath];

    case 'dolphin':
      return ['-e', romPath];

    case 'bizhawk':
      return [romPath];

    case 'project64':
      return [romPath];

    case 'mgba':
      return [romPath];

    case 'snes9x':
      return [romPath];

    default:
      // Generic fallback — just pass the ROM path
      return [romPath];
  }
}

function resolveCoreName(
  coreId: number | null,
  apiEmu?: { cores: { id: number; coreFileName: string }[] },
): string | null {
  if (!coreId || !apiEmu) return null;
  const core = apiEmu.cores.find((c) => c.id === coreId);
  return core?.coreFileName ?? null;
}
