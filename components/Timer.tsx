import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimerProps {
  endTime: string;
}

export const Timer: React.FC<TimerProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [status, setStatus] = useState<'running' | 'ended'>('running');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60))),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setStatus('running');
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

  return (
    <div className="relative group h-full">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${status === 'running' ? 'from-violet-600 to-indigo-600' : 'from-red-500 to-orange-500'} rounded-[2rem] opacity-30 blur group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
      <div className={`relative h-full flex flex-col items-center justify-center p-8 rounded-[1.75rem] shadow-xl ${status === 'running' ? 'bg-slate-900 text-white' : 'bg-red-950 text-red-50'}`}>
        
        <div className="flex items-center space-x-2 mb-6 opacity-80">
          <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center space-x-2 ${status === 'running' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-red-500/20 text-red-300'}`}>
            <Clock className="w-3 h-3" />
            <span>Hackathon Timer</span>
          </div>
        </div>

        <div className="flex items-end gap-2 sm:gap-4">
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-sm min-w-[80px] sm:min-w-[100px]">
              <span className="text-4xl sm:text-6xl font-bold font-mono tracking-tighter">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/40 mt-2 block">Hours</span>
          </div>
          
          <span className="text-4xl sm:text-6xl font-bold pb-8 sm:pb-10 text-white/20 animate-pulse">:</span>
          
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-sm min-w-[80px] sm:min-w-[100px]">
               <span className="text-4xl sm:text-6xl font-bold font-mono tracking-tighter">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/40 mt-2 block">Minutes</span>
          </div>
          
          <span className="text-4xl sm:text-6xl font-bold pb-8 sm:pb-10 text-white/20 animate-pulse">:</span>
          
          <div className="text-center">
            <div className={`border rounded-2xl p-3 sm:p-4 backdrop-blur-sm min-w-[80px] sm:min-w-[100px] ${status === 'running' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              <span className="text-4xl sm:text-6xl font-bold font-mono tracking-tighter">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-2 block ${status === 'running' ? 'text-indigo-400/60' : 'text-red-400/60'}`}>Seconds</span>
          </div>
        </div>

        {status === 'ended' && (
          <div className="mt-6 flex items-center text-red-400 bg-red-900/30 px-4 py-2 rounded-full border border-red-500/20">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-bold tracking-wide">Hacking Period Ended</span>
          </div>
        )}
      </div>
    </div>
  );
};