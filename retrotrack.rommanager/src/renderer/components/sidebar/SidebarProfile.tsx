import { MOCK_USER } from '../../mockData';

export default function SidebarProfile() {
  return (
    <div className="sidebar-profile">
      <div className="profile-card">
        <div
          className="profile-avatar"
          style={{ backgroundColor: MOCK_USER.avatarColor }}
        >
          {MOCK_USER.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <span className="profile-username">{MOCK_USER.username}</span>
          <span className="profile-achievements">
            Achievements Unlocked: {MOCK_USER.achievementsUnlocked.toLocaleString()}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="profile-edit-btn"
        onClick={() => window.open('https://retrotrack.app/profile', '_blank')}
      >
        View Profile
      </button>
    </div>
  );
}
