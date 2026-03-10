import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenu {
  label: string;
  items: { label: string; icon?: string; onClick?: () => void }[];
}

interface TopMenuBarProps {
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function TopMenuBar({ onLogout, theme, onToggleTheme }: TopMenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  const menus: DropdownMenu[] = [
    {
      label: 'Account',
      items: [
        { label: 'Update Profile', icon: '👤' },
        { label: 'Log out', icon: '🚪', onClick: onLogout },
      ],
    },
    {
      label: 'Library',
      items: [
        { label: 'Add Single Game', icon: '➕' },
        { label: 'Add Folder', icon: '📁' },
        { label: 'Manage Folders', icon: '🗂️' },
        { label: 'Scan All Folders', icon: '🔄' },
      ],
    },
    {
      label: 'Emulators',
      items: [
        { label: 'Manage Emulators', icon: '⚙️' },
        { label: 'Functionality', icon: '🔧' },
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
          <input type="text" placeholder="Search" className="search-input" />
          <span className="search-icon">🔍</span>
        </div>
        <button type="button" className="header-icon-btn" title="Notifications">
          🔔<span className="notif-badge">1</span>
        </button>

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
              <button type="button" className="menu-dropdown-item">
                <span className="menu-item-icon">📂</span>
                ROM Directories
              </button>
              <button type="button" className="menu-dropdown-item">
                <span className="menu-item-icon">🔗</span>
                RetroTrack Connection
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
  );
}
