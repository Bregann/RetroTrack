import React, { useState, useRef, useCallback, useEffect } from 'react';
import TrackedGamesSection from './sidebar/TrackedGamesSection';
import ConsolesSection from './sidebar/ConsolesSection';
import PlaylistsSection from './sidebar/PlaylistsSection';
import SidebarProfile from './sidebar/SidebarProfile';

interface SidebarProps {
  selectedView: string;
  onSelectView: (view: string) => void;
}

type SectionKey = 'tracked' | 'consoles' | 'playlists';

export default function Sidebar({ selectedView, onSelectView }: SidebarProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<SectionKey, boolean>>({
    tracked: false,
    consoles: false,
    playlists: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSection = (key: SectionKey) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const clamped = Math.min(600, Math.max(200, e.clientX));
      sidebarRef.current.style.width = `${clamped}px`;
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div className="sidebar" ref={sidebarRef}>
      <button
        type="button"
        className={`sidebar-home-btn${selectedView === 'home' || selectedView === '' ? ' active' : ''}`}
        onClick={() => onSelectView('home')}
      >
        <span className="sidebar-home-icon">⌂</span>
        <span>Home</span>
      </button>
      <div className="sidebar-scroll">
        <TrackedGamesSection
          selectedView={selectedView}
          onSelectView={onSelectView}
          collapsed={collapsedSections.tracked}
          onToggleCollapse={() => toggleSection('tracked')}
        />
        <ConsolesSection
          selectedView={selectedView}
          onSelectView={onSelectView}
          collapsed={collapsedSections.consoles}
          onToggleCollapse={() => toggleSection('consoles')}
        />
        <PlaylistsSection
          selectedView={selectedView}
          onSelectView={onSelectView}
          collapsed={collapsedSections.playlists}
          onToggleCollapse={() => toggleSection('playlists')}
        />
      </div>
      <SidebarProfile />
      <div
        className={`sidebar-resize-handle ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

