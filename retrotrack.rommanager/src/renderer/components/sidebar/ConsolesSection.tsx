import { useLibraryData } from '../../helpers/useLibraryData';

const CONSOLE_TYPE_ICONS: Record<string, string> = {
  Nintendo: '🎮',
  Sony: '🎲',
  Sega: '🎯',
  Atari: '🕹️',
  NEC: '💿',
  SNK: '🃏',
  Other: '🖥️',
  NotSet: '🖥️',
};

interface Props {
  selectedView: string;
  onSelectView: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function ConsolesSection({
  selectedView,
  onSelectView,
  collapsed,
  onToggleCollapse,
}: Props) {
  const { data, isLoading } = useLibraryData();
  const consoles = data?.consoles ?? [];

  return (
    <div className="sidebar-section">
      <h3 className="sidebar-section-title sidebar-section-toggle">
        <span
          className={`sidebar-chevron ${collapsed ? 'collapsed' : ''}`}
          onClick={onToggleCollapse}
          style={{ cursor: 'pointer' }}
        >▾</span>
        <button
          type="button"
          className="sidebar-console-name"
          style={{ textTransform: 'inherit', letterSpacing: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
          onClick={() => onSelectView('consoles')}
        >
          CONSOLES
        </button>
      </h3>
      {!collapsed && (
        <>
          {isLoading && <div className="sidebar-loading">Loading...</div>}
          {consoles.map((c) => (
            <div key={c.consoleId}>
              <div
                className={`sidebar-item ${selectedView === `console-${c.consoleId}` ? 'active' : ''}`}
              >
                <span className="sidebar-item-icon">
                  {CONSOLE_TYPE_ICONS[c.consoleType] ?? '🖥️'}
                </span>
                <button
                  type="button"
                  className="sidebar-console-name"
                  onClick={() => onSelectView(`console-${c.consoleId}`)}
                >
                  {c.consoleName}
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
