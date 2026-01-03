import React, { useState, useEffect } from 'react';
import { User } from './types';
import { LoginPage } from './pages/LoginPage';
import { TeamDashboard } from './pages/TeamDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Layout } from './components/Layout';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session (simulated)
    const storedUser = localStorage.getItem('vignan_user_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
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
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
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