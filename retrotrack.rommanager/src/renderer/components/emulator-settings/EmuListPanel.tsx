import { EMULATOR_PRESETS } from '../../mockData';
import type { EmulatorEntry } from './emulatorSettingsTypes';

interface Props {
  emulators: EmulatorEntry[];
  selectedId: string;
  onSelect: (presetId: string) => void;
}

export default function EmuListPanel({ emulators, selectedId, onSelect }: Props) {
  return (
    <div className="emu-list-panel">
      <div className="emu-list-scroll">
        {emulators.map((emu) => (
          <button
            key={emu.presetId}
            type="button"
            className={`emu-list-item ${emu.presetId === selectedId ? 'active' : ''}`}
            onClick={() => onSelect(emu.presetId)}
          >
            <div className="emu-list-item-top">
              <span className="emu-list-item-name">{emu.name}</span>
              <span
                className={`emu-status-dot ${emu.enabled ? 'enabled' : 'disabled'}`}
                title={emu.enabled ? 'Enabled' : 'Disabled'}
              />
            </div>
            <span className="emu-list-item-consoles">
              {EMULATOR_PRESETS.find((p) => p.id === emu.presetId)?.supportedConsoles.join(', ') || '—'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
