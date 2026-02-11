import React, { useEffect, useState } from 'react';
import { Team, Announcement, HackathonConfig, Volunteer, User } from '../types';
import { dbService } from '../services/mockDb';
import { StatsCard } from '../components/StatsCard';
import { AnnouncementFeed } from '../components/AnnouncementFeed';
import { Timer } from '../components/Timer';
import { Users, UserCheck, CheckCircle, Megaphone, Plus, Download, Edit2, Send, Eye, ExternalLink, Trophy, Medal, X, Loader2, Search, Filter, BarChart3, Sparkles, Clock, AlertCircle, FileText, Code2, Calculator, Info } from 'lucide-react';

import { useRealtimeTeams, useRealtimeAnnouncements, useRealtimeNotifications } from '../hooks/useRealtime';

export const AdminDashboard: React.FC = () => {
    // Real-time data hooks
    const { teams, loading: teamsLoading } = useRealtimeTeams();
    const { announcements, loading: announcementsLoading } = useRealtimeAnnouncements();
    const { notifications, addNotification } = useRealtimeNotifications();

    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [judges, setJudges] = useState<User[]>([]);
    const [config, setConfig] = useState<HackathonConfig | null>(null);
    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'volunteers' | 'submissions' | 'leaderboard'>('overview');
    const [selectedTeamForDetails, setSelectedTeamForDetails] = useState<Team | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const [submissionFilter, setSubmissionFilter] = useState<'all' | 'reviewed' | 'pending'>('all');

    const fetchInitialData = async () => {
        const [vols, jds, cfg] = await Promise.all([
            dbService.getVolunteers(),
            dbService.getJudges(),
            dbService.getConfig()
        ]);
        setVolunteers(vols);
        setJudges(jds);
        setConfig(cfg);
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handlePostAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAnnouncement.trim()) return;
        setIsPosting(true);
        try {
            await dbService.postAnnouncement(newAnnouncement);
            setNewAnnouncement('');
            setSuccessMessage('Announcement posted successfully!');
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (e) {
            console.error(e);
        } finally {
            setIsPosting(false);
        }
    };

    const markSubmissionViewed = async (team: Team) => {
        if (!team.submissionViewed) {
            const updatedTeam = { ...team, submissionViewed: true };
            await dbService.updateTeam(updatedTeam);
        }
    };

    const handleViewSubmission = async (team: Team) => {
        if (!team.submissionLink) return;
        window.open(team.submissionLink, '_blank');
        markSubmissionViewed(team);
    };

    const handleScoreUpdate = async (teamId: string, newScore: string) => {
        const score = parseInt(newScore) || 0;
        const team = teams.find(t => t.id === teamId);
        if (!team || team.score === score) return;

        const updatedTeam = { ...team, score };
        await dbService.updateTeam(updatedTeam);
    };

    const handleExport = () => {
        const headers = [
            "Team ID", "Name", "Email", "Members", "Problem Statement",
            "Room", "Checked In",
            "Main Project", "Git Repo", "YouTube Demo", "Submitted At",
            "Volunteer Associated", "Judge Associated", "Review Status",
            "Idea Elevation", "Frontend & Logic", "Backend & Tech", "Final Round", "Total Score"
        ];

        const rows = teams.map(t => {
            const volunteer = volunteers.find(v => v.id === t.assignedVolunteerId);
            const judge = judges.find(j => j.id === t.assignedJudgeId);
            const memberNames = t.members ? t.members.map(m => m.name).join("; ") : "";
            const volunteerName = volunteer ? volunteer.name : "Unassigned";
            const judgeName = judge ? judge.name : "Unassigned";
            const status = t.submissionViewed ? "Reviewed" : "Pending";
            const submittedAt = t.submissionTime ? new Date(t.submissionTime).toLocaleString().replace(/,/g, " ") : "Not Submitted";

            // Helper to escape CSV fields
            const escape = (str: string | undefined | null) => `"${(str || "").toString().replace(/"/g, '""')}"`;

            return [
                t.id,
                escape(t.name),
                escape(t.email),
                escape(memberNames),
                escape(t.problemStatement),
                escape(t.roomNumber),
                t.isCheckedIn ? "Yes" : "No",
                escape(t.submissionLink),
                escape(t.gitRepoLink),
                escape(t.youtubeLiveLink),
                submittedAt,
                escape(volunteerName),
                escape(judgeName),
                status,
                t.roundScores?.ideaElevation || 0,
                t.roundScores?.frontendLogics || 0,
                t.roundScores?.backendTechnicality || 0,
                t.roundScores?.finalRound || 0,
                t.score || 0
            ].join(",");
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);

        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `hackfest_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        setSuccessMessage('Comprehensive data exported successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleAssignVolunteer = async (teamId: string, volunteerId: string) => {
        try {
            await dbService.assignVolunteer(teamId, volunteerId);
            setSuccessMessage('Volunteer assigned successfully!');
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAssignJudge = async (teamId: string, judgeId: string) => {
        try {
            await dbService.assignJudge(teamId, judgeId);
            setSuccessMessage('Judge assigned successfully!');
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddTeam = async () => {
        const name = prompt('Enter Team Name:');
        if (!name) return;
        const email = prompt('Enter Team Email:');

        const newTeam: Team = {
            id: `t${Date.now()}`,
            name,
            email: email || `team${Date.now()}@hackfest.com`,
            members: [],
            problemStatement: 'Not assigned yet',
            roomNumber: 'TBD',
            tableNumber: 'TBD',
            wifiSsid: 'Hackfest-Guest',
            wifiPass: 'welcome123',
            assignedVolunteerId: '',
            isCheckedIn: false,
            score: 0
        };

        await dbService.createTeam(newTeam);
        setSuccessMessage('Team added successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleAddVolunteer = async () => {
        const name = prompt('Enter Volunteer Name:');
        if (!name) return;
        const email = prompt('Enter Volunteer Email:');

        const newVolunteer: Volunteer = {
            id: `v${Date.now()}`,
            name,
            email: email || `vol${Date.now()}@hackfest.com`,
            phone: '',
            role: 'Floor Support',
            isAvailable: true
        };

        await dbService.createVolunteer(newVolunteer);
        setSuccessMessage('Volunteer added successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        // Refresh volunteers list since it's not hooked to realtime yet
        setVolunteers(await dbService.getVolunteers());
    };

    const totalTeams = teams.length;
    const checkedInTeams = teams.filter(t => t.isCheckedIn).length;
    const submittedTeams = teams.filter(t => t.submissionLink).length;
    const viewedTeams = teams.filter(t => t.submissionViewed).length;

    const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));
    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'teams', label: 'Teams', icon: Users },
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'volunteers', label: 'Volunteers', icon: UserCheck },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    ] as const;

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
                    <div className="flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/30">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">{successMessage}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/60">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            {/* Premium Icon with Glow */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl blur-md opacity-50"></div>
                                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage the event in real-time. Monitor teams, volunteers, and submissions.</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="btn-slide-in-ghost"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Data</span>
                    </button>
                </div>
            </div>

            {config && (
                <div className="h-[220px]">
                    <Timer startTime={config.startTime} endTime={config.endTime} />
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 p-1.5 bg-white/50 backdrop-blur-sm rounded-2xl w-fit border border-white/40">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center space-x-2 py-3 px-5 rounded-xl text-sm font-bold capitalize transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-white shadow-lg shadow-slate-200/50 text-violet-600'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Team Details Modal */}
            {isDetailsModalOpen && selectedTeamForDetails && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={() => setIsDetailsModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] border border-white">
                        {/* Header */}
                        <div className="px-8 py-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white relative">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                                    <span className="text-2xl font-black">{selectedTeamForDetails.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{selectedTeamForDetails.name}</h2>
                                    <p className="text-indigo-100 font-medium opacity-90">{selectedTeamForDetails.problemStatement}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Side: Round Scores */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <Trophy className="w-4 h-4 mr-2" /> Evaluation Breakdown
                                    </h3>

                                    {[
                                        { label: 'R1: Idea Elevation', key: 'ideaElevation' },
                                        { label: 'R2: Frontend & Logics', key: 'frontendLogics' },
                                        { label: 'R3: Backend & Tech', key: 'backendTechnicality' },
                                        { label: 'R4: Final Round', key: 'finalRound' }
                                    ].map((round) => (
                                        <div key={round.key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-violet-200 transition-all group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-slate-500">{round.label}</span>
                                                <span className="px-3 py-1 rounded-lg bg-white text-violet-600 font-bold text-sm shadow-sm border border-slate-100">
                                                    {(selectedTeamForDetails.roundScores as any)?.[round.key] || 0} / 100
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 italic leading-relaxed">
                                                {(selectedTeamForDetails.roundRemarks as any)?.[round.key] || 'No specific remarks for this round.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Side: Summary Stats */}
                                <div className="space-y-6">
                                    <div className="bg-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-violet-200 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                            <Calculator className="w-16 h-16" />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="text-xs font-bold text-violet-200 uppercase tracking-wider mb-4">Final Summary</h4>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <span className="block text-4xl font-black leading-none">{selectedTeamForDetails.score || 0}</span>
                                                    <span className="text-[10px] font-bold text-violet-200 uppercase">Total Marks</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-2xl font-black leading-none">
                                                        {((selectedTeamForDetails.score || 0) / 4).toFixed(1)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-violet-200 uppercase">Average</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card rounded-2xl p-5 border border-slate-100">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                                            <UserCheck className="w-3.5 h-3.5 mr-2" /> Assigned Evaluator
                                        </h4>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                                                {judges.find(j => j.id === selectedTeamForDetails.assignedJudgeId)?.name.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {judges.find(j => j.id === selectedTeamForDetails.assignedJudgeId)?.name || 'Not assigned'}
                                                </p>
                                                <p className="text-[10px] text-slate-500">Official Hackathon Jury</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                                        <h4 className="text-xs font-black text-amber-600 uppercase tracking-wider mb-2 flex items-center">
                                            <Info className="w-3.5 h-3.5 mr-2" /> General Remarks
                                        </h4>
                                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                            {selectedTeamForDetails.judgeRemarks || "The jury hasn't provided overall comments yet."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all"
                            >
                                Close Overview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatsCard
                                title="Total Teams"
                                value={totalTeams}
                                icon={Users}
                                color="blue"
                                subtitle="Registered"
                            />
                            <StatsCard
                                title="Checked In"
                                value={checkedInTeams}
                                icon={UserCheck}
                                color="green"
                                subtitle={`${Math.round((checkedInTeams / totalTeams) * 100)}% attendance`}
                            />
                            <StatsCard
                                title="Submissions"
                                value={submittedTeams}
                                icon={CheckCircle}
                                color="purple"
                                subtitle={`${totalTeams - submittedTeams} pending`}
                            />
                        </div>

                        {/* Broadcast Announcement */}
                        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/60">
                            <div className="flex items-center space-x-3 mb-6">
                                {/* Premium Icon with Glow */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl blur-md opacity-50"></div>
                                    <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30">
                                        <Megaphone className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Broadcast Announcement</h3>
                                    <p className="text-sm text-slate-500">Send a message to all participants</p>
                                </div>
                            </div>

                            <form onSubmit={handlePostAnnouncement}>
                                <div className="relative">
                                    <textarea
                                        className="w-full border-2 border-slate-200 bg-slate-50 focus:bg-white rounded-2xl p-4 text-slate-700 placeholder-slate-400 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all resize-none outline-none font-medium"
                                        rows={4}
                                        placeholder="Write a message to all participants..."
                                        value={newAnnouncement}
                                        onChange={(e) => setNewAnnouncement(e.target.value)}
                                    />
                                    <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-xs text-slate-400">
                                        <span className={newAnnouncement.length > 0 ? 'text-violet-500' : ''}>
                                            {newAnnouncement.length}
                                        </span>
                                        <span>/</span>
                                        <span>500</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isPosting || !newAnnouncement.trim()}
                                        className="btn-slide-in-primary"
                                    >
                                        {isPosting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        <span>Post Message</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Announcements Sidebar */}
                    <div className="lg:col-span-1">
                        <AnnouncementFeed announcements={announcements} />
                    </div>
                </div>
            )}

            {/* Teams Tab */}
            {activeTab === 'teams' && (
                <div className="glass-card rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-white/60">
                    <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Registered Teams</h3>
                                <p className="text-sm text-slate-500">Manage infrastructure and assignments</p>
                            </div>
                            <div className="flex items-center space-x-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search teams..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    onClick={handleAddTeam}
                                    className="btn-slide-in-primary btn-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Team</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-6 sm:px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Team</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Submission</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Git Repo</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">YouTube</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Volunteer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Judge</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {filteredTeams.map((team) => (
                                    <tr key={team.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 sm:px-8 py-5 whitespace-nowrap">
                                            <div
                                                className="flex items-center space-x-3 cursor-pointer group/name"
                                                onClick={() => {
                                                    setSelectedTeamForDetails(team);
                                                    setIsDetailsModalOpen(true);
                                                }}
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600 font-bold group-hover/name:scale-110 transition-transform">
                                                    {team.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 group-hover/name:text-violet-600 transition-colors">{team.name}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">{team.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            {team.isCheckedIn ? (
                                                <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                                                    Checked In
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse"></span>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            {!team.submissionLink ? (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                    <Clock className="w-3 h-3 mr-1.5" />
                                                    Pending
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleViewSubmission(team)}
                                                    className={`group/btn inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${team.submissionViewed
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
                                                            <span className="relative flex h-2 w-2 mr-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                            </span>
                                                            New
                                                        </>
                                                    )}
                                                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            {!team.gitRepoLink ? (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                    <Clock className="w-3 h-3 mr-1.5" />
                                                    Not Added
                                                </span>
                                            ) : (
                                                <a
                                                    href={team.gitRepoLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={() => markSubmissionViewed(team)}
                                                    className="group/btn inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:shadow-md transition-all"
                                                >
                                                    <ExternalLink className="w-3 h-3 mr-1.5" />
                                                    View Repo
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            {!team.youtubeLiveLink ? (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                    <Clock className="w-3 h-3 mr-1.5" />
                                                    Not Added
                                                </span>
                                            ) : (
                                                <a
                                                    href={team.youtubeLiveLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={() => markSubmissionViewed(team)}
                                                    className="group/btn inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:shadow-md transition-all"
                                                >
                                                    <ExternalLink className="w-3 h-3 mr-1.5" />
                                                    Watch Demo
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center space-x-1 text-sm font-medium">
                                                <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">{team.roomNumber}</span>
                                                <span className="text-slate-300">/</span>
                                                <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">{team.tableNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <select
                                                value={team.assignedVolunteerId || ''}
                                                onChange={(e) => handleAssignVolunteer(team.id, e.target.value)}
                                                className="bg-transparent text-sm font-medium text-slate-700 outline-none border-b-2 border-transparent hover:border-slate-200 focus:border-violet-500 transition-all cursor-pointer py-1"
                                            >
                                                <option value="">Unassigned</option>
                                                {volunteers.map(v => (
                                                    <option key={v.id} value={v.id}>{v.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <select
                                                value={team.assignedJudgeId || ''}
                                                onChange={(e) => handleAssignJudge(team.id, e.target.value)}
                                                className="bg-transparent text-sm font-medium text-slate-700 outline-none border-b-2 border-transparent hover:border-slate-200 focus:border-violet-500 transition-all cursor-pointer py-1"
                                            >
                                                <option value="">Unassigned</option>
                                                {judges.map(j => (
                                                    <option key={j.id} value={j.id}>{j.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Volunteers Tab */}
            {activeTab === 'volunteers' && (
                <div className="glass-card rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-white/60">
                    <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Volunteers</h3>
                            <p className="text-sm text-slate-500">Floor support team details</p>
                        </div>
                        <button
                            onClick={handleAddVolunteer}
                            className="btn-slide-in-primary btn-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Volunteer</span>
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {volunteers.map((vol) => (
                            <div key={vol.id} className="group bg-white rounded-2xl p-5 border-2 border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-violet-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {vol.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-base font-bold text-slate-900">{vol.name}</div>
                                        <div className="text-xs text-slate-500 truncate">{vol.email}</div>
                                        <span className="inline-block mt-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-violet-100 text-violet-700">
                                            {vol.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <a href={`tel:${vol.phone}`} className="text-sm font-mono text-slate-600 hover:text-violet-600 transition-colors">
                                        {vol.phone}
                                    </a>
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
                <div className="glass-card rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-white/60">
                    <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Project Submissions</h3>
                                <p className="text-sm text-slate-500">Review and evaluate team projects</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={submissionFilter}
                                        onChange={(e) => setSubmissionFilter(e.target.value as any)}
                                        className="pl-10 pr-8 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all bg-white appearance-none cursor-pointer hover:border-violet-300"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending Review</option>
                                        <option value="reviewed">Reviewed</option>
                                    </select>
                                </div>
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search submissions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">Team Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Submissions</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Total Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {filteredTeams
                                    .filter(t => t.submissionLink || t.gitRepoLink || t.youtubeLiveLink)
                                    .filter(t => {
                                        if (submissionFilter === 'reviewed') return t.submissionViewed;
                                        if (submissionFilter === 'pending') return !t.submissionViewed;
                                        return true;
                                    })
                                    .map((team) => (
                                        <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-5">
                                                <div
                                                    className="flex items-start space-x-4 cursor-pointer group/name"
                                                    onClick={() => {
                                                        setSelectedTeamForDetails(team);
                                                        setIsDetailsModalOpen(true);
                                                    }}
                                                >
                                                    <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600 font-bold text-xl shadow-sm group-hover/name:scale-110 transition-transform">
                                                        {team.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-base font-bold text-slate-900 leading-tight group-hover/name:text-violet-600 transition-colors uppercase tracking-tight">{team.name}</div>
                                                        <div className="text-sm text-slate-500 mt-0.5">{team.email}</div>

                                                        <div className="mt-3 flex items-center space-x-2">
                                                            <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 inline-block max-w-full truncate">
                                                                <span className="text-slate-400 mr-1.5">Problem:</span>
                                                                {team.problemStatement}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex flex-col space-y-2.5">
                                                    {/* Main Project Link */}
                                                    {team.submissionLink ? (
                                                        <a
                                                            href={team.submissionLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={() => markSubmissionViewed(team)}
                                                            className="group flex items-center p-2 rounded-xl bg-blue-50/50 border border-blue-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:scale-105 transition-transform flex-shrink-0">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-xs font-bold text-blue-700">Main Project</div>
                                                                <div className="text-[10px] text-blue-500 truncate max-w-[150px]">{team.submissionLink}</div>
                                                            </div>
                                                        </a>
                                                    ) : (
                                                        <div className="group flex items-center p-2 rounded-xl bg-slate-50 border border-dashed border-slate-200 opacity-60">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mr-3 flex-shrink-0">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-400">Main Project</div>
                                                                <div className="text-[10px] text-slate-400 italic">Not provided</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Git Repo Link */}
                                                    {team.gitRepoLink ? (
                                                        <a
                                                            href={team.gitRepoLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={() => markSubmissionViewed(team)}
                                                            className="group flex items-center p-2 rounded-xl bg-violet-50/50 border border-violet-100 hover:border-violet-200 hover:bg-violet-50 transition-all"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mr-3 group-hover:scale-105 transition-transform flex-shrink-0">
                                                                <Code2 className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-xs font-bold text-violet-700">Git Repository</div>
                                                                <div className="text-[10px] text-violet-500 truncate max-w-[150px]">{team.gitRepoLink}</div>
                                                            </div>
                                                        </a>
                                                    ) : (
                                                        <div className="group flex items-center p-2 rounded-xl bg-slate-50 border border-dashed border-slate-200 opacity-60">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mr-3 flex-shrink-0">
                                                                <Code2 className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-400">Git Repository</div>
                                                                <div className="text-[10px] text-slate-400 italic">Not provided</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* YouTube Link */}
                                                    {team.youtubeLiveLink ? (
                                                        <a
                                                            href={team.youtubeLiveLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={() => markSubmissionViewed(team)}
                                                            className="group flex items-center p-2 rounded-xl bg-red-50/50 border border-red-100 hover:border-red-200 hover:bg-red-50 transition-all"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mr-3 group-hover:scale-105 transition-transform flex-shrink-0">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-xs font-bold text-red-700">YouTube Demo</div>
                                                                <div className="text-[10px] text-red-500 truncate max-w-[150px]">{team.youtubeLiveLink}</div>
                                                            </div>
                                                        </a>
                                                    ) : (
                                                        <div className="group flex items-center p-2 rounded-xl bg-slate-50 border border-dashed border-slate-200 opacity-60">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mr-3 flex-shrink-0">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-400">YouTube Demo</div>
                                                                <div className="text-[10px] text-slate-400 italic">Not provided</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap align-top pt-8">
                                                <button
                                                    onClick={() => handleViewSubmission(team)}
                                                    className={`group/btn w-full justify-center inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold border transition-all ${team.submissionViewed
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                        }`}
                                                >
                                                    {team.submissionViewed ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Reviewed
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Mark Reviewed
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap align-top pt-6">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-16 px-3 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold text-center bg-slate-50 text-slate-700">
                                                        {team.score || 0}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 align-top pt-8">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                                    {team.submissionTime ? new Date(team.submissionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                {filteredTeams.filter(t => t.submissionLink || t.gitRepoLink || t.youtubeLiveLink).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-slate-100 p-4 rounded-full mb-3">
                                                    <FileText className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="font-medium">No submissions found</p>
                                                <p className="text-sm text-slate-400 mt-1">Teams haven't submitted their projects yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
                <div className="glass-card rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-white/60">
                    <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-amber-50/30 to-slate-50">
                        <div className="flex items-center space-x-3">
                            {/* Premium Icon with Glow */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl blur-md opacity-50"></div>
                                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                                    <Trophy className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Hackathon Leaderboard</h3>
                                <p className="text-sm text-slate-500">Live rankings based on jury scores</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-6 sm:px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Team</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Statement</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Judge Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {sortedTeams.map((team, index) => {
                                    const isTop3 = index < 3;
                                    const medals = [
                                        { gradient: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-200', text: 'text-amber-600' },
                                        { gradient: 'from-slate-300 to-slate-400', shadow: 'shadow-slate-200', text: 'text-slate-500' },
                                        { gradient: 'from-amber-600 to-amber-700', shadow: 'shadow-amber-300', text: 'text-amber-700' }
                                    ];

                                    return (
                                        <tr key={team.id} className={`hover:bg-slate-50/80 transition-colors ${isTop3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}`}>
                                            <td className="px-6 sm:px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {index < 3 ? (
                                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${medals[index].gradient} ${medals[index].shadow} shadow-lg flex items-center justify-center`}>
                                                            <Medal className="w-5 h-5 text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                                            <span className="text-lg font-bold text-slate-500">#{index + 1}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td
                                                className="px-6 py-5 whitespace-nowrap cursor-pointer group/row"
                                                onClick={() => {
                                                    setSelectedTeamForDetails(team);
                                                    setIsDetailsModalOpen(true);
                                                }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 rounded-xl ${isTop3 ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white' : 'bg-slate-100 text-slate-600'} flex items-center justify-center font-bold group-hover/row:scale-110 transition-transform`}>
                                                        {team.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className={`text-sm font-bold flex items-center ${isTop3 ? 'text-slate-900' : 'text-slate-700'}`}>
                                                            {team.name}
                                                            <div className="ml-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                                <Calculator className="w-3.5 h-3.5 text-violet-500" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-0.5">{team.members.length} Members</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm text-slate-600 max-w-xs truncate" title={team.problemStatement}>
                                                    {team.problemStatement}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                {team.submissionLink ? (
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle className="w-3 h-3 mr-1.5" />
                                                        Submitted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-500">
                                                        <AlertCircle className="w-3 h-3 mr-1.5" />
                                                        In Progress
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className={`text-base font-black ${isTop3 ? 'text-violet-600' : 'text-slate-900'}`}>{team.score || 0}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-[10px] text-slate-500 italic max-w-[150px] truncate" title={team.judgeRemarks}>
                                                    {team.judgeRemarks || <span className="text-slate-300">No remarks</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};