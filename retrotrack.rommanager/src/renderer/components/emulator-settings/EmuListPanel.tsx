import type { EmulatorEntry } from './emulatorSettingsTypes';

interface Props {
  emulators: EmulatorEntry[];
  selectedId: number | null;
  onSelect: (emulatorId: number) => void;
}

export default function EmuListPanel({ emulators, selectedId, onSelect }: Props) {
  return (
    <div className="emu-list-panel">
      <div className="emu-list-scroll">
        {emulators.map((emu) => (
          <button
            key={emu.emulatorId}
            type="button"
            className={`emu-list-item ${emu.emulatorId === selectedId ? 'active' : ''}`}
            onClick={() => onSelect(emu.emulatorId)}
          >
            <div className="emu-list-item-top">
              <span className="emu-list-item-name">{emu.name}</span>
              <span
                className={`emu-status-dot ${emu.enabled ? 'enabled' : 'disabled'}`}
                title={emu.enabled ? 'Enabled' : 'Disabled'}
              />
            </div>
            <span className="emu-list-item-consoles">
              {emu.supportedConsoles.map((c) => c.consoleName).join(', ') || '—'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
