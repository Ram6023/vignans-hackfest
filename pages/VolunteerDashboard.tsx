import React, { useEffect, useState, useCallback } from 'react';
import { Team, Announcement, HackathonConfig, HelpRequest } from '../types';
import { dbService } from '../services/mockDb';
import { Timer } from '../components/Timer';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { StatsCard } from '../components/StatsCard';
import {
  Search, MapPin, CheckSquare, Square, Loader2, Users, CheckCircle,
  Clock, Sparkles, X, Play, Pause, Coffee, Utensils, Moon,
  AlertTriangle, StopCircle, Timer as TimerIcon, Activity,
  TrendingUp, Zap, RefreshCw, LogOut, LifeBuoy
} from 'lucide-react';

interface VolunteerDashboardProps {
  volunteerId: string;
}

const BREAK_REASONS = [
  { id: 'food', label: 'Food Break', icon: Utensils, color: 'amber' },
  { id: 'rest', label: 'Rest Break', icon: Moon, color: 'indigo' },
  { id: 'coffee', label: 'Coffee Break', icon: Coffee, color: 'orange' },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'red' },
];

const formatDuration = (ms: number): string => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const LiveTimer: React.FC<{
  startTime: string;
  type: 'active' | 'break';
  previousTotal?: number;
}> = ({ startTime, type, previousTotal = 0 }) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = new Date(startTime).getTime();
    const updateTimer = () => {
      const currentSession = Date.now() - start;
      setElapsed(previousTotal + currentSession);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime, previousTotal]);
  return (
    <span className={`font-mono font-bold text-lg ${type === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
      {formatDuration(elapsed)}
    </span>
  );
};

const StatusBadge: React.FC<{ status: Team['onboardingStatus']; breakReason?: string }> = ({ status, breakReason }) => {
  const styles = {
    not_started: 'bg-slate-100 text-slate-600 border-slate-200',
    active: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-lg shadow-emerald-200',
    on_break: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-lg shadow-amber-200',
    completed: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white border-violet-400 shadow-lg shadow-violet-200',
  };
  const labels = {
    not_started: 'Not Started',
    active: 'Active',
    on_break: breakReason ? `Break: ${breakReason}` : 'On Break',
    completed: 'Completed',
  };
  const icons = {
    not_started: <Square className="w-3 h-3" />,
    active: <Activity className="w-3 h-3 animate-pulse" />,
    on_break: <Pause className="w-3 h-3" />,
    completed: <CheckCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {icons[status]}
      {labels[status]}
    </span>
  );
};

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ volunteerId }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [config, setConfig] = useState<HackathonConfig | null>(null);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionModal, setActionModal] = useState<{ team: Team; action: 'checkin' | 'break' | 'complete' } | null>(null);
  const [selectedBreakReason, setSelectedBreakReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'break' | 'pending'>('all');

  const showToast = useCallback((message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const myTeams = await dbService.getTeamsByVolunteer(volunteerId);
      const normalizedTeams = myTeams.map(team => ({
        ...team,
        onboardingStatus: team.onboardingStatus || (team.isCheckedIn ? 'active' : 'not_started'),
        sessions: team.sessions || [],
        totalActiveTime: team.totalActiveTime || 0,
        totalBreakTime: team.totalBreakTime || 0,
      })) as Team[];
      setTeams(normalizedTeams);
      setAnnouncements(await dbService.getAnnouncements());
      setConfig(await dbService.getConfig());
      const requests = await dbService.getHelpRequests(volunteerId);
      setHelpRequests(requests.filter(r => r.status === 'pending'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [volunteerId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleResolveHelpRequest = async (id: string) => {
    try {
      await dbService.updateHelpRequestStatus(id, 'resolved');
      setHelpRequests(prev => prev.filter(r => r.id !== id));
      showToast('Help request resolved!');
    } catch (e) {
      alert('Failed to resolve request');
    }
  };

  const handleStartOnboarding = async (team: Team) => {
    setIsProcessing(true);
    try {
      const updatedTeam = await dbService.startOnboarding(team.id);
      setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
      setActionModal(null);
      showToast(`${team.name} has been checked in! Timer started.`);
    } catch (e: any) {
      alert(e.message || 'Failed to start onboarding');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartBreak = async (team: Team, reason: string) => {
    setIsProcessing(true);
    try {
      const updatedTeam = await dbService.startBreak(team.id, reason);
      setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
      setActionModal(null);
      setSelectedBreakReason('');
      showToast(`${team.name} is now on break (${reason}).`);
    } catch (e: any) {
      alert(e.message || 'Failed to start break');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndBreak = async (team: Team) => {
    setIsProcessing(true);
    try {
      const updatedTeam = await dbService.endBreak(team.id);
      setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
      showToast(`${team.name} is back! Timer resumed.`);
    } catch (e: any) {
      alert(e.message || 'Failed to end break');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteOnboarding = async (team: Team) => {
    setIsProcessing(true);
    try {
      const updatedTeam = await dbService.completeOnboarding(team.id);
      setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
      setActionModal(null);
      const totalTime = formatDuration(dbService.getActiveTime(updatedTeam));
      showToast(`${team.name} completed! Total active time: ${totalTime}`);
    } catch (e: any) {
      alert(e.message || 'Failed to complete onboarding');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-full shadow-xl">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading volunteer dashboard...</p>
      </div>
    );
  }

  const getFilteredTeams = () => {
    let filtered = teams;
    switch (activeTab) {
      case 'active': filtered = teams.filter(t => t.onboardingStatus === 'active'); break;
      case 'break': filtered = teams.filter(t => t.onboardingStatus === 'on_break'); break;
      case 'pending': filtered = teams.filter(t => t.onboardingStatus === 'not_started'); break;
    }
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredTeams = getFilteredTeams();
  const activeCount = teams.filter(t => t.onboardingStatus === 'active').length;
  const breakCount = teams.filter(t => t.onboardingStatus === 'on_break').length;
  const pendingCount = teams.filter(t => t.onboardingStatus === 'not_started').length;

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {showSuccessToast && (
        <div className="fixed top-24 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/30">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[scaleIn_0.2s_ease-out]">
            <button onClick={() => setActionModal(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
            {actionModal.action === 'checkin' && (
              <div className="text-center">
                <div className="relative inline-block mb-4"><div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-50"></div><div className="relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"><Play className="w-8 h-8 text-white" /></div></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Start Onboarding</h3>
                <p className="text-slate-500 mb-6">Check in <span className="font-semibold text-slate-700">{actionModal.team.name}</span> and start their timer?</p>
                <button onClick={() => handleStartOnboarding(actionModal.team)} disabled={isProcessing} className="btn-slide-in-emerald w-full">{isProcessing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span>Start Timer</span>}</button>
              </div>
            )}
            {actionModal.action === 'break' && (
              <div className="text-center">
                <div className="relative inline-block mb-4"><div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl blur-lg opacity-50"></div><div className="relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30"><Pause className="w-8 h-8 text-white" /></div></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Start Break</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">{BREAK_REASONS.map(reason => (<button key={reason.id} onClick={() => setSelectedBreakReason(reason.id)} className={`p-4 rounded-2xl border-2 transition-all ${selectedBreakReason === reason.id ? `border-${reason.color}-500 bg-${reason.color}-50 shadow-lg` : 'border-slate-200 hover:border-slate-300 bg-white'}`}><reason.icon className={`w-6 h-6 mx-auto mb-2 ${selectedBreakReason === reason.id ? `text-${reason.color}-600` : 'text-slate-400'}`} /><p className={`text-sm font-semibold ${selectedBreakReason === reason.id ? `text-${reason.color}-700` : 'text-slate-600'}`}>{reason.label}</p></button>))}</div>
                <button onClick={() => handleStartBreak(actionModal.team, selectedBreakReason)} disabled={isProcessing || !selectedBreakReason} className="btn-slide-in-amber w-full">Start Break</button>
              </div>
            )}
            {actionModal.action === 'complete' && (
              <div className="text-center">
                <div className="relative inline-block mb-4"><div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-400 rounded-2xl blur-lg opacity-50"></div><div className="relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30"><StopCircle className="w-8 h-8 text-white" /></div></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Complete Onboarding</h3>
                <button onClick={() => handleCompleteOnboarding(actionModal.team)} disabled={isProcessing} className="btn-slide-in-primary w-full text-white bg-violet-600 py-3 rounded-xl font-bold">Complete</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Requests Section */}
      {helpRequests.length > 0 && (
        <div className="animate-[slideDown_0.3s_ease-out]">
          <div className="bg-red-50 border-2 border-red-200 rounded-[2rem] p-6 shadow-xl shadow-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg animate-pulse">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-red-900 font-extrabold text-xl">Active Help Requests</h3>
                <p className="text-red-700 text-sm font-medium">{helpRequests.length} teams need your assistance right now.</p>
              </div>
            </div>
            <div className="flex items-center -space-x-3">
              {helpRequests.map((req, i) => (
                <div key={req.id} className="group relative">
                  <button
                    onClick={() => handleResolveHelpRequest(req.id)}
                    className="w-12 h-12 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-red-600 font-bold hover:scale-110 active:scale-90 transition-transform relative z-10"
                    title={`Team ${req.teamName} - Room ${req.roomNumber}`}
                  >
                    {req.teamName.charAt(0)}
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
                      {req.teamName} (Room {req.roomNumber})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 h-[220px]"><Timer startTime={config.startTime} endTime={config.endTime} /></div>
        <StatsCard title="Active Teams" value={activeCount} icon={Activity} color="green" subtitle="Currently hacking" />
        <StatsCard title="On Break" value={breakCount} icon={Coffee} color="amber" subtitle="Taking a break" />
        <StatsCard title="Pending" value={pendingCount} icon={Clock} color="blue" subtitle="Awaiting check-in" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-white/60">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[{ id: 'all', label: 'All Teams', count: teams.length }, { id: 'active', label: 'Active', count: activeCount, color: 'emerald' }, { id: 'break', label: 'On Break', count: breakCount, color: 'amber' }, { id: 'pending', label: 'Pending', count: pendingCount, color: 'blue' }].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{tab.label}<span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200'}`}>{tab.count}</span></button>
                ))}
              </div>
              <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-4 w-4 text-slate-400" /></div><input type="text" className="block w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:border-violet-500 outline-none transition-all" placeholder="Search teams or rooms..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>
          </div>
          <div className="space-y-4">
            {filteredTeams.map((team, index) => (
              <div key={team.id} className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 ${team.onboardingStatus === 'active' ? 'border-emerald-200' : team.onboardingStatus === 'on_break' ? 'border-amber-200' : 'border-slate-200'}`}>
                <div className="p-6">
                  <div className="flex justify-end mb-3"><StatusBadge status={team.onboardingStatus} breakReason={team.breakReason} /></div>
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{team.name}</h3>
                      <div className="flex items-center text-sm text-slate-500 mb-3"><Users className="w-4 h-4 mr-1.5" /><span className="font-medium">{team.members.join(', ')}</span></div>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"><MapPin className="w-3 h-3 mr-1.5 text-violet-500" />{team.roomNumber} | Table {team.tableNumber}</span>
                    </div>
                    {team.onboardingStatus !== 'not_started' && (
                      <div className="flex flex-wrap lg:flex-col gap-3">
                        <div className="bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                          <p className="text-xs text-emerald-600 font-medium">Active Time</p>
                          {team.onboardingStatus === 'active' && team.currentSessionStart ? <LiveTimer startTime={team.currentSessionStart} type="active" previousTotal={team.totalActiveTime || 0} /> : <span className="font-mono font-bold text-emerald-600 text-lg">{formatDuration(dbService.getActiveTime(team))}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 border-t bg-slate-50/50 flex gap-3">
                  {team.onboardingStatus === 'not_started' && <button onClick={() => setActionModal({ team, action: 'checkin' })} className="btn-slide-in-emerald flex-1">Start Timer</button>}
                  {team.onboardingStatus === 'active' && <><button onClick={() => setActionModal({ team, action: 'break' })} className="btn-slide-in-amber flex-1">Break</button><button onClick={() => setActionModal({ team, action: 'complete' })} className="btn-slide-in-primary flex-1 text-white bg-violet-600 rounded-xl">Check Out</button></>}
                  {team.onboardingStatus === 'on_break' && <button onClick={() => handleEndBreak(team)} className="btn-slide-in-emerald flex-1">Resume</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div><AnnouncementFeed announcements={announcements} /></div>
      </div>
    </div>
  );
};