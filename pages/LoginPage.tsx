import React, { useState } from 'react';
import { dbService } from '../services/mockDb';
import { User } from '../types';
import { Rocket, Lock, Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await dbService.login(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
         {/* Abstract Backgrounds */}
         <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-violet-600/30 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/30 rounded-full blur-[100px]"></div>
         
         <div className="relative z-10 max-w-lg text-white">
            <div className="mb-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Rocket className="w-5 h-5 text-indigo-300" />
                <span className="text-sm font-medium tracking-wide">Vignan's Hackfest 2025</span>
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Innovate.<br/>
                Build.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Transform.</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Welcome to the official management portal. Track your progress, manage your team, and stay updated in real-time.
            </p>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <h3 className="font-bold text-xl mb-1">24h</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Hack Duration</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <h3 className="font-bold text-xl mb-1">50+</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Teams</p>
                </div>
            </div>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <div className="lg:hidden flex justify-center mb-6">
                     <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="mt-2 text-slate-500">Sign in to access your dashboard.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            placeholder="name@vignan.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100 flex items-center animate-in fade-in slide-in-from-top-2">
                        <div className="flex-shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-rose-800">{error}</p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-500/20 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform hover:scale-[1.01]"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : (
                        <>Sign In <ArrowRight className="ml-2 w-4 h-4" /></>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Demo Access</p>
                <div className="grid grid-cols-1 gap-3">
                     <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                        <span className="font-bold">Team</span>
                        <code className="bg-slate-100 px-2 py-1 rounded">team@vignan.com / team123</code>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                        <span className="font-bold">Volunteer</span>
                        <code className="bg-slate-100 px-2 py-1 rounded">volunteer@vignan.com / vol123</code>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                        <span className="font-bold">Admin</span>
                        <code className="bg-slate-100 px-2 py-1 rounded">admin@vignan.com / admin123</code>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};