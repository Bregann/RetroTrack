import { useLibraryData } from '../../helpers/useLibraryData';

export default function SidebarProfile() {
  const { data } = useLibraryData();

  const raUsername = data?.raUsername ?? '';
  const profileImageUrl = data?.profileImageUrl ?? '';
  const achievementsEarned = data?.achievementsEarnedHardcore ?? 0;
  const hardcorePoints = data?.hardcorePoints ?? 0;

  return (
    <div className="sidebar-profile">
      <div className="profile-card">
        <div className="profile-avatar">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={raUsername} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            raUsername.charAt(0).toUpperCase()
          )}
        </div>
        <div className="profile-info">
          <span className="profile-username">{raUsername}</span>
          <span className="profile-achievements">
            Achievements Unlocked: {achievementsEarned.toLocaleString()}
          </span>
          <span className="profile-achievements">
            Hardcore Points: {hardcorePoints.toLocaleString()}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="profile-edit-btn"
        onClick={() => window.open(`https://retroachievements.org/user/${raUsername}`, '_blank')}
      >
        View Profile
      </button>
    </div>
  );
}
