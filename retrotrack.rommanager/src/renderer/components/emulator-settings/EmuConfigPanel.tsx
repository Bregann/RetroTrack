import { ALL_CONSOLE_OPTIONS, type EmulatorPreset } from '../../mockData';
import type { EmulatorEntry } from './emulatorSettingsTypes';
import EmuCoreAssignments from './EmuCoreAssignments';

interface Props {
  selected: EmulatorEntry;
  preset: EmulatorPreset;
  onUpdate: (patch: Partial<EmulatorEntry>) => void;
  onToggleEnabled: () => void;
}

const consoleName = (short: string) =>
  ALL_CONSOLE_OPTIONS.find((c) => c.shortName === short)?.name || short;

export default function EmuConfigPanel({ selected, preset, onUpdate, onToggleEnabled }: Props) {
  return (
    <div className="emu-config-panel">
      {/* Enable toggle + name header */}
      <div className="emu-config-header">
        <h3 className="emu-config-title">{preset.name}</h3>
        <label className="emu-toggle-label">
          <input
            type="checkbox"
            className="emu-toggle-input"
            checked={selected.enabled}
            onChange={onToggleEnabled}
          />
          <span className="emu-toggle-switch" />
          <span className="emu-toggle-text">
            {selected.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {/* Supported consoles */}
      <div className="emu-console-tags">
        {preset.supportedConsoles.map((c) => (
          <span key={c} className="emu-console-tag">{consoleName(c)}</span>
        ))}
      </div>

      {/* Installation Directory */}
      <div className="emu-field">
        <label className="emu-label">Installation Folder</label>
        <div className="emu-input-row">
          <input
            className="emu-input"
            value={selected.installDir}
            onChange={(e) => onUpdate({ installDir: e.target.value })}
            placeholder={`C:\\Emulators\\${preset.name}`}
          />
          <button type="button" className="emu-browse-btn" title="Browse">📁</button>
        </div>
      </div>

      {/* Executable */}
      <div className="emu-field">
        <label className="emu-label">Executable</label>
        <div className="emu-input-row">
          <input
            className="emu-input"
            value={selected.executablePath}
            onChange={(e) => onUpdate({ executablePath: e.target.value })}
            placeholder={preset.defaultExe}
          />
          <button type="button" className="emu-browse-btn" title="Browse">📁</button>
        </div>
      </div>

      {/* Launch Arguments */}
      <div className="emu-field">
        <label className="emu-label">Launch Arguments</label>
        <input
          className="emu-input"
          value={selected.args}
          onChange={(e) => onUpdate({ args: e.target.value })}
          placeholder="--fullscreen {file}"
        />
        <span className="emu-field-hint">Use {'{file}'} for the ROM path</span>
      </div>

      {/* RetroArch Core Assignments */}
      {preset.id === 'retroarch' && (
        <EmuCoreAssignments
          supportedConsoles={preset.supportedConsoles}
          coreAssignments={selected.coreAssignments}
          onSetCore={(consoleShort, coreId) =>
            onUpdate({ coreAssignments: { ...selected.coreAssignments, [consoleShort]: coreId } })
          }
        />
      )}
    </div>
  );
}
