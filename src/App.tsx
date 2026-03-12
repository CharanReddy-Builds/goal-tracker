import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import MyGoals from './pages/MyGoals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';

type Page = 'landing' | 'auth' | 'dashboard' | 'goals' | 'analytics' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated && currentPage !== 'landing' && currentPage !== 'auth') {
    setCurrentPage('landing');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {isAuthenticated && <Sidebar currentPage={currentPage} navigateTo={navigateTo} onLogout={handleLogout} />}

      <div className={isAuthenticated ? 'md:ml-64' : ''}>
        {currentPage === 'landing' && <LandingPage onNavigate={() => navigateTo('auth')} />}
        {currentPage === 'auth' && <AuthPage onLogin={handleLogin} onBack={() => navigateTo('landing')} />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'goals' && <MyGoals />}
        {currentPage === 'analytics' && <Analytics />}
        {currentPage === 'settings' && <Settings />}
      </div>
    </div>
  );
}

export default App;
