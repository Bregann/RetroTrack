import { useState, useEffect, useCallback } from 'react';
import {
  mergeEmulatorData,
  toLocalSettings,
  type EmulatorEntry,
  type LocalEmulatorSetting,
} from './emulator-settings/emulatorSettingsTypes';
import { useEmulatorConfig } from '../helpers/useEmulatorConfig';
import EmuListPanel from './emulator-settings/EmuListPanel';
import EmuConfigPanel from './emulator-settings/EmuConfigPanel';

interface EmulatorSettingsProps {
  onClose: () => void;
}

export default function EmulatorSettings({ onClose }: EmulatorSettingsProps) {
  const { data: config, isLoading, error } = useEmulatorConfig();
  const [emulators, setEmulators] = useState<EmulatorEntry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load local settings from SQLite and merge with API catalog
  useEffect(() => {
    if (!config?.emulators || loaded) return;

    (async () => {
      const localRows = (await window.electron.emulators.getSettings()) as LocalEmulatorSetting[];
      const merged = mergeEmulatorData(config.emulators, localRows);
      setEmulators(merged);
      if (merged.length > 0 && selectedId === null) {
        setSelectedId(merged[0].emulatorId);
      }
      setLoaded(true);
    })();
  }, [config, loaded, selectedId]);

  const selected = emulators.find((e) => e.emulatorId === selectedId) || null;

  const updateSelected = useCallback((patch: Partial<EmulatorEntry>) => {
    setEmulators((prev) =>
      prev.map((e) => (e.emulatorId === selectedId ? { ...e, ...patch } : e)),
    );
  }, [selectedId]);

  const toggleEnabled = useCallback(() => {
    setEmulators((prev) =>
      prev.map((e) => (e.emulatorId === selectedId ? { ...e, enabled: !e.enabled } : e)),
    );
  }, [selectedId]);

  const handleSave = async () => {
    const localSettings = toLocalSettings(emulators);
    await window.electron.emulators.saveSettings(localSettings);
    onClose();
  };

  if (isLoading) {
    return (
      <div className="emu-modal-backdrop" onClick={onClose}>
        <div className="emu-modal" onClick={(e) => e.stopPropagation()}>
          <div className="emu-modal-header">
            <h2>Configure Emulators</h2>
            <button type="button" className="emu-modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="emu-modal-body">
            <div className="emu-config-panel">
              <div className="emu-config-empty">Loading emulator configuration...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="emu-modal-backdrop" onClick={onClose}>
        <div className="emu-modal" onClick={(e) => e.stopPropagation()}>
          <div className="emu-modal-header">
            <h2>Configure Emulators</h2>
            <button type="button" className="emu-modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="emu-modal-body">
            <div className="emu-config-panel">
              <div className="emu-config-empty">Failed to load emulator configuration.</div>
            </div>
          </div>
          <div className="emu-modal-footer">
            <button type="button" className="emu-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

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

          {selected ? (
            <EmuConfigPanel
              selected={selected}
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
          <button type="button" className="emu-btn emu-btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
