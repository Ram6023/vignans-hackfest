import React, { useState } from 'react';
import { Announcement } from '../types';
import { Bell, Megaphone, Calendar, ChevronDown, Sparkles, Clock } from 'lucide-react';

interface AnnouncementFeedProps {
  announcements: Announcement[];
}

export const AnnouncementFeed: React.FC<AnnouncementFeedProps> = ({ announcements }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'recent'>('all');

  const filteredAnnouncements = filter === 'recent'
    ? announcements.slice(0, 3)
    : announcements;

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getPriorityColor = (index: number) => {
    if (index === 0) return { dot: 'bg-violet-500', ring: 'ring-violet-100', bg: 'bg-violet-50' };
    if (index === 1) return { dot: 'bg-blue-500', ring: 'ring-blue-100', bg: 'bg-blue-50' };
    return { dot: 'bg-slate-400', ring: 'ring-slate-100', bg: 'bg-slate-50' };
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col border border-white/60">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 rounded-xl text-white shadow-lg shadow-orange-200">
                <Megaphone className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Live Updates</h3>
              <p className="text-xs text-slate-500">Real-time announcements</p>
            </div>
          </div>

          {announcements.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {announcements.length} {announcements.length === 1 ? 'Update' : 'Updates'}
              </span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        {announcements.length > 3 && (
          <div className="flex space-x-1 mt-4 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'recent'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Recent
            </button>
          </div>
        )}
      </div>

      {/* Announcement List */}
      <div className="flex-grow overflow-y-auto max-h-[500px] custom-scrollbar">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-10 text-center text-slate-400 flex flex-col items-center justify-center h-full">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-slate-200 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-slate-100 p-5 rounded-full">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
            </div>
            <p className="font-bold text-slate-500 mb-1">All quiet on the floor</p>
            <p className="text-sm text-slate-400">No announcements yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredAnnouncements.map((ann, index) => {
              const colors = getPriorityColor(index);
              const isExpanded = expandedId === ann.id;
              const isLong = ann.message.length > 100;

              return (
                <div
                  key={ann.id}
                  className={`group relative rounded-2xl transition-all duration-300 overflow-hidden ${index === 0
                      ? 'bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-100 shadow-md shadow-violet-100/50'
                      : 'bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md'
                    }`}
                >
                  <div className="p-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg ${colors.bg}`}>
                          <Clock className={`w-3 h-3 ${index === 0 ? 'text-violet-600' : 'text-slate-500'}`} />
                          <span className={`text-[10px] font-bold tracking-wider uppercase ${index === 0 ? 'text-violet-700' : 'text-slate-600'}`}>
                            {getTimeAgo(ann.createdAt)}
                          </span>
                        </div>
                        {index === 0 && (
                          <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-100 text-amber-700">
                            <Sparkles className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">Latest</span>
                          </div>
                        )}
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${index === 0 ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {ann.author}
                      </span>
                    </div>

                    {/* Message */}
                    <p className={`text-sm leading-relaxed ${index === 0 ? 'text-violet-900 font-medium' : 'text-slate-700'
                      } ${!isExpanded && isLong ? 'line-clamp-2' : ''}`}>
                      {ann.message}
                    </p>

                    {/* Expand Button */}
                    {isLong && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                        className="flex items-center space-x-1 mt-2 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Bottom Accent */}
                  {index === 0 && (
                    <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {announcements.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs font-medium text-slate-400 text-center">
            Last updated: {new Date(announcements[0]?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
    </div>
  );
};