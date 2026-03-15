import type { EmulatorEntry } from './emulatorSettingsTypes';
import EmuCoreAssignments from './EmuCoreAssignments';

interface Props {
  selected: EmulatorEntry;
  onUpdate: (patch: Partial<EmulatorEntry>) => void;
  onToggleEnabled: () => void;
}

export default function EmuConfigPanel({ selected, onUpdate, onToggleEnabled }: Props) {
  const hasCores = selected.cores.length > 0;
  const canEnable = selected.installDir.trim() !== '' && selected.executablePath.trim() !== '';

  return (
    <div className="emu-config-panel">
      {/* Enable toggle + name header */}
      <div className="emu-config-header">
        <h3 className="emu-config-title">{selected.name}</h3>
        <label
          className={`emu-toggle-label${!canEnable && !selected.enabled ? ' emu-toggle-disabled' : ''}`}
          title={!canEnable ? 'Set the installation folder and executable before enabling' : undefined}
        >
          <input
            type="checkbox"
            className="emu-toggle-input"
            checked={selected.enabled}
            onChange={onToggleEnabled}
            disabled={!canEnable && !selected.enabled}
          />
          <span className="emu-toggle-switch" />
          <span className="emu-toggle-text">
            {selected.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>
      {!canEnable && !selected.enabled && (
        <p className="emu-config-notice">Set the installation folder and executable to enable this emulator.</p>
      )}

      {/* Supported consoles */}
      <div className="emu-console-tags">
        {selected.supportedConsoles.map((c) => (
          <span key={c.consoleId} className="emu-console-tag">{c.consoleName}</span>
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
            placeholder={`C:\\Emulators\\${selected.name}`}
          />
          <button
            type="button"
            className="emu-browse-btn"
            title="Browse"
            onClick={async () => {
              const folder = await window.electron.scanner.browseFolder();
              if (folder) {
                onUpdate({ installDir: folder });
                // Auto-detect executable in the chosen folder
                const detected = await window.electron.scanner.autoDetectExe(folder, selected.defaultExe);
                if (detected) onUpdate({ installDir: folder, executablePath: detected });
              }
            }}
          >📁</button>
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
            placeholder={selected.defaultExe}
          />
          <button
            type="button"
            className="emu-browse-btn"
            title="Browse"
            onClick={async () => {
              const file = await window.electron.scanner.browseExecutable();
              if (file) onUpdate({ executablePath: file });
            }}
          >📁</button>
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

      {/* Core Assignments (only for emulators with cores defined) */}
      {hasCores && (
        <EmuCoreAssignments
          supportedConsoles={selected.supportedConsoles}
          cores={selected.cores}
          coreAssignments={selected.coreAssignments}
          onSetCore={(consoleId, coreId) =>
            onUpdate({ coreAssignments: { ...selected.coreAssignments, [consoleId]: coreId } })
          }
        />
      )}
    </div>
  );
}
