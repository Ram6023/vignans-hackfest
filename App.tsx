import React, { useState, useEffect } from 'react';
import { User, Team } from './types';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TeamDashboard } from './pages/TeamDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Layout } from './components/Layout';
import { wsService } from './services/websocket';
import { Rocket, Loader2 } from 'lucide-react';

type AppView = 'landing' | 'login' | 'register' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

    // Simulate a brief loading time for smoother UX
    setTimeout(() => setLoading(false), 800);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-5 rounded-3xl shadow-2xl shadow-violet-500/50">
              <Rocket className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Vignan's Hackfest</h1>
          <p className="text-slate-400 font-medium mb-8">Loading your experience...</p>

          {/* Loading Spinner */}
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
            <span className="text-sm font-medium text-slate-500">Preparing dashboard</span>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

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
      </Layout>
    );
  }

  // Fallback to login
  return <LoginPage onLogin={handleLogin} />;
};

export default App;