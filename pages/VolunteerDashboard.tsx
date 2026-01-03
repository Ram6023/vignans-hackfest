import React, { useEffect, useState } from 'react';
import { Team, Announcement, HackathonConfig } from '../types';
import { dbService } from '../services/mockDb';
import { Timer } from '../components/Timer';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { StatsCard } from '../components/StatsCard';
import { Search, MapPin, CheckSquare, Square, Loader2, Users, CheckCircle, Smartphone } from 'lucide-react';

interface VolunteerDashboardProps {
  volunteerId: string;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ volunteerId }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [config, setConfig] = useState<HackathonConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const myTeams = await dbService.getTeamsByVolunteer(volunteerId);
      setTeams(myTeams);
      setAnnouncements(await dbService.getAnnouncements());
      setConfig(await dbService.getConfig());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, [volunteerId]);

  const handleCheckIn = async (teamId: string) => {
      const team = teams.find(t => t.id === teamId);
      if (!team || team.isCheckedIn) return;

      const confirm = window.confirm(`Mark ${team.name} as Checked In?`);
      if (!confirm) return;

      try {
          const updatedTeam = {
              ...team,
              isCheckedIn: true,
              checkInTime: new Date().toISOString()
          };
          await dbService.updateTeam(updatedTeam);
          setTeams(teams.map(t => t.id === teamId ? updatedTeam : t));
      } catch (e) {
          alert('Failed to check in');
      }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
      </div>
    );
  }

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = teams.filter(t => t.isCheckedIn).length;
  const submittedCount = teams.filter(t => t.submissionLink).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-2 h-[200px]">
             <Timer endTime={config.endTime} />
         </div>
         <StatsCard 
            title="My Assigned Teams" 
            value={teams.length} 
            icon={Users} 
            color="blue" 
         />
         <StatsCard 
            title="Projects Submitted" 
            value={`${submittedCount}/${teams.length}`} 
            icon={CheckCircle} 
            color="green" 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Team List */}
        <div className="lg:col-span-2 space-y-4">
             <div className="flex flex-col sm:flex-row justify-between items-center glass-card p-5 rounded-2xl">
                 <h2 className="text-xl font-bold text-slate-900 mb-3 sm:mb-0">Assigned Teams</h2>
                 <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Search teams by name or room..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                 {filteredTeams.map(team => (
                     <div key={team.id} className={`group relative bg-white rounded-2xl p-6 transition-all border ${team.isCheckedIn ? 'border-emerald-200 shadow-sm' : 'border-slate-200 shadow-sm hover:shadow-lg hover:border-violet-300'}`}>
                         
                         <div className="flex flex-col md:flex-row md:items-center justify-between">
                             <div className="mb-4 md:mb-0">
                                 <div className="flex items-center mb-2">
                                    <h3 className="text-xl font-bold text-slate-900 mr-3">{team.name}</h3>
                                    {team.submissionLink && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200">
                                            Submitted
                                        </span>
                                    )}
                                 </div>
                                 <p className="text-sm text-slate-500 mb-3 flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    {team.members.join(', ')}
                                 </p>
                                 <div className="flex items-center space-x-3">
                                     <span className="flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide">
                                         <MapPin className="w-3 h-3 mr-1.5" />
                                         {team.roomNumber} <span className="mx-1 text-slate-300">|</span> {team.tableNumber}
                                     </span>
                                 </div>
                             </div>
                             
                             <div className="flex items-center">
                                 {team.isCheckedIn ? (
                                     <div className="flex items-center bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-100">
                                         <CheckSquare className="w-6 h-6 mr-3" />
                                         <div className="flex flex-col">
                                             <span className="text-sm font-bold">Checked In</span>
                                             <span className="text-xs opacity-80">{new Date(team.checkInTime!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                         </div>
                                     </div>
                                 ) : (
                                     <button
                                         onClick={() => handleCheckIn(team.id)}
                                         className="flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-lg shadow-violet-200 transition-all active:scale-95 w-full md:w-auto"
                                     >
                                         <Square className="w-4 h-4 mr-2" />
                                         Check In
                                     </button>
                                 )}
                             </div>
                         </div>
                     </div>
                 ))}
                 {filteredTeams.length === 0 && (
                     <div className="text-center py-16 glass-card rounded-2xl">
                         <div className="bg-slate-100 p-4 rounded-full inline-block mb-3">
                             <Search className="w-6 h-6 text-slate-400" />
                         </div>
                         <p className="text-slate-500 font-medium">No teams found matching your search.</p>
                     </div>
                 )}
             </div>
        </div>

        {/* Sidebar: Announcements */}
        <div>
            <AnnouncementFeed announcements={announcements} />
        </div>
      </div>
    </div>
  );
};