import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/mockDb';
import { User } from '../types';
import { Rocket, Lock, Mail, Loader2, ArrowRight, CheckCircle2, Sparkles, Zap, Users, Trophy, Calendar, Star, XCircle, Award } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onShowRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await dbService.login(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
    setIsLoading(true);

    try {
      const user = await dbService.login(userEmail, userPassword);
      if (user) {
        onLogin(user);
      } else {
        setError('Quick login failed');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: Users, value: '50+', label: 'Teams', color: 'from-violet-500 to-purple-600' },
    { icon: Trophy, value: '24h', label: 'Duration', color: 'from-amber-500 to-orange-600' },
    { icon: Star, value: '₹1L+', label: 'Prizes', color: 'from-emerald-500 to-teal-600' },
  ];

  const demoAccounts = [
    { role: 'Team', email: 'team@vignan.com', password: 'team123', icon: Users, color: 'violet' },
    { role: 'Volunteer', email: 'volunteer@vignan.com', password: 'vol123', icon: Zap, color: 'emerald' },
    { role: 'Judge', email: 'judge@vignan.com', password: 'judge123', icon: Award, color: 'indigo' },
    { role: 'Admin', email: 'admin@vignan.com', password: 'admin123', icon: Sparkles, color: 'rose' },
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
          {/* Animated Orbs */}
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/15 blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center px-10 py-10 h-full">
          {/* VHACK 2.0 Branding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex flex-col items-center"
          >
            {/* VHACK 2.0 — Single Line */}
            <h1 className="flex items-baseline gap-3 group cursor-default">
              <span className="text-6xl xl:text-8xl font-black tracking-tighter leading-none uppercase bg-gradient-to-r from-white via-violet-100 to-indigo-100 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all duration-1000">
                VHACK
              </span>
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
                className="text-4xl xl:text-6xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
              >
                2.0
              </motion.span>
            </h1>

            {/* 2K26 — Below */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
              className="text-3xl xl:text-5xl font-black tracking-[0.3em] bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mt-1"
            >
              2K26
            </motion.span>
          </motion.div>

          {/* Tagline */}
          <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white mb-3 leading-[1.1]">
            <span>Innovate. </span>
            <span>Build. </span>
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Transform.
            </span>
          </h2>

          {/* Description */}
          <p className="text-sm xl:text-base text-slate-400 max-w-sm mb-8 leading-relaxed font-medium">
            Official management portal — track progress, connect with mentors, and shape the future of innovation.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-white/20 cursor-pointer"
              >
                <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg mb-2`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-0.5">{stat.value}</h3>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bottom Decoration */}
          <div className="absolute bottom-6 left-10 right-10 flex items-center space-x-3 text-slate-600">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">February 2026</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #64748b 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative w-full max-w-md space-y-6">
          {/* Mobile Branding */}
          <div className="text-center lg:hidden">
            <h2 className="text-2xl font-black text-slate-900">VHACK <span className="text-violet-600">2.0</span></h2>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">2K26</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Sign in to access your dashboard.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'email' ? 'text-violet-600' : 'text-slate-400'}`}>
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all shadow-sm hover:border-slate-300"
                placeholder="name@vignan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'password' ? 'text-violet-600' : 'text-slate-400'}`}>
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all shadow-sm hover:border-slate-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-[slideDown_0.3s_ease-out]">
                <div className="flex-shrink-0 p-1 bg-rose-100 rounded-lg">
                  <XCircle className="h-4 w-4 text-rose-600" />
                </div>
                <p className="ml-3 text-sm font-semibold text-rose-700">{error}</p>
              </div>
            )}

            {/* Submit Button - Slide-In Effect */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-slide-in-primary w-full py-4 px-6 text-base focus:outline-none focus:ring-4 focus:ring-violet-500/30"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-semibold uppercase tracking-wider text-xs">Quick Demo Access</span>
            </div>
          </div>

          {/* Demo Access Cards - Premium Icons */}
          <div className="grid grid-cols-4 gap-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => handleQuickLogin(account.email, account.password)}
                disabled={isLoading}
                className={`group relative p-3 rounded-xl border-2 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 overflow-hidden ${account.color === 'violet'
                  ? 'border-violet-200 bg-violet-50/50 hover:bg-violet-100/80 hover:border-violet-400'
                  : account.color === 'emerald'
                    ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/80 hover:border-emerald-400'
                    : 'border-rose-200 bg-rose-50/50 hover:bg-rose-100/80 hover:border-rose-400'
                  }`}
              >
                {/* Premium Icon with Glow Effect */}
                <div className="relative mb-3">
                  <div className={`absolute inset-0 rounded-xl blur-md transition-all duration-500 group-hover:blur-lg ${account.color === 'violet'
                    ? 'bg-violet-400/40 group-hover:bg-violet-500/60'
                    : account.color === 'emerald'
                      ? 'bg-emerald-400/40 group-hover:bg-emerald-500/60'
                      : 'bg-rose-400/40 group-hover:bg-rose-500/60'
                    }`}></div>
                  <div className={`relative inline-flex p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${account.color === 'violet'
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                    : account.color === 'emerald'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30'
                    }`}>
                    <account.icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-sm">{account.role}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5 group-hover:text-slate-600 transition-colors">Click to login</p>
              </button>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 font-medium">
            © 2026 VHACK 2.0. Built for innovators.
          </p>
        </div>
      </div>
    </div>
  );
};