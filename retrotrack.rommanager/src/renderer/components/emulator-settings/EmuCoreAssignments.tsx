import type { ApiEmulatorConsole, ApiEmulatorCore } from './emulatorSettingsTypes';

interface Props {
  supportedConsoles: ApiEmulatorConsole[];
  cores: ApiEmulatorCore[];
  coreAssignments: Record<number, number>;
  onSetCore: (consoleId: number, coreId: number) => void;
}

export default function EmuCoreAssignments({ supportedConsoles, cores, coreAssignments, onSetCore }: Props) {
  return (
    <div className="emu-field">
      <label className="emu-label">Core per Console</label>
      <div className="emu-core-list">
        {supportedConsoles.map((c) => {
          const availableCores = cores.filter((core) => core.supportedConsoleIds.includes(c.consoleId));
          return (
            <div key={c.consoleId} className="emu-core-row">
              <span className="emu-core-console">{c.consoleName}</span>
              <select
                className="emu-select emu-core-select"
                value={coreAssignments[c.consoleId] ?? ''}
                onChange={(e) => onSetCore(c.consoleId, Number(e.target.value))}
              >
                <option value="">— Select core —</option>
                {availableCores.map((core) => (
                  <option key={core.id} value={core.id}>
                    {core.coreName}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
