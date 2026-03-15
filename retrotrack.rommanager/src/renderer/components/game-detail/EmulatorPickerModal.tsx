import { useState, useEffect } from 'react';
import { useEmulatorConfig } from '../../helpers/useEmulatorConfig';
import type { ApiEmulator, ApiEmulatorCore } from '../emulator-settings/emulatorSettingsTypes';

interface LaunchableEmulator {
  emulatorId: number;
  name: string;
  executablePath: string;
  coreAssignments: Record<number, number>;
}

interface LaunchContext {
  romFiles: { filePath: string; consoleId: number }[];
  availableEmulators: LaunchableEmulator[];
  savedPref: { emulatorId: number; coreId: number | null } | null;
}

interface Props {
  gameId: number;
  gameTitle: string;
  consoleId: number;
  consoleName: string;
  imageIcon: string | null;
  onClose: () => void;
}

export default function EmulatorPickerModal({ gameId, gameTitle, consoleId, consoleName, imageIcon, onClose }: Props) {
  const { data: config } = useEmulatorConfig();
  const [context, setContext] = useState<LaunchContext | null>(null);
  const [selectedEmulatorId, setSelectedEmulatorId] = useState<number | null>(null);
  const [selectedCoreId, setSelectedCoreId] = useState<number | null>(null);
  const [remember, setRemember] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoLaunching, setAutoLaunching] = useState(false);

  // Auto-launch helper (used for saved pref or single-emulator shortcut)
  const doAutoLaunch = async (emulatorId: number, coreId: number | null) => {
    if (!config?.emulators) return;
    setAutoLaunching(true);
    setLaunching(true);
    try {
      const result = await window.electron.launcher.launchGame(
        { gameId, emulatorId, coreId, gameTitle, consoleName, imageIcon },
        config.emulators,
      );
      if (result === true) {
        onClose();
      } else {
        // Auto-launch failed — fall back to showing the picker
        setAutoLaunching(false);
        setError(result);
        setLaunching(false);
      }
    } catch {
      setAutoLaunching(false);
      setError('An unexpected error occurred while launching the game.');
      setLaunching(false);
    }
  };

  // Load launch context
  useEffect(() => {
    if (!config?.emulators) return;

    (async () => {
      const ctx = (await window.electron.launcher.getContext(
        gameId,
        consoleId,
        config.emulators,
      )) as LaunchContext;
      setContext(ctx);

      // Auto-launch if saved preference exists and emulator is still available
      if (ctx.savedPref) {
        const prefEmu = ctx.availableEmulators.find((e) => e.emulatorId === ctx.savedPref!.emulatorId);
        if (prefEmu) {
          doAutoLaunch(ctx.savedPref.emulatorId, ctx.savedPref.coreId);
          return;
        }
        // Pref emulator not available anymore — fall through to manual selection
      }

      // Auto-launch if only 1 emulator is available (no need to show picker)
      if (ctx.romFiles.length > 0 && ctx.availableEmulators.length === 1) {
        const only = ctx.availableEmulators[0];
        const coreId = only.coreAssignments[consoleId] ?? null;
        doAutoLaunch(only.emulatorId, coreId);
        return;
      }

      // Pre-select first available emulator for manual mode
      if (ctx.availableEmulators.length > 0) {
        const first = ctx.availableEmulators[0];
        setSelectedEmulatorId(first.emulatorId);
        const assignedCore = first.coreAssignments[consoleId];
        setSelectedCoreId(assignedCore ?? null);
      }
    })();
  }, [gameId, consoleId, config]);

  // Get cores for selected emulator from API data
  const selectedApiEmu = config?.emulators.find((e: ApiEmulator) => e.id === selectedEmulatorId);
  const availableCores = selectedApiEmu?.cores.filter((c: ApiEmulatorCore) =>
    c.supportedConsoleIds.includes(consoleId),
  ) ?? [];

  const handleEmulatorChange = (emulatorId: number) => {
    setSelectedEmulatorId(emulatorId);
    setError(null);
    // Auto-select core from assignments
    const emu = context?.availableEmulators.find((e) => e.emulatorId === emulatorId);
    const assignedCore = emu?.coreAssignments[consoleId];
    setSelectedCoreId(assignedCore ?? null);
  };

  const handleLaunch = async () => {
    if (!selectedEmulatorId || !config?.emulators) return;

    setLaunching(true);
    setError(null);

    try {
      // Save or clear preference
      if (remember) {
        await window.electron.emulators.setGamePref(gameId, selectedEmulatorId, selectedCoreId);
      } else {
        await window.electron.emulators.clearGamePref(gameId);
      }

      const result = await window.electron.launcher.launchGame(
        { gameId, emulatorId: selectedEmulatorId, coreId: selectedCoreId, gameTitle, consoleName, imageIcon },
        config.emulators,
      );

      if (result === true) {
        onClose();
      } else {
        setError(result);
      }
    } catch (err) {
      setError('An unexpected error occurred while launching the game.');
    } finally {
      setLaunching(false);
    }
  };

  const noRom = context && context.romFiles.length === 0;
  const noEmulators = context && context.availableEmulators.length === 0;

  // During auto-launch, show a minimal launching overlay
  if (autoLaunching && !error) {
    return (
      <div className="emu-picker-backdrop">
        <div className="emu-picker-modal" onClick={(e) => e.stopPropagation()}>
          <div className="emu-picker-body">
            <div className="emu-picker-message">Launching...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="emu-picker-backdrop" onClick={onClose}>
      <div className="emu-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="emu-picker-header">
          <h3>Launch Game</h3>
          <button type="button" className="emu-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="emu-picker-body">
          <div className="emu-picker-game-title">{gameTitle}</div>

          {!context && (
            <div className="emu-picker-message">Loading...</div>
          )}

          {noRom && (
            <div className="emu-picker-message emu-picker-warning">
              No ROM file found for this game. Scan a folder containing this ROM first.
            </div>
          )}

          {context && !noRom && noEmulators && (
            <div className="emu-picker-message emu-picker-warning">
              No configured emulators support this console. Configure emulators in the Emulators settings.
            </div>
          )}

          {context && !noRom && !noEmulators && (
            <>
              <div className="emu-picker-field">
                <label className="emu-label">Emulator</label>
                <select
                  className="emu-select"
                  value={selectedEmulatorId ?? ''}
                  onChange={(e) => handleEmulatorChange(Number(e.target.value))}
                >
                  {context.availableEmulators.map((emu) => (
                    <option key={emu.emulatorId} value={emu.emulatorId}>
                      {emu.name}
                    </option>
                  ))}
                </select>
              </div>

              {availableCores.length > 0 && (
                <div className="emu-picker-field">
                  <label className="emu-label">Core</label>
                  <select
                    className="emu-select"
                    value={selectedCoreId ?? ''}
                    onChange={(e) => setSelectedCoreId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">— Default —</option>
                    {availableCores.map((core: ApiEmulatorCore) => (
                      <option key={core.id} value={core.id}>
                        {core.coreName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label className="emu-picker-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember this choice for this game</span>
              </label>
            </>
          )}

          {error && (
            <div className="emu-picker-message emu-picker-error">{error}</div>
          )}
        </div>

        <div className="emu-picker-footer">
          <button type="button" className="emu-btn" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="emu-btn emu-btn-primary"
            disabled={!selectedEmulatorId || noRom || noEmulators || launching}
            onClick={handleLaunch}
          >
            {launching ? 'Launching...' : 'Launch'}
          </button>
        </div>
      </div>
    </div>
  );
}
