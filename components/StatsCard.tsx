import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "indigo" | "blue" | "green" | "purple" | "rose"; 
}

const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    purple: "bg-violet-50 text-violet-600 ring-violet-100",
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color = "indigo" }) => {
  return (
    <div className="glass-card rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center space-x-4">
        <div className={`p-4 rounded-2xl ring-4 ${colorStyles[color as keyof typeof colorStyles] || colorStyles.indigo}`}>
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};