import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LogOut, Rocket, Zap, Menu, X, Bell, Settings, ChevronDown, User as UserIcon, Shield, Users } from 'lucide-react';

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
  const [showNotifications, setShowNotifications] = useState(false);

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
      default: return UserIcon;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return { bg: 'bg-rose-100', text: 'text-rose-600', dot: 'bg-rose-500' };
      case 'volunteer': return { bg: 'bg-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-500' };
      case 'team': return { bg: 'bg-violet-100', text: 'text-violet-600', dot: 'bg-violet-500' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-500' };
    }
  };

  const RoleIcon = user ? getRoleIcon(user.role) : UserIcon;
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
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg text-white transform group-hover:scale-105 transition-transform">
                  <Rocket className="w-5 h-5" />
                </div>
              </div>
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
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-20 animate-[scaleIn_0.2s_ease-out]">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                          <h3 className="font-bold text-slate-900">Notifications</h3>
                          <p className="text-xs text-slate-500">Stay updated with the latest</p>
                        </div>
                        <div className="p-2 max-h-64 overflow-y-auto">
                          <div className="p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
                                <Bell className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900">New announcement</p>
                                <p className="text-xs text-slate-500 truncate">Check the latest updates from admin</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                <Zap className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900">Hackathon in progress</p>
                                <p className="text-xs text-slate-500 truncate">Don't forget to submit before deadline!</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

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