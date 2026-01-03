import React, { useState, useEffect } from 'react';
import { User } from './types';
import { LoginPage } from './pages/LoginPage';
import { TeamDashboard } from './pages/TeamDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Layout } from './components/Layout';
import { Rocket, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session (simulated)
    const storedUser = localStorage.getItem('vignan_user_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Simulate a brief loading time for smoother UX
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('vignan_user_session', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vignan_user_session');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-5 rounded-3xl shadow-2xl shadow-violet-500/30">
              <Rocket className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Vignan's Hackfest</h1>
          <p className="text-slate-500 font-medium mb-8">Innovation Portal</p>

          {/* Loading Spinner */}
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
            <span className="text-sm font-medium text-slate-500">Loading your experience...</span>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center space-x-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-violet-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      {user.role === 'team' && <TeamDashboard teamId={user.id} />}
      {user.role === 'volunteer' && <VolunteerDashboard volunteerId={user.id} />}
      {user.role === 'admin' && <AdminDashboard />}
    </Layout>
  );
};

export default App;