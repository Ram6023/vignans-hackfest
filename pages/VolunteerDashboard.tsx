import React, { useEffect, useState } from 'react';
import { Team, Announcement, HackathonConfig } from '../types';
import { dbService } from '../services/mockDb';
import { Timer } from '../components/Timer';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { StatsCard } from '../components/StatsCard';
import { Search, MapPin, CheckSquare, Square, Loader2, Users, CheckCircle, Phone, Trophy, ExternalLink, Clock, Sparkles, X } from 'lucide-react';

interface VolunteerDashboardProps {
  volunteerId: string;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ volunteerId }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [config, setConfig] = useState<HackathonConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkInModal, setCheckInModal] = useState<Team | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleCheckIn = async (team: Team) => {
    setIsCheckingIn(true);
    try {
      const updatedTeam = {
        ...team,
        isCheckedIn: true,
        checkInTime: new Date().toISOString()
      };
      await dbService.updateTeam(updatedTeam);
      setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
      setCheckInModal(null);
      setSuccessMessage(`${team.name} has been checked in successfully!`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (e) {
      alert('Failed to check in');
    } finally {
      setIsCheckingIn(false);
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

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = teams.filter(t => t.isCheckedIn).length;
  const submittedCount = teams.filter(t => t.submissionLink).length;

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

      {/* Check-in Modal */}
      {checkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setCheckInModal(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[scaleIn_0.2s_ease-out]">
            {/* Close Button */}
            <button
              onClick={() => setCheckInModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              {/* Premium Icon with Glow */}
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                  <CheckSquare className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Confirm Check-In</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to mark <span className="font-semibold text-slate-700">{checkInModal.name}</span> as checked in?
              </p>

              {/* Team Info */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Location</span>
                  <span className="font-mono font-bold text-slate-900">{checkInModal.roomNumber} / {checkInModal.tableNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-500">Members</span>
                  <span className="font-semibold text-slate-900">{checkInModal.members.length} people</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setCheckInModal(null)}
                  className="btn-slide-in-ghost flex-1"
                >
                  <span>Cancel</span>
                </button>
                <button
                  onClick={() => handleCheckIn(checkInModal)}
                  disabled={isCheckingIn}
                  className="btn-slide-in-emerald flex-1"
                >
                  {isCheckingIn ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      <span>Confirm</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 h-[260px]">
          <Timer endTime={config.endTime} />
        </div>
        <StatsCard
          title="Assigned Teams"
          value={teams.length}
          icon={Users}
          color="blue"
          subtitle="Under your supervision"
        />
        <StatsCard
          title="Submissions"
          value={`${submittedCount}/${teams.length}`}
          icon={CheckCircle}
          color="green"
          subtitle={submittedCount === teams.length ? 'All submitted!' : 'In progress'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Team List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search Header */}
          <div className="glass-card p-5 rounded-2xl border border-white/60">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Assigned Teams</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {checkedInCount} of {teams.length} teams checked in
                </p>
              </div>
              <div className="relative w-full sm:w-72">
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
          <div className="grid grid-cols-1 gap-4">
            {filteredTeams.map((team, index) => (
              <div
                key={team.id}
                className={`group relative bg-white rounded-2xl p-6 transition-all duration-300 border-2 hover:shadow-lg ${team.isCheckedIn
                  ? 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30'
                  : 'border-slate-200 hover:border-violet-300 hover:shadow-violet-100'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Priority Badge for top teams */}
                {index === 0 && !team.isCheckedIn && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Priority
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{team.name}</h3>
                      {team.submissionLink && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200">
                          <Trophy className="w-3 h-3 mr-1" />
                          Submitted
                        </span>
                      )}
                    </div>

                    {/* Members */}
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <Users className="w-4 h-4 mr-1.5" />
                      <span className="font-medium">{team.members.join(', ')}</span>
                    </div>

                    {/* Location & Problem */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                        <MapPin className="w-3 h-3 mr-1.5 text-violet-500" />
                        {team.roomNumber}
                        <span className="mx-1.5 text-slate-300">|</span>
                        {team.tableNumber}
                      </span>

                      {team.submissionLink && (
                        <a
                          href={team.submissionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-1.5 rounded-xl bg-violet-100 text-violet-700 text-xs font-bold hover:bg-violet-200 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1.5" />
                          View Project
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Check-in Status/Button */}
                  <div className="flex items-center">
                    {team.isCheckedIn ? (
                      <div className="flex items-center bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 px-5 py-3.5 rounded-2xl border border-emerald-200">
                        {/* Premium Icon with Glow */}
                        <div className="relative mr-3">
                          <div className="absolute inset-0 bg-emerald-400 rounded-xl blur-sm opacity-50"></div>
                          <div className="relative p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                            <CheckSquare className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">Checked In</span>
                          <span className="text-xs opacity-80 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(team.checkInTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCheckInModal(team)}
                        className="btn-slide-in-primary w-full md:w-auto"
                      >
                        <Square className="w-4 h-4" />
                        <span>Check In Team</span>
                      </button>
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
                <p className="text-slate-400 mt-1">Try adjusting your search terms</p>
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