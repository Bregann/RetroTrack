import { useState, useRef, useEffect } from 'react';
import type { LibraryModalMode } from './LibraryModals';
import GeneralSettingsModal from './modals/GeneralSettingsModal';

interface DropdownMenu {
  label: string;
  items: { label: string; icon?: string; onClick?: () => void }[];
}

interface TopMenuBarProps {
  onLogout: () => void;
  onSyncLibrary: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onManageEmulators: () => void;
  onLibraryAction: (action: LibraryModalMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TopMenuBar({ onLogout, onSyncLibrary, theme, onToggleTheme, onManageEmulators, onLibraryAction, searchQuery, onSearchChange }: TopMenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);
  const menuBarRef = useRef<HTMLDivElement>(null);

  const menus: DropdownMenu[] = [
    {
      label: 'Account',
      items: [
        { label: 'Sync Library Data', icon: '🔄', onClick: onSyncLibrary },
        { label: 'Log out', icon: '🚪', onClick: onLogout },
      ],
    },
    {
      label: 'Library',
      items: [
        { label: 'Add Single Game', icon: '➕', onClick: () => onLibraryAction('add-game') },
        { label: 'Add Folder', icon: '📁', onClick: () => onLibraryAction('add-folder') },
        { label: 'Manage Folders', icon: '🗂️', onClick: () => onLibraryAction('manage-folders') },
        { label: 'Scan All Folders', icon: '🔄', onClick: () => onLibraryAction('scan-all') },
      ],
    },
    {
      label: 'Emulators',
      items: [
        { label: 'Manage Emulators', icon: '⚙️', onClick: onManageEmulators }
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWindowControl = (action: string) => {
    window.electron?.ipcRenderer.sendMessage(action as any);
  };

  return (
    <>
    <div className="top-menu-bar" ref={menuBarRef}>
      <div className="menu-left">
        <span className="title-bar-logo">🎮</span>
        {menus.map((menu) => (
          <div key={menu.label} className="menu-dropdown-wrapper">
            <button
              type="button"
              className={`menu-trigger ${openMenu === menu.label ? 'active' : ''}`}
              onClick={() =>
                setOpenMenu(openMenu === menu.label ? null : menu.label)
              }
              onMouseEnter={() => {
                if (openMenu !== null) setOpenMenu(menu.label);
              }}
            >
              {menu.label}
              <span className="menu-arrow">▾</span>
            </button>
            {openMenu === menu.label && (
              <div className="menu-dropdown">
                {menu.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="menu-dropdown-item"
                    onClick={() => {
                      setOpenMenu(null);
                      item.onClick?.();
                    }}
                  >
                    {item.icon && <span className="menu-item-icon">{item.icon}</span>}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="menu-center">
        <span className="app-title">RetroTrack Manager</span>
      </div>
      <div className="menu-right">
        <div className="header-search">
          <input
            type="text"
            placeholder="Search games..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
          <span className="search-icon">🔍</span>
        </div>

        {/* Settings dropdown with theme toggle */}
        <div className="menu-dropdown-wrapper">
          <button
            type="button"
            className={`header-icon-btn ${openMenu === 'settings' ? 'active' : ''}`}
            title="Settings"
            onClick={() => setOpenMenu(openMenu === 'settings' ? null : 'settings')}
          >
            ⚙️
          </button>
          {openMenu === 'settings' && (
            <div className="menu-dropdown menu-dropdown-right">
              <button
                type="button"
                className="menu-dropdown-item"
                onClick={() => {
                  onToggleTheme();
                  setOpenMenu(null);
                }}
              >
                <span className="menu-item-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
              <button
                type="button"
                className="menu-dropdown-item"
                onClick={() => { setOpenMenu(null); setShowGeneralSettings(true); }}
              >
                <span className="menu-item-icon">⚙️</span>
                General Settings
              </button>
            </div>
          )}
        </div>

        {/* Custom window controls */}
        <div className="window-controls">
          <button
            type="button"
            className="window-ctrl-btn"
            title="Minimize"
            onClick={() => handleWindowControl('window-minimize')}
          >
            ─
          </button>
          <button
            type="button"
            className="window-ctrl-btn"
            title="Maximize"
            onClick={() => handleWindowControl('window-maximize')}
          >
            □
          </button>
          <button
            type="button"
            className="window-ctrl-btn window-ctrl-close"
            title="Close"
            onClick={() => handleWindowControl('window-close')}
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    {showGeneralSettings && (
      <GeneralSettingsModal onClose={() => setShowGeneralSettings(false)} />
    )}
  </>
  );
}
