import React from 'react';
import { Announcement } from '../types';
import { Bell, Megaphone, Calendar } from 'lucide-react';

interface AnnouncementFeedProps {
  announcements: Announcement[];
}

export const AnnouncementFeed: React.FC<AnnouncementFeedProps> = ({ announcements }) => {
  return (
    <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center text-lg">
          <div className="bg-orange-100 p-2 rounded-lg mr-3 text-orange-600">
             <Megaphone className="w-5 h-5" />
          </div>
          Live Updates
        </h3>
        <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-slate-300">
          {announcements.length} New
        </span>
      </div>
      
      <div className="flex-grow overflow-y-auto max-h-[500px] p-2 custom-scrollbar">
        {announcements.length === 0 ? (
          <div className="p-10 text-center text-slate-400 flex flex-col items-center justify-center h-full">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-medium">All quiet on the floor.</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="relative pl-6 pb-2 group">
                 {/* Timeline line */}
                 <div className="absolute left-0 top-2 bottom-0 w-0.5 bg-slate-200 group-last:bg-transparent"></div>
                 {/* Timeline dot */}
                 <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50"></div>
                 
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{ann.author}</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{ann.message}</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};