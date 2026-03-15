import type { Achievement } from '../../helpers/achievementTypes';

interface Props {
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
  onShowAll: () => void;
}

export default function GameDetailAchievementsPreview({
  achievements,
  unlockedCount,
  totalCount,
  onShowAll,
}: Props) {
  if (totalCount === 0) return null;

  return (
    <div className="gd-section">
      <div className="gd-section-header-row">
        <h3 className="gd-section-title">
          Achievements ({unlockedCount} of {totalCount})
        </h3>
        <button type="button" className="gd-view-all-btn" onClick={onShowAll}>
          View All →
        </button>
      </div>
      <div className="gd-achievements-preview">
        {achievements.slice(0, 5).map((ach) => (
          <div
            key={ach.id}
            className={[
              'gd-ach-preview-item',
              ach.unlocked ? 'unlocked' : 'locked',
              ach.type === 'missable' ? 'missable' : '',
              ach.type === 'win' ? 'win-cond' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className={`gd-ach-preview-icon ${!ach.unlocked ? 'locked-icon' : ''}`}>
              {ach.icon}
            </span>
            <div className="gd-ach-preview-info">
              <span className="gd-ach-preview-title">
                {ach.title}
                {ach.type === 'missable' && (
                  <span className="ach-type-badge ach-type-missable" title="Missable">
                    ⚠ Missable
                  </span>
                )}
                {ach.type === 'win' && (
                  <span className="ach-type-badge ach-type-win" title="Win Condition">
                    ★ Win
                  </span>
                )}
              </span>
              <span className="gd-ach-preview-desc">{ach.description}</span>
            </div>
            {ach.unlocked && <span className="gd-ach-check">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
