import React, { useEffect, useState } from 'react';
import { Team, Volunteer, Announcement, HackathonConfig } from '../types';
import { dbService } from '../services/mockDb';
import { Timer } from '../components/Timer';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { Wifi, MapPin, User as UserIcon, Upload, CheckCircle, ExternalLink, Eye, EyeOff, Loader2, Code2, Copy } from 'lucide-react';

interface TeamDashboardProps {
  teamId: string;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamId }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [config, setConfig] = useState<HackathonConfig | null>(null);
  const [showWifi, setShowWifi] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const t = await dbService.getTeam(teamId);
      if (t) {
        setTeam(t);
        setSubmissionLink(t.submissionLink || '');
        if (t.assignedVolunteerId) {
          const v = await dbService.getVolunteer(t.assignedVolunteerId);
          setVolunteer(v || null);
        }
      }
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
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, [teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setIsSubmitting(true);
    try {
      const updatedTeam = { 
        ...team, 
        submissionLink: submissionLink,
        submissionTime: new Date().toISOString()
      };
      await dbService.updateTeam(updatedTeam);
      setTeam(updatedTeam);
      alert('Project submitted successfully!');
    } catch (err) {
      alert('Failed to submit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !team || !config) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[280px]">
            <Timer endTime={config.endTime} />
        </div>
        
        {/* Team Identity Card */}
        <div className="glass-card rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
             <Code2 className="w-32 h-32" />
           </div>
           
           <div>
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-1">{team.name}</h2>
                    <p className="text-slate-500 font-medium">{team.email}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${team.isCheckedIn ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                   {team.isCheckedIn ? 'Checked In' : 'Pending'}
                  </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                  {team.members.map((m, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {m}
                      </span>
                  ))}
              </div>
              
              <div className="bg-violet-50 p-4 rounded-2xl border border-violet-100 relative">
                 <div className="absolute left-0 top-4 bottom-4 w-1 bg-violet-400 rounded-r-full"></div>
                 <p className="text-sm text-violet-900 italic pl-3 font-medium">
                  "{team.problemStatement}"
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Infrastructure & Volunteer */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Infrastructure Card */}
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
                Infrastructure
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Room</span>
                <span className="font-mono text-2xl font-bold text-slate-800">{team.roomNumber}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Table</span>
                <span className="font-mono text-2xl font-bold text-slate-800">{team.tableNumber}</span>
              </div>
              
              <div className="col-span-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
                 <div className="flex items-center mb-4">
                    <Wifi className="w-5 h-5 mr-2 opacity-80" />
                    <span className="font-bold">Wi-Fi Access</span>
                 </div>
                 <div className="space-y-3">
                     <div className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2 backdrop-blur-md">
                         <span className="text-xs text-indigo-100 font-medium">SSID</span>
                         <span className="font-mono text-sm font-bold">{team.wifiSsid}</span>
                     </div>
                     <div className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2 backdrop-blur-md">
                         <span className="text-xs text-indigo-100 font-medium">Pass</span>
                         <div className="flex items-center">
                            <span className="font-mono text-sm font-bold mr-3 tracking-wider">
                                {showWifi ? team.wifiPass : '••••••••'}
                            </span>
                            <button onClick={() => setShowWifi(!showWifi)} className="text-white/70 hover:text-white transition-colors">
                                {showWifi ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                         </div>
                     </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Volunteer Card */}
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-indigo-500" />
                Assigned Mentor
              </h3>
            </div>
            <div className="p-6">
              {volunteer ? (
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {volunteer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900">{volunteer.name}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{volunteer.role}</p>
                    <a href={`tel:${volunteer.phone}`} className="text-indigo-600 text-sm font-medium hover:underline">
                         {volunteer.phone}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No volunteer assigned yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Announcements */}
        <div className="lg:col-span-4 h-full min-h-[400px]">
            <AnnouncementFeed announcements={announcements} />
        </div>

        {/* Right Column: Submission */}
        <div className="lg:col-span-4 glass-card rounded-3xl overflow-hidden flex flex-col h-full border-t-4 border-t-indigo-500">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center text-lg">
                <Upload className="w-5 h-5 mr-2 text-indigo-600" />
                Submission
              </h3>
            </div>
            <div className="p-6 flex flex-col flex-grow bg-slate-50/30">
               
               {team.submissionLink ? (
                   <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6 text-center">
                       <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600 mb-3">
                           <CheckCircle className="w-8 h-8" />
                       </div>
                       <h4 className="text-emerald-900 font-bold text-lg mb-1">Project Submitted</h4>
                       <p className="text-emerald-700 text-sm mb-4">Good luck with the evaluation!</p>
                       
                       <a 
                         href={team.submissionLink} 
                         target="_blank" 
                         rel="noreferrer"
                         className="inline-flex items-center text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors break-all"
                       >
                           View Link <ExternalLink className="w-3 h-3 ml-2" />
                       </a>
                       <div className="mt-3 pt-3 border-t border-emerald-100/50">
                           <p className="text-xs text-emerald-600 font-medium">
                               Timestamp: {new Date(team.submissionTime!).toLocaleTimeString()}
                           </p>
                       </div>
                   </div>
               ) : (
                   <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6 flex items-start">
                       <div className="bg-amber-100 p-2 rounded-lg mr-3">
                           <Upload className="w-5 h-5 text-amber-600" />
                       </div>
                       <div>
                           <h4 className="text-amber-900 font-bold text-sm">Submission Pending</h4>
                           <p className="text-amber-700 text-xs mt-1">Submit your GitHub or Presentation link before the timer hits zero.</p>
                       </div>
                   </div>
               )}

               <form onSubmit={handleSubmit} className="mt-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                   <label htmlFor="link" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                       Project URL
                   </label>
                   <input
                     type="url"
                     id="link"
                     required
                     className="block w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 mb-4 transition-all outline-none border"
                     placeholder="https://github.com/username/repo"
                     value={submissionLink}
                     onChange={(e) => setSubmissionLink(e.target.value)}
                   />
                   <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all active:scale-95"
                   >
                     {isSubmitting ? 'Submitting...' : (team.submissionLink ? 'Update Submission' : 'Submit Project')}
                   </button>
               </form>
            </div>
        </div>

      </div>
    </div>
  );
};