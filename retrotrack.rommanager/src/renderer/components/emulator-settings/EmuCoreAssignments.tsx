import { RETROARCH_CORES, ALL_CONSOLE_OPTIONS } from '../../mockData';

interface Props {
  supportedConsoles: string[];
  coreAssignments: Record<string, string>;
  onSetCore: (consoleShort: string, coreId: string) => void;
}

const consoleName = (short: string) =>
  ALL_CONSOLE_OPTIONS.find((c) => c.shortName === short)?.name || short;

export default function EmuCoreAssignments({ supportedConsoles, coreAssignments, onSetCore }: Props) {
  return (
    <div className="emu-field">
      <label className="emu-label">Core per Console</label>
      <div className="emu-core-list">
        {supportedConsoles.map((c) => {
          const cores = RETROARCH_CORES.filter((core) => core.consoles.includes(c));
          return (
            <div key={c} className="emu-core-row">
              <span className="emu-core-console">{consoleName(c)}</span>
              <select
                className="emu-select emu-core-select"
                value={coreAssignments[c] || ''}
                onChange={(e) => onSetCore(c, e.target.value)}
              >
                <option value="">— Select core —</option>
                {cores.map((core) => (
                  <option key={core.id} value={core.id}>
                    {core.name}
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
