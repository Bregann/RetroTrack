import { EMULATOR_PRESETS } from '../../mockData';

export interface EmulatorEntry {
  presetId: string;
  name: string;
  enabled: boolean;
  installDir: string;
  executablePath: string;
  args: string;
  /** For RetroArch: core per console shortName */
  coreAssignments: Record<string, string>;
}

export function createDefaultEntries(): EmulatorEntry[] {
  return EMULATOR_PRESETS.filter((p) => p.id !== 'custom').map((p) => ({
    presetId: p.id,
    name: p.name,
    enabled: false,
    installDir: '',
    executablePath: '',
    args: '',
    coreAssignments: {},
  }));
}
