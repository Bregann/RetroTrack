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
  const [previousView, setPreviousView] = useState('home');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showEmulatorSettings, setShowEmulatorSettings] = useState(false);
  const [libraryModal, setLibraryModal] = useState<LibraryModalMode>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    if (view.startsWith('game-')) {
      if (!selectedView.startsWith('game-')) setPreviousView(selectedView);
      const id = parseInt(view.replace('game-', ''), 10);
      if (!isNaN(id)) setSelectedGameId(id);
    } else {
      setSelectedGameId(null);
    }
    setSelectedView(view);
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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="app-body">
        <Sidebar selectedView={selectedView} onSelectView={handleSelectView} />
        <main className="main-content">
          {selectedGameId !== null ? (
            <GameDetailPage
              gameId={selectedGameId}
              onBack={() => handleSelectView(previousView)}
            />
          ) : (
            <GameGrid
              selectedView={selectedView}
              onGameClick={(id) => handleSelectView(`game-${id}`)}
              onSelectView={handleSelectView}
              searchQuery={searchQuery}
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
