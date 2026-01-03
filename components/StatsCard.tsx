import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "indigo" | "blue" | "green" | "purple" | "rose" | "amber" | "cyan";
  trend?: { value: number; label: string };
  subtitle?: string;
}

const colorConfig = {
  indigo: {
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    iconShadow: "shadow-indigo-500/30",
    text: "text-indigo-600",
    ring: "ring-indigo-100",
    border: "border-indigo-100"
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconShadow: "shadow-blue-500/30",
    text: "text-blue-600",
    ring: "ring-blue-100",
    border: "border-blue-100"
  },
  green: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    iconShadow: "shadow-emerald-500/30",
    text: "text-emerald-600",
    ring: "ring-emerald-100",
    border: "border-emerald-100"
  },
  purple: {
    bg: "bg-gradient-to-br from-violet-50 to-violet-100/50",
    iconBg: "bg-gradient-to-br from-violet-500 to-violet-600",
    iconShadow: "shadow-violet-500/30",
    text: "text-violet-600",
    ring: "ring-violet-100",
    border: "border-violet-100"
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 to-rose-100/50",
    iconBg: "bg-gradient-to-br from-rose-500 to-rose-600",
    iconShadow: "shadow-rose-500/30",
    text: "text-rose-600",
    ring: "ring-rose-100",
    border: "border-rose-100"
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100/50",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
    iconShadow: "shadow-amber-500/30",
    text: "text-amber-600",
    ring: "ring-amber-100",
    border: "border-amber-100"
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-50 to-cyan-100/50",
    iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    iconShadow: "shadow-cyan-500/30",
    text: "text-cyan-600",
    ring: "ring-cyan-100",
    border: "border-cyan-100"
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color = "indigo", trend, subtitle }) => {
  const config = colorConfig[color] || colorConfig.indigo;

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-3 h-3" />;
    if (trend.value < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.value > 0) return "text-emerald-600 bg-emerald-50";
    if (trend.value < 0) return "text-rose-600 bg-rose-50";
    return "text-slate-600 bg-slate-50";
  };

  return (
    <div className="group relative glass-card rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 overflow-hidden">
      {/* Decorative Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${config.bg} rounded-full blur-2xl opacity-50 -mr-10 -mt-10 group-hover:opacity-80 transition-opacity`}></div>

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{title}</p>

          {/* Value */}
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">{value}</p>

          {/* Subtitle or Trend */}
          {subtitle && (
            <p className="text-xs font-medium text-slate-400">{subtitle}</p>
          )}

          {trend && (
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold mt-2 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(trend.value)}% {trend.label}</span>
            </div>
          )}
        </div>

        {/* Premium Icon with Glow */}
        <div className="relative">
          {/* Glow Effect */}
          <div className={`absolute inset-0 ${config.iconBg} rounded-2xl blur-lg opacity-50 group-hover:opacity-80 group-hover:blur-xl transition-all duration-300`}></div>
          <div className={`relative p-4 rounded-2xl ${config.iconBg} shadow-lg ${config.iconShadow} text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="w-6 h-6" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${config.iconBg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    </div>
  );
};