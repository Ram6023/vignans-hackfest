import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LogOut, Rocket, Zap, Menu, X, Settings, ChevronDown, User as UserIcon, Shield, Users, Wifi, WifiOff, Award } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { useConnectionStatus } from '../hooks/useRealtime';

// Connection Status Indicator Component
const ConnectionStatus: React.FC = () => {
  const { isOnline } = useConnectionStatus();

  return (
    <div className={`flex items-center px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isOnline
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-rose-100 text-rose-700'
      }`}>
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5 mr-1.5" />
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 mr-1.5" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, title = "Vignan's Hackfest" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'volunteer': return Zap;
      case 'team': return Users;
      case 'judge': return Award;
      default: return UserIcon;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return { bg: 'bg-rose-100', text: 'text-rose-600', dot: 'bg-rose-500' };
      case 'volunteer': return { bg: 'bg-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-500' };
      case 'team': return { bg: 'bg-violet-100', text: 'text-violet-600', dot: 'bg-violet-500' };
      case 'judge': return { bg: 'bg-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-500' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-500' };
    }
  };

  const roleColors = user ? getRoleColor(user.role) : getRoleColor('default');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating Glass Header */}
      <div className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
        <header
          className={`glass-panel rounded-2xl transition-all duration-300 max-w-7xl mx-auto ${scrolled
            ? 'shadow-xl shadow-slate-200/40 border-white/80'
            : 'shadow-lg shadow-slate-200/20'
            }`}
        >
          <div className="px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <a href="/" className="relative group">
                <img
                  src="/vignan-logo.png"
                  alt="Vignan Logo"
                  className="h-10 w-auto drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </a>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-0.5">Innovation Portal</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden sm:flex items-center space-x-3">
                {/* Connection Status */}
                <ConnectionStatus />

                {/* Real-time Notification Center */}
                <NotificationCenter />

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200"></div>

                {/* Profile Section */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-3 p-2 pr-3 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl ${roleColors.bg} ${roleColors.text} flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* User Info */}
                    <div className="hidden md:flex flex-col items-start">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <div className="flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full ${roleColors.dot} mr-1.5`}></span>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{user.role}</p>
                      </div>
                    </div>

                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileDropdown(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-20 animate-[scaleIn_0.2s_ease-out]">
                        <div className="p-4 border-b border-slate-100">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl ${roleColors.bg} ${roleColors.text} flex items-center justify-center font-bold`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                            <UserIcon className="w-4 h-4" />
                            <span>View Profile</span>
                          </button>
                          <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                        </div>
                        <div className="p-2 border-t border-slate-100">
                          <button
                            onClick={onLogout}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-sm font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && user && (
            <div className="sm:hidden border-t border-slate-200/60 p-4 animate-[slideDown_0.2s_ease-out]">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 mb-3">
                <div className={`w-10 h-10 rounded-xl ${roleColors.bg} ${roleColors.text} flex items-center justify-center font-bold text-sm`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <div className="flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full ${roleColors.dot} mr-1.5`}></span>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{user.role}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-2">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-sm py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest">Powered by Vignan's Innovation</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Vignan's Hackfest. <span className="hidden sm:inline">Built for speed, reliability, and innovation.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};