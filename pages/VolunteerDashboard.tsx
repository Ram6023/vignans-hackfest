import React, { useEffect, useState, useCallback } from 'react';
import { Team, Announcement, HackathonConfig, TimeSession } from '../types';
import { dbService } from '../services/mockDb';
import { Timer } from '../components/Timer';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { StatsCard } from '../components/StatsCard';
import {
  Search, MapPin, CheckSquare, Square, Loader2, Users, CheckCircle,
  Clock, Sparkles, X, Play, Pause, Coffee, Utensils, Moon,
  AlertTriangle, StopCircle, Timer as TimerIcon, Activity,
  TrendingUp, Zap, RefreshCw
} from 'lucide-react';

interface VolunteerDashboardProps {
  volunteerId: string;
}

// Break reason options
const BREAK_REASONS = [
  { id: 'food', label: 'Food Break', icon: Utensils, color: 'amber' },
  { id: 'rest', label: 'Rest Break', icon: Moon, color: 'indigo' },
  { id: 'coffee', label: 'Coffee Break', icon: Coffee, color: 'orange' },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'red' },
];

// Format milliseconds to readable time
const formatDuration = (ms: number): string => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

// Live timer component
const LiveTimer: React.FC<{ startTime: string; type: 'active' | 'break' }> = ({ startTime, type }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const updateTimer = () => {
      setElapsed(Date.now() - start);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <span className={`font-mono font-bold ${type === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
      {formatDuration(elapsed)}
    </span>
  );
};

// Status badge component
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionModal, setActionModal] = useState<{ team: Team; action: 'checkin' | 'break' | 'complete' } | null>(null);
  const [selectedBreakReason, setSelectedBreakReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'break' | 'pending'>('all');

  const fetchData = useCallback(async () => {
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
  }, [volunteerId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Start onboarding (first check-in)
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

  // Start break
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

  // End break
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

  // Complete onboarding
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

  // Filter teams based on tab and search
  const getFilteredTeams = () => {
    let filtered = teams;

    // Filter by tab
    switch (activeTab) {
      case 'active':
        filtered = teams.filter(t => t.onboardingStatus === 'active');
        break;
      case 'break':
        filtered = teams.filter(t => t.onboardingStatus === 'on_break');
        break;
      case 'pending':
        filtered = teams.filter(t => t.onboardingStatus === 'not_started');
        break;
    }

    // Filter by search
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
  const completedCount = teams.filter(t => t.onboardingStatus === 'completed').length;

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/30">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[scaleIn_0.2s_ease-out]">
            <button
              onClick={() => setActionModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Check-in Modal */}
            {actionModal.action === 'checkin' && (
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Start Onboarding</h3>
                <p className="text-slate-500 mb-6">
                  Check in <span className="font-semibold text-slate-700">{actionModal.team.name}</span> and start their hackathon timer?
                </p>
                <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <TimerIcon className="w-5 h-5 text-emerald-600" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-emerald-700">Timer will start now</p>
                      <p className="text-xs text-emerald-600">Track active time and breaks</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setActionModal(null)} className="btn-slide-in-ghost flex-1">
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={() => handleStartOnboarding(actionModal.team)}
                    disabled={isProcessing}
                    className="btn-slide-in-emerald flex-1"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Timer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Break Modal */}
            {actionModal.action === 'break' && (
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                    <Pause className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Start Break</h3>
                <p className="text-slate-500 mb-6">
                  Select a reason for <span className="font-semibold text-slate-700">{actionModal.team.name}</span>'s break
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {BREAK_REASONS.map(reason => (
                    <button
                      key={reason.id}
                      onClick={() => setSelectedBreakReason(reason.id)}
                      className={`p-4 rounded-2xl border-2 transition-all ${selectedBreakReason === reason.id
                          ? `border-${reason.color}-500 bg-${reason.color}-50 shadow-lg`
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >
                      <reason.icon className={`w-6 h-6 mx-auto mb-2 ${selectedBreakReason === reason.id ? `text-${reason.color}-600` : 'text-slate-400'
                        }`} />
                      <p className={`text-sm font-semibold ${selectedBreakReason === reason.id ? `text-${reason.color}-700` : 'text-slate-600'
                        }`}>{reason.label}</p>
                    </button>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setActionModal(null)} className="btn-slide-in-ghost flex-1">
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={() => handleStartBreak(actionModal.team, selectedBreakReason)}
                    disabled={isProcessing || !selectedBreakReason}
                    className="btn-slide-in-amber flex-1 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Start Break</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Complete Modal */}
            {actionModal.action === 'complete' && (
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-400 rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30">
                    <StopCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Complete Onboarding</h3>
                <p className="text-slate-500 mb-6">
                  Stop the timer and finalize <span className="font-semibold text-slate-700">{actionModal.team.name}</span>'s session?
                </p>
                <div className="bg-violet-50 rounded-2xl p-4 mb-6 border border-violet-100">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-xs text-violet-600 mb-1">Active Time</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatDuration(dbService.getActiveTime(actionModal.team))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-violet-600 mb-1">Break Time</p>
                      <p className="text-lg font-bold text-amber-600">
                        {formatDuration(dbService.getBreakTime(actionModal.team))}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setActionModal(null)} className="btn-slide-in-ghost flex-1">
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={() => handleCompleteOnboarding(actionModal.team)}
                    disabled={isProcessing}
                    className="btn-slide-in-primary flex-1"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 h-[220px]">
          <Timer endTime={config.endTime} />
        </div>
        <StatsCard
          title="Active Teams"
          value={activeCount}
          icon={Activity}
          color="green"
          subtitle="Currently hacking"
        />
        <StatsCard
          title="On Break"
          value={breakCount}
          icon={Coffee}
          color="amber"
          subtitle="Taking a break"
        />
        <StatsCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          color="blue"
          subtitle="Awaiting check-in"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Team List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Navigation & Search */}
          <div className="glass-card p-5 rounded-2xl border border-white/60">
            <div className="flex flex-col gap-4">
              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: 'all', label: 'All Teams', count: teams.length },
                  { id: 'active', label: 'Active', count: activeCount, color: 'emerald' },
                  { id: 'break', label: 'On Break', count: breakCount, color: 'amber' },
                  { id: 'pending', label: 'Pending', count: pendingCount, color: 'blue' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200'
                      }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium transition-all"
                  placeholder="Search teams or rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Team Cards */}
          <div className="space-y-4">
            {filteredTeams.map((team, index) => (
              <div
                key={team.id}
                className={`group relative bg-white rounded-2xl p-6 transition-all duration-300 border-2 ${team.onboardingStatus === 'active'
                    ? 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30'
                    : team.onboardingStatus === 'on_break'
                      ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/30'
                      : team.onboardingStatus === 'completed'
                        ? 'border-violet-200 bg-gradient-to-br from-white to-violet-50/30'
                        : 'border-slate-200 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Status Badge */}
                <div className="absolute -top-3 right-4">
                  <StatusBadge status={team.onboardingStatus} breakReason={team.breakReason} />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{team.name}</h3>

                    {/* Members */}
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <Users className="w-4 h-4 mr-1.5" />
                      <span className="font-medium">{team.members.join(', ')}</span>
                    </div>

                    {/* Location */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                        <MapPin className="w-3 h-3 mr-1.5 text-violet-500" />
                        {team.roomNumber}
                        <span className="mx-1.5 text-slate-300">|</span>
                        Table {team.tableNumber}
                      </span>
                    </div>

                    {/* Time Stats (for active/break/completed teams) */}
                    {team.onboardingStatus !== 'not_started' && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="text-xs text-emerald-600 font-medium">Active Time</p>
                            {team.onboardingStatus === 'active' && team.currentSessionStart ? (
                              <LiveTimer startTime={team.checkInTime!} type="active" />
                            ) : (
                              <span className="font-mono font-bold text-emerald-600">
                                {formatDuration(dbService.getActiveTime(team))}
                              </span>
                            )}
                          </div>
                        </div>

                        {(team.totalBreakTime || 0) > 0 || team.onboardingStatus === 'on_break' ? (
                          <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
                            <Coffee className="w-4 h-4 text-amber-600" />
                            <div>
                              <p className="text-xs text-amber-600 font-medium">Break Time</p>
                              {team.onboardingStatus === 'on_break' && team.currentSessionStart ? (
                                <LiveTimer startTime={team.currentSessionStart} type="break" />
                              ) : (
                                <span className="font-mono font-bold text-amber-600">
                                  {formatDuration(dbService.getBreakTime(team))}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {team.onboardingStatus === 'not_started' && (
                      <button
                        onClick={() => setActionModal({ team, action: 'checkin' })}
                        className="btn-slide-in-emerald"
                      >
                        <Play className="w-4 h-4" />
                        <span>Check In</span>
                      </button>
                    )}

                    {team.onboardingStatus === 'active' && (
                      <>
                        <button
                          onClick={() => setActionModal({ team, action: 'break' })}
                          className="btn-slide-in-amber"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Start Break</span>
                        </button>
                        <button
                          onClick={() => setActionModal({ team, action: 'complete' })}
                          className="btn-slide-in-ghost text-sm"
                        >
                          <StopCircle className="w-4 h-4" />
                          <span>Complete</span>
                        </button>
                      </>
                    )}

                    {team.onboardingStatus === 'on_break' && (
                      <button
                        onClick={() => handleEndBreak(team)}
                        disabled={isProcessing}
                        className="btn-slide-in-emerald"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>
                    )}

                    {team.onboardingStatus === 'completed' && (
                      <div className="text-center px-4 py-2">
                        <div className="flex items-center gap-2 text-violet-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Done</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredTeams.length === 0 && (
              <div className="text-center py-16 glass-card rounded-2xl border border-white/60">
                <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-bold text-lg">No teams found</p>
                <p className="text-slate-400 mt-1">
                  {searchTerm ? 'Try adjusting your search' : 'No teams in this category'}
                </p>
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