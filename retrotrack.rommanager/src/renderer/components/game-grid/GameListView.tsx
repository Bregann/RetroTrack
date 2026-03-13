import { getGameDetail, type Game } from '../../mockData';
import type { ListColumn, SortConfig, SortField } from './viewConfig';
import { ALL_COLUMNS } from './viewConfig';

const SORTABLE: Partial<Record<ListColumn, SortField>> = {
  title: 'title',
  console: 'console',
  status: 'status',
  achievementPercent: 'achievementPercent',
  lastPlayed: 'lastPlayed',
};

interface Props {
  games: Game[];
  columns: ListColumn[];
  sort: SortConfig;
  onSortChange: (field: SortField) => void;
  onGameClick?: (gameId: number) => void;
}

function formatStatus(status?: string) {
  if (status === 'in-progress') return 'In Progress';
  if (status === 'completed') return 'Completed';
  return 'Not Started';
}

function statusClass(status?: string) {
  if (status === 'in-progress') return 'gl-status gl-status-progress';
  if (status === 'completed') return 'gl-status gl-status-complete';
  return 'gl-status gl-status-not-started';
}

function CellValue({ game, col }: { game: Game; col: ListColumn }) {
  const detail = (col === 'achievementsUnlocked' || col === 'achievementsTotal')
    ? getGameDetail(game.id)
    : null;

  switch (col) {
    case 'title':
      return <span className="gl-cell-title">{game.title}</span>;
    case 'console':
      return <span>{game.console}</span>;
    case 'status':
      return <span className={statusClass(game.status)}>{formatStatus(game.status)}</span>;
    case 'achievementsUnlocked': {
      if (!detail || detail.achievements.length === 0) return <span className="gl-cell-na">—</span>;
      const unlocked = detail.achievements.filter((a) => a.unlocked).length;
      return <span>{unlocked}</span>;
    }
    case 'achievementsTotal': {
      if (!detail || detail.achievements.length === 0) return <span className="gl-cell-na">—</span>;
      return <span>{detail.achievements.length}</span>;
    }
    case 'achievementPercent':
      return game.achievementPercent !== undefined ? (
        <span>{game.achievementPercent}%</span>
      ) : (
        <span className="gl-cell-na">—</span>
      );
    case 'lastPlayed':
      return <span>{game.lastPlayed || '—'}</span>;
    case 'favorite':
      return <span>{game.favorite ? '★' : ''}</span>;
    default:
      return <span>—</span>;
  }
}

export default function GameListView({ games, columns, sort, onSortChange, onGameClick }: Props) {
  const colDefs = columns.map((key) => ALL_COLUMNS.find((c) => c.key === key)!);

  return (
    <div className="gl-table-wrap">
      <table className="gl-table">
        <thead>
          <tr>
            {colDefs.map((col) => {
              const sortField = SORTABLE[col.key];
              const isActive = sortField !== undefined && sort.field === sortField;
              return (
                <th
                  key={col.key}
                  className={`gl-th gl-th-${col.key}${sortField ? ' gl-th-sortable' : ''}${isActive ? ' gl-th-active' : ''}`}
                  onClick={sortField ? () => onSortChange(sortField) : undefined}
                >
                  {col.label}
                  {isActive && (
                    <span className="gl-sort-arrow">{sort.dir === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              key={game.id}
              className="gl-row"
              onClick={() => onGameClick?.(game.id)}
            >
              {columns.map((col) => (
                <td key={col} className={`gl-td gl-td-${col}`}>
                  <CellValue game={game} col={col} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
