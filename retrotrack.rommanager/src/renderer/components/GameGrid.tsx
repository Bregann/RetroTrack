import { useCallback, useState } from 'react';
import {
  CONSOLES,
  CUSTOM_CATEGORIES,
  PLAYLISTS,
  getTrackedGames,
  getGamesByConsole,
  getGameById,
  type Game,
} from '../mockData';
import { DEFAULT_VIEW_CONFIG, type ViewConfig } from './game-grid/viewConfig';
import GameSection, { SectionHeader } from './game-grid/GameSection';
import HomeView from './game-grid/HomeView';

interface GameGridProps {
  selectedView: string;
  onGameClick?: (gameId: number) => void;
  onSelectView?: (view: string) => void;
}

function SectionView({ children }: { children: React.ReactNode }) {
  return <div className="game-grid-container">{children}</div>;
}

export default function GameGrid({ selectedView, onGameClick, onSelectView }: GameGridProps) {
  const [viewConfigs, setViewConfigs] = useState<Record<string, ViewConfig>>({});

  const getConfig = useCallback(
    (key: string): ViewConfig => viewConfigs[key] ?? DEFAULT_VIEW_CONFIG,
    [viewConfigs],
  );

  const setConfig = useCallback(
    (key: string) => (cfg: ViewConfig) =>
      setViewConfigs((prev) => ({ ...prev, [key]: cfg })),
    [],
  );

  if (selectedView === 'home' || selectedView === '') {
    return <HomeView onGameClick={onGameClick} onSelectView={onSelectView} />;
  }

  if (selectedView === 'consoles') {
    return (
      <SectionView>
        <SectionHeader title="All Consoles" count={CONSOLES.length} />
        <div className="browse-card-grid">
          {CONSOLES.map((c) => (
            <button
              key={c.shortName}
              type="button"
              className="browse-card"
              onClick={() => onSelectView?.(`console-${c.shortName}`)}
            >
              <span className="browse-card-icon">{c.icon}</span>
              <span className="browse-card-name">{c.name}</span>
              <span className="browse-card-meta">{getGamesByConsole(c.name).length} games</span>
            </button>
          ))}
        </div>
      </SectionView>
    );
  }

  if (selectedView === 'playlists') {
    return (
      <SectionView>
        <SectionHeader title="RetroTrack Playlists" count={PLAYLISTS.length} />
        <div className="browse-card-grid">
          {PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              type="button"
              className="browse-card"
              onClick={() => onSelectView?.(`playlist-${pl.id}`)}
            >
              <span className="browse-card-icon">{pl.icon}</span>
              <span className="browse-card-name">{pl.name}</span>
              <span className="browse-card-meta">{pl.gameIds.length} games</span>
            </button>
          ))}
        </div>
      </SectionView>
    );
  }

  if (selectedView === 'tracked') {
    return (
      <SectionView>
        <GameSection
          title="MY TRACKED GAMES"
          games={getTrackedGames()}
          config={getConfig('tracked')}
          onConfigChange={setConfig('tracked')}
          onGameClick={onGameClick}
        />
      </SectionView>
    );
  }

  const consoleMatch = selectedView.match(/^console-(.+)$/);
  if (consoleMatch) {
    const shortName = consoleMatch[1];
    const consoleInfo = CONSOLES.find((c) => c.shortName === shortName);
    if (consoleInfo) {
      const cfgKey = `console-${shortName}`;
      return (
        <SectionView>
          <GameSection
            title={`CONSOLES: ${consoleInfo.name}`}
            games={getGamesByConsole(consoleInfo.name)}
            config={getConfig(cfgKey)}
            onConfigChange={setConfig(cfgKey)}
            onGameClick={onGameClick}
          />
        </SectionView>
      );
    }
  }

  const catMatch = selectedView.match(/^cat-(\d+)$/);
  if (catMatch) {
    const cat = CUSTOM_CATEGORIES.find((c) => c.id === Number(catMatch[1]));
    if (cat) {
      const games = cat.gameIds.map((id) => getGameById(id)).filter(Boolean) as Game[];
      const cfgKey = `cat-${cat.id}`;
      return (
        <SectionView>
          <GameSection
            title={`${cat.icon} ${cat.name}`}
            games={games}
            config={getConfig(cfgKey)}
            onConfigChange={setConfig(cfgKey)}
            onGameClick={onGameClick}
          />
        </SectionView>
      );
    }
  }

  const plMatch = selectedView.match(/^playlist-(\d+)$/);
  if (plMatch) {
    const pl = PLAYLISTS.find((p) => p.id === Number(plMatch[1]));
    if (pl) {
      const games = pl.gameIds.map((id) => getGameById(id)).filter(Boolean) as Game[];
      const cfgKey = `playlist-${pl.id}`;
      return (
        <SectionView>
          <GameSection
            title={`${pl.icon} ${pl.name}`}
            games={games}
            config={getConfig(cfgKey)}
            onConfigChange={setConfig(cfgKey)}
            onGameClick={onGameClick}
          />
        </SectionView>
      );
    }
  }

  return <HomeView onGameClick={onGameClick} onSelectView={onSelectView} />;
}
