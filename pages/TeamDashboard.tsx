import React, { useEffect, useState } from 'react';
import { Team, Volunteer, HackathonConfig } from '../types';
import { dbService } from '../services/mockDb';
import { wsService } from '../services/websocket';
import { useRealtimeAnnouncements, useRealtimeTeams } from '../hooks/useRealtime';
import { Timer } from '../components/Timer';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { Schedule } from '../components/Schedule';
import {
  Wifi, MapPin, User as UserIcon, Upload, CheckCircle, ExternalLink,
  Eye, EyeOff, Loader2, Code2, Copy, Check, Phone, Sparkles,
  AlertCircle, Clock, LifeBuoy, Bell
} from 'lucide-react';
import { PriorityBanner } from '../components/PriorityBanner';
import { notificationService } from '../services/notificationService';

interface TeamDashboardProps {
  teamId: string;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamId }) => {
  const { teams, loading: teamsLoading } = useRealtimeTeams();
  const { announcements } = useRealtimeAnnouncements();

  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [config, setConfig] = useState<HackathonConfig | null>(null);
  const [showWifi, setShowWifi] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [gitRepoLink, setGitRepoLink] = useState('');
  const [youtubeLiveLink, setYoutubeLiveLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [copiedField, setCopiedField] = useState<'ssid' | 'pass' | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [isRequestingHelp, setIsRequestingHelp] = useState(false);
  const [helpRequestSent, setHelpRequestSent] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const team = teams.find(t => t.id === teamId) || null;

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) setNotificationPermission('granted');
  };

  // Initialize form usage when team data is first loaded
  useEffect(() => {
    if (team) {
      if (!submissionLink) setSubmissionLink(team.submissionLink || '');
      if (!gitRepoLink) setGitRepoLink(team.gitRepoLink || '');
      if (!youtubeLiveLink) setYoutubeLiveLink(team.youtubeLiveLink || '');
    }
  }, [team?.id]);

  // Fetch helper data (Config, Volunteer)
  useEffect(() => {
    const fetchHelperData = async () => {
      try {
        setConfig(await dbService.getConfig());
        if (team && team.assignedVolunteerId) {
          const v = await dbService.getVolunteer(team.assignedVolunteerId);
          setVolunteer(v || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchHelperData();
  }, [team?.assignedVolunteerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setIsSubmitting(true);
    try {
      const updatedTeam = {
        ...team,
        submissionLink: submissionLink,
        gitRepoLink: gitRepoLink,
        youtubeLiveLink: youtubeLiveLink,
        submissionTime: new Date().toISOString()
      };
      await dbService.updateTeam(updatedTeam);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      alert('Failed to submit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (text: string, field: 'ssid' | 'pass') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const handleRequestHelp = async () => {
    if (!team || isRequestingHelp || helpRequestSent) return;
    setIsRequestingHelp(true);
    try {
      await dbService.requestHelp(team.id, `Team ${team.name} needs assistance at Room ${team.roomNumber}`);
      setHelpRequestSent(true);
      setTimeout(() => setHelpRequestSent(false), 10000);
    } catch (err) {
      alert('Failed to send help request.');
    } finally {
      setIsRequestingHelp(false);
    }
  };

  if (teamsLoading || loadingConfig || !team || !config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-full shadow-xl">
            <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20 animate-[fadeIn_0.5s_ease-out]">
      <PriorityBanner announcements={announcements} />

      {/* Infrastructure Snapshot Sticky Bar */}
      <div className="sticky top-0 lg:top-16 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Room</span>
              <span className="font-mono font-bold text-slate-900">{team.roomNumber}</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Table</span>
              <span className="font-mono font-bold text-slate-900">{team.tableNumber}</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
              <Wifi className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-bold text-violet-700">{team.wifiSsid}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Notification Permission Banner */}
        {notificationPermission === 'default' && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-[slideIn_0.4s_ease-out]">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Stay Updated!</p>
                <p className="text-xs text-blue-100">Enable push notifications for real-time announcements.</p>
              </div>
            </div>
            <button
              onClick={handleEnableNotifications}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Enable Notifications
            </button>
          </div>
        )}

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed top-24 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
            <div className="flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/30">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Project submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[280px]">
            <Timer startTime={config.startTime} endTime={config.endTime} />
          </div>

          {/* Team Identity Card */}
          <div className="group glass-card rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-white/60 hover:shadow-xl transition-all duration-300">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full blur-2xl opacity-50 -mr-10 -mt-10 group-hover:opacity-80 transition-opacity"></div>
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Code2 className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{team.name}</h2>
                  <p className="text-slate-500 font-medium text-sm">{team.email}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center space-x-1.5 ${team.isCheckedIn
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200'
                  : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${team.isCheckedIn ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
                  <span>{team.isCheckedIn ? 'Checked In' : 'Pending'}</span>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex flex-wrap gap-2 mb-5">
                {team.members.map((m, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold mr-2">
                      {m.charAt(0)}
                    </span>
                    {m}
                  </span>
                ))}
              </div>

              {/* Problem Statement */}
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-4 rounded-2xl border border-violet-100 relative">
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-r-full"></div>
                <div className="flex items-start space-x-2 pl-3">
                  <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-violet-900 italic font-medium leading-relaxed">
                    "{team.problemStatement}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Infrastructure & Volunteer */}
          <div className="lg:col-span-4 space-y-6">
            {/* Infrastructure Card */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/60">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white mr-3 shadow-lg shadow-indigo-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  Infrastructure
                </h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-md hover:border-slate-200 transition-all">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Room</span>
                  <span className="font-mono text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{team.roomNumber}</span>
                </div>
                <div className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-md hover:border-slate-200 transition-all">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Table</span>
                  <span className="font-mono text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{team.tableNumber}</span>
                </div>

                <div className="col-span-2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-white/20 rounded-lg mr-2 backdrop-blur-sm">
                          <Wifi className="w-4 h-4" />
                        </div>
                        <span className="font-bold">Wi-Fi Access</span>
                      </div>
                      <button onClick={() => setShowWifi(!showWifi)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm">
                        {showWifi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/10">
                        <div>
                          <span className="text-xs text-indigo-200 font-medium block mb-0.5">Network Name</span>
                          <span className="font-mono text-sm font-bold">{team.wifiSsid}</span>
                        </div>
                        <button onClick={() => handleCopy(team.wifiSsid, 'ssid')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                          {copiedField === 'ssid' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/10">
                        <div>
                          <span className="text-xs text-indigo-200 font-medium block mb-0.5">Password</span>
                          <span className="font-mono text-sm font-bold tracking-wider">
                            {showWifi ? team.wifiPass : '••••••••••'}
                          </span>
                        </div>
                        <button onClick={() => handleCopy(team.wifiPass, 'pass')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" disabled={!showWifi}>
                          {copiedField === 'pass' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Volunteer Card */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/60">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white mr-3 shadow-lg shadow-emerald-200">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  Assigned Mentor
                </h3>
              </div>
              <div className="p-6">
                {volunteer ? (
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {volunteer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg text-slate-900">{volunteer.name}</p>
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold mt-1">{volunteer.role}</span>
                      <div className="flex items-center space-x-3 mt-2">
                        <a href={`tel:${volunteer.phone}`} className="inline-flex items-center text-sm text-slate-600 hover:text-violet-600 transition-colors">
                          <Phone className="w-3.5 h-3.5 mr-1.5" />
                          {volunteer.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <UserIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium text-sm">No mentor assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle: Announcements */}
          <div className="lg:col-span-4 h-full min-h-[400px]">
            <AnnouncementFeed announcements={announcements} />
          </div>

          {/* Right Column: Submission */}
          <div className="lg:col-span-4 glass-card rounded-3xl overflow-hidden flex flex-col h-full border-t-4 border-t-violet-500 border border-white/60">
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h3 className="font-bold text-slate-900 flex items-center text-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white mr-3 shadow-lg shadow-violet-200">
                  <Upload className="w-4 h-4" />
                </div>
                Project Submission
              </h3>
            </div>
            <div className="p-6 flex flex-col flex-grow bg-gradient-to-br from-slate-50/50 to-white">
              {team.submissionLink ? (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 mb-6 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h4 className="text-emerald-900 font-bold text-xl mb-2">Project Submitted!</h4>
                  <p className="text-emerald-700 text-sm mb-4">Good luck with the evaluation!</p>
                  <a href={team.submissionLink} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 text-emerald-700 bg-emerald-100 rounded-xl text-sm font-semibold hover:bg-emerald-200 transition-all">
                    View Submission
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                  <p className="text-amber-700 text-xs font-medium">Submission Pending - Good luck!</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-auto space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Project Demo Link</label>
                  <input
                    type="url"
                    required
                    className="block w-full rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-violet-500 text-sm p-3 outline-none transition-all"
                    placeholder="https://..."
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">GitHub Repository</label>
                  <input
                    type="url"
                    className="block w-full rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-violet-500 text-sm p-3 outline-none transition-all"
                    placeholder="https://github.com/..."
                    value={gitRepoLink}
                    onChange={(e) => setGitRepoLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">YouTube Video (Optional)</label>
                  <input
                    type="url"
                    className="block w-full rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-violet-500 text-sm p-3 outline-none transition-all"
                    placeholder="https://youtube.com/..."
                    value={youtubeLiveLink}
                    onChange={(e) => setYoutubeLiveLink(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-4 mt-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (team.submissionLink ? 'Update Submission' : 'Submit Project')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mt-6">
          <Schedule compact />
        </div>
      </div>

      {/* Floating Action Bar - Help Request */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleRequestHelp}
          disabled={isRequestingHelp || helpRequestSent}
          className={`group flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${helpRequestSent ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-red-600 to-rose-600 text-white'} ${isRequestingHelp ? 'opacity-70 animate-pulse' : ''}`}
        >
          <div className="relative">
            {helpRequestSent ? (
              <CheckCircle className="w-6 h-6 animate-[scaleIn_0.3s_ease-out]" />
            ) : (
              <LifeBuoy className={`w-6 h-6 ${isRequestingHelp ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold uppercase tracking-wider">
              {helpRequestSent ? 'Request Sent!' : 'Request Help'}
            </span>
            <span className="text-[10px] opacity-80 whitespace-nowrap">
              {helpRequestSent ? 'Mentor notified' : 'One-tap mentor notification'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};