import React, { useState, useEffect } from 'react';
import { User, Team } from './types';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TeamDashboard } from './pages/TeamDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { JudgeDashboard } from './pages/JudgeDashboard';
import { Layout } from './components/Layout';
import { wsService } from './services/websocket';

type AppView = 'landing' | 'login' | 'register' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');

  useEffect(() => {
    // Initialize WebSocket connection
    wsService.connect().catch(console.error);

    // Check local storage for session
    const storedUser = localStorage.getItem('vignan_user_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView('dashboard');
    }

    // Cleanup on unmount
    return () => {
      wsService.disconnect();
    };
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('vignan_user_session', JSON.stringify(loggedInUser));
    setCurrentView('dashboard');
  };

  const handleRegister = (team: Team) => {
    // After registration, automatically log in the new team
    const newUser: User = {
      id: team.id,
      email: team.email,
      name: team.name,
      role: 'team'
    };
    handleLogin(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vignan_user_session');
    setCurrentView('landing');
  };

  const handleShowLogin = () => {
    setCurrentView('login');
  };

  const handleShowRegister = () => {
    setCurrentView('register');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };


  // Show landing page
  if (currentView === 'landing' && !user) {
    return <LandingPage onGetStarted={handleShowLogin} />;
  }

  // Show registration page
  if (currentView === 'register') {
    return <RegisterPage onRegister={handleRegister} onBack={handleBackToLanding} />;
  }

  // Show login page
  if (currentView === 'login' && !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show dashboard based on user role
  if (user) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        {user.role === 'team' && <TeamDashboard teamId={user.id} />}
        {user.role === 'volunteer' && <VolunteerDashboard volunteerId={user.id} />}
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'judge' && <JudgeDashboard judgeId={user.id} />}
      </Layout>
    );
  }

  // Fallback to login
  return <LoginPage onLogin={handleLogin} />;
};

export default App;