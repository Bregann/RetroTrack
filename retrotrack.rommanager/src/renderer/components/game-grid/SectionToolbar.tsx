import { useState, useRef, useEffect } from 'react';
import {
  ALL_COLUMNS,
  type ViewConfig,
  type SortField,
  type ListColumn,
} from './viewConfig';

interface Props {
  title: string;
  count?: number;
  config: ViewConfig;
  onConfigChange: (config: ViewConfig) => void;
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: 'title', label: 'Name' },
  { field: 'console', label: 'Console' },
  { field: 'lastPlayed', label: 'Last Played' },
  { field: 'achievementPercent', label: 'Achievements' },
  { field: 'status', label: 'Status' },
];

export default function SectionToolbar({ title, count, config, onConfigChange }: Props) {
  const [showSort, setShowSort] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSort(false);
      if (colRef.current && !colRef.current.contains(e.target as Node)) setShowColumns(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const setMode = (mode: 'grid' | 'list') =>
    onConfigChange({ ...config, mode });

  const setSort = (field: SortField) => {
    const dir = config.sort.field === field && config.sort.dir === 'asc' ? 'desc' : 'asc';
    onConfigChange({ ...config, sort: { field, dir } });
    setShowSort(false);
  };

  const toggleColumn = (col: ListColumn) => {
    if (col === 'title') return; // title is always visible
    const cols = config.columns.includes(col)
      ? config.columns.filter((c) => c !== col)
      : [...config.columns, col];
    onConfigChange({ ...config, columns: cols });
  };

  return (
    <div className="section-toolbar">
      <h2 className="section-toolbar-title">
        {title}
        {count !== undefined && (
          <span className="section-count"> ({count} GAMES)</span>
        )}
      </h2>

      <div className="section-toolbar-actions">
        {/* View toggle */}
        <div className="st-view-toggle">
          <button
            type="button"
            className={`st-view-btn ${config.mode === 'grid' ? 'active' : ''}`}
            title="Grid view"
            onClick={() => setMode('grid')}
          >
            ▦
          </button>
          <button
            type="button"
            className={`st-view-btn ${config.mode === 'list' ? 'active' : ''}`}
            title="List view"
            onClick={() => setMode('list')}
          >
            ☰
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="st-dropdown-wrap" ref={sortRef}>
          <button
            type="button"
            className="st-btn"
            onClick={() => { setShowSort(!showSort); setShowColumns(false); }}
          >
            Sort: {SORT_OPTIONS.find((s) => s.field === config.sort.field)?.label}
            {' '}
            {config.sort.dir === 'asc' ? '↑' : '↓'}
          </button>
          {showSort && (
            <div className="st-dropdown">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.field}
                  type="button"
                  className={`st-dropdown-item ${config.sort.field === opt.field ? 'active' : ''}`}
                  onClick={() => setSort(opt.field)}
                >
                  {opt.label}
                  {config.sort.field === opt.field && (
                    <span className="st-sort-arrow">
                      {config.sort.dir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Column picker (list mode only) */}
        {config.mode === 'list' && (
          <div className="st-dropdown-wrap" ref={colRef}>
            <button
              type="button"
              className="st-btn"
              onClick={() => { setShowColumns(!showColumns); setShowSort(false); }}
            >
              Columns ▾
            </button>
            {showColumns && (
              <div className="st-dropdown">
                {ALL_COLUMNS.map((col) => (
                  <label key={col.key} className="st-column-item">
                    <input
                      type="checkbox"
                      checked={config.columns.includes(col.key)}
                      disabled={col.key === 'title'}
                      onChange={() => toggleColumn(col.key)}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
