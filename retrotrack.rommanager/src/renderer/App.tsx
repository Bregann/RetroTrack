import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import TopMenuBar from './components/TopMenuBar';
import Sidebar from './components/Sidebar';
import GameGrid from './components/GameGrid';
import './App.css';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedView, setSelectedView] = useState('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogin = (user: string) => {
    setUsername(user);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setSelectedView('home');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <TopMenuBar onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
      <div className="app-body">
        <Sidebar selectedView={selectedView} onSelectView={setSelectedView} />
        <main className="main-content">
          <GameGrid selectedView={selectedView} />
        </main>
      </div>
    </div>
  );
}
