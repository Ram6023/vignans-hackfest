import React, { useEffect, useState } from 'react';
import { Team, Announcement, HackathonConfig, Volunteer } from '../types';
import { dbService } from '../services/mockDb';
import { StatsCard } from '../components/StatsCard';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { Users, UserCheck, CheckCircle, Megaphone, Plus, Download, Edit2, Send, Eye, ExternalLink, Trophy, Medal } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'volunteers' | 'leaderboard'>('overview');

  const fetchData = async () => {
    setTeams(await dbService.getAllTeams());
    setVolunteers(await dbService.getVolunteers());
    setAnnouncements(await dbService.getAnnouncements());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    await dbService.postAnnouncement(newAnnouncement);
    setNewAnnouncement('');
    setAnnouncements(await dbService.getAnnouncements());
    alert('Announcement Posted');
  };

  const handleViewSubmission = async (team: Team) => {
    if (!team.submissionLink) return;
    
    // Open link first
    window.open(team.submissionLink, '_blank');

    // Update status to viewed if not already
    if (!team.submissionViewed) {
        const updatedTeam = { ...team, submissionViewed: true };
        await dbService.updateTeam(updatedTeam);
        // Update local state to reflect change immediately
        setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
    }
  };
  
  const handleScoreUpdate = async (teamId: string, newScore: string) => {
      const score = parseInt(newScore) || 0;
      const team = teams.find(t => t.id === teamId);
      if (!team) return;
      
      if (team.score === score) return;

      const updatedTeam = { ...team, score };
      await dbService.updateTeam(updatedTeam);
      setTeams(teams.map(t => t.id === teamId ? updatedTeam : t));
  };
  
  const handleExport = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Team ID,Name,Email,Checked In,Submission Link,Viewed,Score\n"
        + teams.map(t => `${t.id},${t.name},${t.email},${t.isCheckedIn},${t.submissionLink || ''},${t.submissionViewed || false},${t.score || 0}`).join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "hackathon_data.csv");
      document.body.appendChild(link);
      link.click();
  };

  const totalTeams = teams.length;
  const checkedInTeams = teams.filter(t => t.isCheckedIn).length;
  const submittedTeams = teams.filter(t => t.submissionLink).length;
  
  const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass-card p-6 rounded-3xl">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-slate-500 font-medium">Manage the event in real-time.</p>
          </div>
          <button 
            onClick={handleExport}
            className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2.5 border border-slate-200 shadow-sm text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
              <Download className="w-4 h-4 mr-2" />
              Export Data
          </button>
       </div>

       {/* Tabs */}
       <div className="flex space-x-1 p-1 bg-white/50 backdrop-blur rounded-2xl max-w-xl border border-white/40 overflow-x-auto">
            {(['overview', 'teams', 'volunteers', 'leaderboard'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'bg-white shadow text-violet-600'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                } flex-1 py-2.5 px-4 rounded-xl text-sm font-bold capitalize transition-all duration-200 whitespace-nowrap`}
              >
                {tab}
              </button>
            ))}
        </div>

        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatsCard title="Total Teams" value={totalTeams} icon={Users} color="blue" />
                        <StatsCard title="Checked In" value={checkedInTeams} icon={UserCheck} color="green" />
                        <StatsCard title="Submissions" value={submittedTeams} icon={CheckCircle} color="purple" />
                    </div>

                    <div className="glass-card rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <div className="bg-rose-100 p-2 rounded-lg mr-3 text-rose-600">
                                <Megaphone className="w-5 h-5"/>
                            </div>
                            Broadcast Announcement
                        </h3>
                        <form onSubmit={handlePostAnnouncement}>
                            <div className="relative">
                                <textarea 
                                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-2xl p-4 pr-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-inner transition-all resize-none outline-none"
                                    rows={4}
                                    placeholder="Write a message to all participants..."
                                    value={newAnnouncement}
                                    onChange={(e) => setNewAnnouncement(e.target.value)}
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                                    Markdown supported
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg shadow-violet-200 text-white bg-violet-600 hover:bg-violet-700 transition-all hover:-translate-y-0.5"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Post Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <AnnouncementFeed announcements={announcements} />
                </div>
            </div>
        )}

        {activeTab === 'teams' && (
            <div className="glass-card rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                   <div>
                       <h3 className="text-lg font-bold text-slate-900">Registered Teams</h3>
                       <p className="text-sm text-slate-500">Manage infrastructure and assignments.</p>
                   </div>
                   <button 
                     onClick={() => alert('Create Team Feature Placeholder')}
                     className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-md shadow-indigo-100 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                   >
                       <Plus className="w-4 h-4 mr-1.5"/> Add Team
                   </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/80">
                            <tr>
                                <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Team Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Submission</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Volunteer</th>
                                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Edit</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {teams.map((team) => (
                                <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900">{team.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{team.email}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {team.isCheckedIn ? (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 text-emerald-700">Checked In</span>
                                        ) : (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-amber-100 text-amber-700">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {!team.submissionLink ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                <span className="w-1.5 h-1.5 mr-1.5 bg-slate-400 rounded-full"></span>
                                                Pending
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handleViewSubmission(team)}
                                                className={`group inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all shadow-sm ${
                                                    team.submissionViewed 
                                                    ? 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100' 
                                                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:shadow-md'
                                                }`}
                                            >
                                                {team.submissionViewed ? (
                                                    <>
                                                        <Eye className="w-3 h-3 mr-1.5" />
                                                        Viewed
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="relative flex h-2 w-2 mr-2">
                                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                        </div>
                                                        New Submission
                                                    </>
                                                )}
                                                <ExternalLink className="w-3 h-3 ml-1.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center space-x-2 text-sm text-slate-600 font-medium">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded">{team.roomNumber}</span>
                                            <span className="text-slate-300">/</span>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded">{team.tableNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 font-medium">
                                        {volunteers.find(v => v.id === team.assignedVolunteerId)?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'volunteers' && (
            <div className="glass-card rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50">
                 <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                   <div>
                       <h3 className="text-lg font-bold text-slate-900">Volunteers</h3>
                       <p className="text-sm text-slate-500">Floor support team details.</p>
                   </div>
                   <button 
                     onClick={() => alert('Create Volunteer Feature Placeholder')}
                     className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-md shadow-indigo-100 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                   >
                       <Plus className="w-4 h-4 mr-1.5"/> Add Volunteer
                   </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/80">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Profile</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                                <th className="relative px-6 py-4"><span className="sr-only">Edit</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {volunteers.map((vol) => (
                                <tr key={vol.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs mr-3">
                                                {vol.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{vol.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{vol.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-lg bg-slate-100 text-slate-600">
                                            {vol.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-slate-600 bg-slate-50/50">
                                        {vol.phone}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        
        {activeTab === 'leaderboard' && (
             <div className="glass-card rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50">
                <div className="px-8 py-6 border-b border-slate-100 bg-white/50 flex justify-between items-center">
                   <div>
                       <h3 className="text-lg font-bold text-slate-900 flex items-center">
                           <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                           Hackathon Leaderboard
                       </h3>
                       <p className="text-sm text-slate-500">Live rankings based on jury scores.</p>
                   </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/80">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Rank</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Statement</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {sortedTeams.map((team, index) => {
                                const isTop3 = index < 3;
                                return (
                                <tr key={team.id} className={`hover:bg-slate-50/80 transition-colors ${isTop3 ? 'bg-amber-50/30' : ''}`}>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {index === 0 && <Medal className="w-6 h-6 text-yellow-400 mr-2" />}
                                            {index === 1 && <Medal className="w-6 h-6 text-slate-400 mr-2" />}
                                            {index === 2 && <Medal className="w-6 h-6 text-amber-600 mr-2" />}
                                            <span className={`text-lg font-bold ${isTop3 ? 'text-slate-900' : 'text-slate-500'}`}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900">{team.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{team.members.length} Members</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm text-slate-600 max-w-xs truncate" title={team.problemStatement}>
                                            {team.problemStatement}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {team.submissionLink ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                Submitted
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                                In Progress
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <input 
                                            type="number" 
                                            min="0"
                                            max="100"
                                            value={team.score || ''}
                                            onChange={(e) => handleScoreUpdate(team.id, e.target.value)}
                                            className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                                            placeholder="0"
                                        />
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
  );
};