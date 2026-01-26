import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, Flame, Zap } from 'lucide-react';

interface TimerProps {
  endTime: string;
}

export const Timer: React.FC<TimerProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [status, setStatus] = useState<'running' | 'ending' | 'ended'>('running');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)));
        setTimeLeft({
          hours,
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        // Set to ending status when less than 1 hour remains
        setStatus(hours < 1 ? 'ending' : 'running');
      } else {
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

  return (
    <div className="relative group h-full">
      {/* Outer Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-[2.5rem] opacity-30 blur-lg group-hover:opacity-50 transition-all duration-500`}></div>

      {/* Main Container */}
      <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/5 shadow-2xl overflow-hidden">

        {/* Background Effects */}
        <div className={`absolute top-0 left-0 w-full h-full ${config.glow} blur-[100px] opacity-50`}></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>

        {/* Status Badge */}
        <div className="relative mb-6 sm:mb-8">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${config.accentBg} border backdrop-blur-xl`}>
            <StatusIcon className={`w-4 h-4 ${config.accent} ${status === 'running' ? 'animate-pulse' : status === 'ending' ? 'animate-bounce' : ''}`} />
            <span className={`text-xs font-bold tracking-widest uppercase ${config.accent} -mr-[0.1em]`}>{config.label}</span>
            {status !== 'ended' && (
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.accent.replace('text', 'bg').replace('-400', '-500')} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${config.accent.replace('text', 'bg')}`}></span>
              </span>
            )}
          </div>
        </div>

        {/* Timer Display Grid */}
        <div className="relative grid grid-cols-[auto_auto_auto_auto_auto] items-center justify-center gap-x-2 sm:gap-x-4">

          {/* Row 1: Digit Boxes and Separators */}

          {/* Hours Box */}
          <div className="group/digit">
            <div className={`relative bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 backdrop-blur-sm min-w-[70px] sm:min-w-[100px] transition-all duration-300 group-hover/digit:bg-white/10 group-hover/digit:border-white/20 ${config.ring} ring-1`}>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover/digit:opacity-100 transition-opacity rounded-2xl sm:rounded-3xl"></div>
              <span className="relative text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tighter text-white tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Separator 1 */}
          <div className="flex flex-col gap-2">
            <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.glow.replace('/20', '/80')} animate-pulse shadow-lg`}></span>
            <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.glow.replace('/20', '/80')} animate-pulse shadow-lg`} style={{ animationDelay: '0.5s' }}></span>
          </div>

          {/* Minutes Box */}
          <div className="group/digit">
            <div className={`relative bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 backdrop-blur-sm min-w-[70px] sm:min-w-[100px] transition-all duration-300 group-hover/digit:bg-white/10 group-hover/digit:border-white/20 ${config.ring} ring-1`}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover/digit:opacity-100 transition-opacity rounded-2xl sm:rounded-3xl"></div>
              <span className="relative text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tighter text-white tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Separator 2 */}
          <div className="flex flex-col gap-2">
            <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.glow.replace('/20', '/80')} animate-pulse shadow-lg`}></span>
            <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.glow.replace('/20', '/80')} animate-pulse shadow-lg`} style={{ animationDelay: '0.5s' }}></span>
          </div>

          {/* Seconds Box */}
          <div className="group/digit">
            <div className={`relative border rounded-2xl sm:rounded-3xl p-3 sm:p-5 backdrop-blur-sm min-w-[70px] sm:min-w-[100px] transition-all duration-300 ${config.accentBg} group-hover/digit:scale-105`}>
              <span className={`text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tighter ${config.accent} tabular-nums`}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Row 2: Labels */}
          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] -mr-[0.2em] text-white/30 mt-2 sm:mt-3 block">Hours</span>
          </div>

          {/* Empty space under separator */}
          <div />

          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] -mr-[0.2em] text-white/30 mt-2 sm:mt-3 block">Minutes</span>
          </div>

          {/* Empty space under separator */}
          <div />

          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] -mr-[0.2em] text-white/30 mt-2 sm:mt-3 block">Seconds</span>
          </div>
        </div>

        {/* Status Message for Ended */}
        {status === 'ended' && (
          <div className="mt-6 sm:mt-8 flex items-center bg-rose-900/30 px-5 py-2.5 rounded-full border border-rose-500/30 animate-pulse">
            <AlertCircle className="w-5 h-5 mr-2 text-rose-400" />
            <span className="font-bold tracking-wide text-rose-300">Hacking Period Ended</span>
          </div>
        )}
      </div>
    </div>
  );
};