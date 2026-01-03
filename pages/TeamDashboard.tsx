import React, { useEffect, useState } from 'react';
import { Team, Volunteer, Announcement, HackathonConfig } from '../types';
import { dbService } from '../services/mockDb';
import { Timer } from '../components/Timer';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { Wifi, MapPin, User as UserIcon, Upload, CheckCircle, ExternalLink, Eye, EyeOff, Loader2, Code2, Copy, Check, Phone, Mail, Sparkles, AlertCircle, Clock } from 'lucide-react';

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
  const [copiedField, setCopiedField] = useState<'ssid' | 'pass' | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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

  if (loading || !team || !config) {
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
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
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
          <Timer endTime={config.endTime} />
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
              {/* Room */}
              <div className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-md hover:border-slate-200 transition-all">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Room</span>
                <span className="font-mono text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{team.roomNumber}</span>
              </div>
              {/* Table */}
              <div className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-md hover:border-slate-200 transition-all">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Table</span>
                <span className="font-mono text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{team.tableNumber}</span>
              </div>

              {/* Wi-Fi Card */}
              <div className="col-span-2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-white/20 rounded-lg mr-2 backdrop-blur-sm">
                        <Wifi className="w-4 h-4" />
                      </div>
                      <span className="font-bold">Wi-Fi Access</span>
                    </div>
                    <button
                      onClick={() => setShowWifi(!showWifi)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                    >
                      {showWifi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* SSID */}
                    <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/10">
                      <div>
                        <span className="text-xs text-indigo-200 font-medium block mb-0.5">Network Name</span>
                        <span className="font-mono text-sm font-bold">{team.wifiSsid}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(team.wifiSsid, 'ssid')}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        {copiedField === 'ssid' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password */}
                    <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/10">
                      <div>
                        <span className="text-xs text-indigo-200 font-medium block mb-0.5">Password</span>
                        <span className="font-mono text-sm font-bold tracking-wider">
                          {showWifi ? team.wifiPass : '••••••••••'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(team.wifiPass, 'pass')}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={!showWifi}
                      >
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
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-lg opacity-30"></div>
                    <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {volunteer.name.charAt(0)}
                    </div>
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
                  <div className="inline-flex p-4 rounded-full bg-slate-100 mb-3">
                    <UserIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No volunteer assigned yet</p>
                  <p className="text-xs text-slate-400 mt-1">One will be assigned shortly</p>
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
                <div className="relative inline-flex mb-3">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative inline-flex p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full text-white shadow-lg">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </div>
                <h4 className="text-emerald-900 font-bold text-xl mb-2">Project Submitted!</h4>
                <p className="text-emerald-700 text-sm mb-4">Good luck with the evaluation!</p>

                <a
                  href={team.submissionLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-4 py-2 text-emerald-700 bg-emerald-100 rounded-xl text-sm font-semibold hover:bg-emerald-200 transition-all group"
                >
                  View Submission
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <div className="mt-4 pt-4 border-t border-emerald-100/50 flex items-center justify-center space-x-2 text-emerald-600">
                  <Clock className="w-4 h-4" />
                  <p className="text-xs font-medium">
                    Submitted at {new Date(team.submissionTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-400 p-3 rounded-xl mr-4 text-white shadow-lg shadow-amber-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-amber-900 font-bold text-sm">Submission Pending</h4>
                  <p className="text-amber-700 text-xs mt-1 leading-relaxed">Submit your GitHub or Presentation link before the timer hits zero!</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-auto bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <label htmlFor="link" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Project URL
              </label>
              <input
                type="url"
                id="link"
                required
                className="block w-full rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm p-4 mb-4 transition-all outline-none font-medium placeholder:text-slate-400"
                placeholder="https://github.com/username/repo"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-violet-500/30 disabled:opacity-50 transition-all shadow-xl shadow-violet-200 hover:shadow-2xl hover:shadow-violet-300 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>

                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {team.submissionLink ? 'Update Submission' : 'Submit Project'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};