import type { Game } from '../../mockData';
import GameCard from './GameCard';
import GameListView from './GameListView';
import SectionToolbar from './SectionToolbar';
import type { ViewConfig, SortField } from './viewConfig';

export function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="section-header">
      <h2>
        {title}
        {count !== undefined && <span className="section-count"> ({count} GAMES)</span>}
      </h2>
    </div>
  );
}

const STATUS_ORDER: Record<string, number> = { completed: 2, 'in-progress': 1, 'not-started': 0 };

function sortGames(games: Game[], field: SortField, dir: 'asc' | 'desc'): Game[] {
  return [...games].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'console':
        cmp = a.console.localeCompare(b.console);
        break;
      case 'lastPlayed':
        cmp = (a.lastPlayed ?? '').localeCompare(b.lastPlayed ?? '');
        break;
      case 'achievementPercent':
        cmp = (a.achievementPercent ?? -1) - (b.achievementPercent ?? -1);
        break;
      case 'status':
        cmp =
          (STATUS_ORDER[a.status ?? 'not-started'] ?? 0) -
          (STATUS_ORDER[b.status ?? 'not-started'] ?? 0);
        break;
    }
    return dir === 'asc' ? cmp : -cmp;
  });
}

interface GameSectionProps {
  title: string;
  games: Game[];
  config: ViewConfig;
  onConfigChange: (c: ViewConfig) => void;
  onGameClick?: (gameId: number) => void;
}

export default function GameSection({
  title,
  games,
  config,
  onConfigChange,
  onGameClick,
}: GameSectionProps) {
  const sorted = sortGames(games, config.sort.field, config.sort.dir);

  const handleSortChange = (field: SortField) =>
    onConfigChange({
      ...config,
      sort: {
        field,
        dir: config.sort.field === field && config.sort.dir === 'asc' ? 'desc' : 'asc',
      },
    });

  return (
    <>
      <SectionToolbar
        title={title}
        count={games.length}
        config={config}
        onConfigChange={onConfigChange}
      />
      {config.mode === 'list' ? (
        <GameListView
          games={sorted}
          columns={config.columns}
          sort={config.sort}
          onSortChange={handleSortChange}
          onGameClick={onGameClick}
        />
      ) : (
        <div className="game-grid">
          {sorted.map((g) => (
            <GameCard key={g.id} game={g} onClick={() => onGameClick?.(g.id)} />
          ))}
        </div>
      )}
    </>
  );
}
