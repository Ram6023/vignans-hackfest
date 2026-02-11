import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, Flame, Zap } from 'lucide-react';

interface TimerProps {
  startTime?: string;
  endTime: string;
}

export const Timer: React.FC<TimerProps> = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [status, setStatus] = useState<'starting' | 'running' | 'ending' | 'ended'>('running');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = +new Date();
      const start = startTime ? +new Date(startTime) : 0;
      const end = +new Date(endTime);

      if (start > now) {
        // Hasn't started yet
        const difference = start - now;
        const hours = Math.floor(difference / (1000 * 60 * 60));
        setTimeLeft({
          hours,
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setStatus('starting');
      } else if (end > now) {
        // Hackathon is live
        const difference = end - now;
        const hours = Math.floor(difference / (1000 * 60 * 60));
        setTimeLeft({
          hours,
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setStatus(hours < 1 ? 'ending' : 'running');
      } else {
        // Finished
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setStatus('ended');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'starting':
        return {
          gradient: 'from-blue-600 via-indigo-600 to-violet-600',
          glow: 'bg-blue-500/20',
          accent: 'text-blue-400',
          accentBg: 'bg-blue-500/20 border-blue-500/30',
          ring: 'ring-blue-400/30',
          label: 'Starting Soon',
          icon: Clock
        };
      case 'ending':
        return {
          gradient: 'from-amber-600 via-orange-600 to-rose-600',
          glow: 'bg-amber-500/20',
          accent: 'text-amber-400',
          accentBg: 'bg-amber-500/20 border-amber-500/30',
          ring: 'ring-amber-400/30',
          label: 'Final Hour!',
          icon: Flame
        };
      case 'ended':
        return {
          gradient: 'from-rose-600 via-red-600 to-rose-700',
          glow: 'bg-rose-500/20',
          accent: 'text-rose-400',
          accentBg: 'bg-rose-500/20 border-rose-500/30',
          ring: 'ring-rose-400/30',
          label: 'Time\'s Up!',
          icon: AlertCircle
        };
      default:
        return {
          gradient: 'from-violet-600 via-purple-600 to-indigo-600',
          glow: 'bg-violet-500/20',
          accent: 'text-indigo-400',
          accentBg: 'bg-indigo-500/20 border-indigo-500/30',
          ring: 'ring-indigo-400/30',
          label: 'Hacking Live',
          icon: Zap
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  // Digit card component
  const DigitCard = ({ value, label, isAccent = false }: { value: number; label: string; isAccent?: boolean }) => (
    <div className="flex flex-col items-center">
      <div className={`digit-box relative ${isAccent ? config.accentBg : 'bg-white/5'} border ${isAccent ? '' : 'border-white/10'} rounded-2xl sm:rounded-3xl p-3 sm:p-5 backdrop-blur-sm min-w-[70px] sm:min-w-[100px] h-[60px] sm:h-[90px] lg:h-[100px] flex items-center justify-center transition-all duration-300 hover:scale-105 ${config.ring} ring-1`}>
        {!isAccent && (
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-2xl sm:rounded-3xl"></div>
        )}
        <span className={`relative text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tighter ${isAccent ? config.accent : 'text-white'} tabular-nums block text-center`}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white/40 mt-2 sm:mt-3">
        {label}
      </span>
    </div>
  );

  // Separator component - centered with digit boxes
  const Separator = () => (
    <div className="flex flex-col items-center justify-center gap-2 mx-1 sm:mx-2 h-[60px] sm:h-[90px] lg:h-[100px]">
      <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.glow.replace('/20', '/80')} animate-pulse shadow-lg`}></span>
      <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.glow.replace('/20', '/80')} animate-pulse shadow-lg`} style={{ animationDelay: '0.5s' }}></span>
    </div>
  );

  return (
    <div className="relative group h-full">
      {/* Outer Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-[2.5rem] opacity-30 blur-lg group-hover:opacity-50 transition-all duration-500`}></div>

      {/* Main Container */}
      <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/5 shadow-2xl">

        {/* Background Effects */}
        <div className={`absolute top-0 left-0 w-full h-full ${config.glow} blur-[100px] opacity-50`}></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>

        {/* Status Badge */}
        <div className="relative mb-4 sm:mb-6">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${config.accentBg} border backdrop-blur-xl`}>
            <StatusIcon className={`w-4 h-4 ${config.accent} ${status === 'running' ? 'animate-pulse' : status === 'ending' ? 'animate-bounce' : ''}`} />
            <span className={`text-xs font-bold tracking-widest uppercase ${config.accent}`}>{config.label}</span>
            {status !== 'ended' && (
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.accent.replace('text', 'bg').replace('-400', '-500')} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${config.accent.replace('text', 'bg')}`}></span>
              </span>
            )}
          </div>
        </div>

        {/* Timer Display - Using Flexbox for proper alignment */}
        <div className="relative flex items-start justify-center">
          <DigitCard value={timeLeft.hours} label="Hours" />
          <Separator />
          <DigitCard value={timeLeft.minutes} label="Minutes" />
          <Separator />
          <DigitCard value={timeLeft.seconds} label="Seconds" isAccent />
        </div>

        {/* Status Message for Ended */}
        {status === 'ended' && (
          <div className="mt-4 sm:mt-6 flex items-center bg-rose-900/30 px-5 py-2.5 rounded-full border border-rose-500/30 animate-pulse">
            <AlertCircle className="w-5 h-5 mr-2 text-rose-400" />
            <span className="font-bold tracking-wide text-rose-300">Hacking Period Ended</span>
          </div>
        )}
      </div>
    </div>
  );
};