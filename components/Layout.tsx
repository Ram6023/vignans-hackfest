import React from 'react';
import { User } from '../types';
import { LogOut, Rocket, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, title = "Vignan's Hackfest" }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating Glass Header */}
      <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <header className="glass-panel rounded-2xl shadow-lg shadow-slate-200/50">
          <div className="px-6 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-violet-500/20 text-white">
                <Rocket className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                {title}
              </h1>
            </div>
            
            {user && (
              <div className="flex items-center space-x-5">
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`h-2 w-2 rounded-full ${user.role === 'admin' ? 'bg-rose-500' : user.role === 'team' ? 'bg-violet-500' : 'bg-emerald-500'}`}></span>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{user.role}</p>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
                <button
                  onClick={onLogout}
                  className="group p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </header>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-2">
        {children}
      </main>

      <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-sm py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <Zap className="w-4 h-4" />
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