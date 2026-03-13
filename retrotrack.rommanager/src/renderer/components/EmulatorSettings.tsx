import { useState } from 'react';
import { EMULATOR_PRESETS } from '../mockData';
import { createDefaultEntries, type EmulatorEntry } from './emulator-settings/emulatorSettingsTypes';
import EmuListPanel from './emulator-settings/EmuListPanel';
import EmuConfigPanel from './emulator-settings/EmuConfigPanel';

interface EmulatorSettingsProps {
  onClose: () => void;
}

export default function EmulatorSettings({ onClose }: EmulatorSettingsProps) {
  const [emulators, setEmulators] = useState<EmulatorEntry[]>(createDefaultEntries);
  const [selectedId, setSelectedId] = useState<string>(emulators[0]?.presetId || '');

  const selected = emulators.find((e) => e.presetId === selectedId) || null;
  const preset = EMULATOR_PRESETS.find((p) => p.id === selectedId);

  const updateSelected = (patch: Partial<EmulatorEntry>) => {
    setEmulators((prev) =>
      prev.map((e) => (e.presetId === selectedId ? { ...e, ...patch } : e)),
    );
  };

  const toggleEnabled = () => {
    setEmulators((prev) =>
      prev.map((e) => (e.presetId === selectedId ? { ...e, enabled: !e.enabled } : e)),
    );
  };

  return (
    <div className="emu-modal-backdrop" onClick={onClose}>
      <div className="emu-modal" onClick={(e) => e.stopPropagation()}>
        <div className="emu-modal-header">
          <h2>Configure Emulators</h2>
          <button type="button" className="emu-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="emu-modal-body">
          <EmuListPanel
            emulators={emulators}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {selected && preset ? (
            <EmuConfigPanel
              selected={selected}
              preset={preset}
              onUpdate={updateSelected}
              onToggleEnabled={toggleEnabled}
            />
          ) : (
            <div className="emu-config-panel">
              <div className="emu-config-empty">Select an emulator to configure.</div>
            </div>
          )}
        </div>

        <div className="emu-modal-footer">
          <button type="button" className="emu-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="emu-btn emu-btn-primary" onClick={onClose}>Save</button>
        </div>
      </div>
    </div>
  );
}
