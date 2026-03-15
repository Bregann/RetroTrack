import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import { useRefreshLibrary } from './helpers/useLibraryData';
import TopMenuBar from './components/TopMenuBar';
import { useAuth } from './context/authContext';
import Sidebar from './components/Sidebar';
import GameGrid from './components/GameGrid';
import GameDetailPage from './components/GameDetail';
import EmulatorSettings from './components/EmulatorSettings';
import LibraryModals, { LibraryModalMode } from './components/LibraryModals';
import { useSessionReporter } from './helpers/useSessionReporter';
import './styles/main.scss';

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const refreshLibrary = useRefreshLibrary();
  useSessionReporter();
  const [selectedView, setSelectedView] = useState('home');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showEmulatorSettings, setShowEmulatorSettings] = useState(false);
  const [libraryModal, setLibraryModal] = useState<LibraryModalMode>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    setSelectedView('home');
    setSelectedGameId(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectView = (view: string) => {
    setSelectedView(view);
    if (view.startsWith('game-')) {
      const id = parseInt(view.replace('game-', ''), 10);
      if (!isNaN(id)) setSelectedGameId(id);
    } else {
      setSelectedGameId(null);
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-shell">
      <TopMenuBar
        onLogout={handleLogout}
        onSyncLibrary={refreshLibrary}
        theme={theme}
        onToggleTheme={toggleTheme}
        onManageEmulators={() => setShowEmulatorSettings(true)}
        onLibraryAction={(action: LibraryModalMode) => setLibraryModal(action)}
      />
      <div className="app-body">
        <Sidebar selectedView={selectedView} onSelectView={handleSelectView} />
        <main className="main-content">
          {selectedGameId !== null ? (
            <GameDetailPage
              gameId={selectedGameId}
              onBack={() => setSelectedGameId(null)}
            />
          ) : (
            <GameGrid
              selectedView={selectedView}
              onGameClick={(id) => setSelectedGameId(id)}
              onSelectView={handleSelectView}
            />
          )}
        </main>
      </div>
      {showEmulatorSettings && (
        <EmulatorSettings onClose={() => setShowEmulatorSettings(false)} />
      )}
      <LibraryModals mode={libraryModal} onClose={() => setLibraryModal(null)} />
    </div>
  );
}
