import React, { useEffect, useState } from 'react';
import { Team, HackathonConfig } from '../types';
import { dbService } from '../services/mockDb';
import { Timer } from '../components/Timer';
import { Search, MapPin, Loader2, Users, CheckCircle, ExternalLink, Trophy, Star, Award, MessageSquare, Save } from 'lucide-react';
import { useRealtimeTeams } from '../hooks/useRealtime';

interface JudgeDashboardProps {
    judgeId: string;
}

export const JudgeDashboard: React.FC<JudgeDashboardProps> = ({ judgeId }) => {
    const { teams, loading: teamsLoading } = useRealtimeTeams();
    const [config, setConfig] = useState<HackathonConfig | null>(null);
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [roomFilter, setRoomFilter] = useState('');
    const [editingScores, setEditingScores] = useState<Record<string, { score: string, remarks: string }>>({});
    const [savingId, setSavingId] = useState<string | null>(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setConfig(await dbService.getConfig());
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingConfig(false);
            }
        };
        fetchConfig();
    }, []);

    const handleScoreChange = (teamId: string, value: string) => {
        setEditingScores(prev => ({
            ...prev,
            [teamId]: { ...(prev[teamId] || { score: '', remarks: '' }), score: value }
        }));
    };

    const handleRemarksChange = (teamId: string, value: string) => {
        setEditingScores(prev => ({
            ...prev,
            [teamId]: { ...(prev[teamId] || { score: '', remarks: '' }), remarks: value }
        }));
    };

    const handleSaveJudging = async (teamId: string) => {
        const edit = editingScores[teamId];
        if (!edit) return;

        setSavingId(teamId);
        try {
            const scoreNum = parseInt(edit.score) || 0;
            await dbService.updateJudging(teamId, scoreNum, edit.remarks);
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (e) {
            console.error(e);
            alert('Failed to save judging data');
        } finally {
            setSavingId(null);
        }
    };

    if (teamsLoading || loadingConfig || !config) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-xl">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                </div>
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Initializing jury console...</p>
            </div>
        );
    }

    const filteredTeams = teams.filter(t =>
        !roomFilter || t.roomNumber.toLowerCase().includes(roomFilter.toLowerCase())
    ).filter(t => t.isCheckedIn); // Judges usually only judge checked-in teams

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-24 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
                    <div className="flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/30">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Judging criteria saved!</span>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[260px]">
                    <Timer endTime={config.endTime} />
                </div>

                <div className="glass-card rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden border border-white/60">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-200 mb-4">
                            <Award className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Jury Console</h2>
                        <p className="text-slate-500 font-medium mt-2">Evaluate teams and provide feedback.</p>
                        <div className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100">
                            <Star className="w-4 h-4 mr-2" />
                            Grading Scale: 0 - 100
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="glass-card p-6 rounded-2xl border border-white/60">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Project Evaluation</h3>
                        <p className="text-slate-500 font-medium text-sm">Teams waiting for your professional verdict</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                            <Search className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                            placeholder="Search by Room Number (e.g. 204)..."
                            value={roomFilter}
                            onChange={(e) => setRoomFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredTeams.map((team) => {
                    const edit = editingScores[team.id];
                    const currentScore = edit?.score ?? (team.score?.toString() || '');
                    const currentRemarks = edit?.remarks ?? (team.judgeRemarks || '');
                    const isDirty = (edit?.score !== undefined && edit.score !== (team.score?.toString() || '')) ||
                        (edit?.remarks !== undefined && edit.remarks !== (team.judgeRemarks || ''));

                    return (
                        <div key={team.id} className="glass-card rounded-3xl overflow-hidden border border-white/60 hover:shadow-xl transition-all duration-300">
                            <div className="p-6 sm:p-8">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Team Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                                {team.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900">{team.name}</h4>
                                                <div className="flex items-center text-sm text-slate-500 mt-0.5">
                                                    <Users className="w-4 h-4 mr-1.5" />
                                                    {team.members.join(', ')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                                                <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                                                Room {team.roomNumber} / Table {team.tableNumber}
                                            </span>
                                            {team.submissionLink ? (
                                                <a href={team.submissionLink} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors">
                                                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                                    View Project Links
                                                </a>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold">
                                                    No Submission Yet
                                                </span>
                                            )}
                                        </div>

                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Problem Statement</p>
                                            <p className="text-sm text-slate-700 font-medium leading-relaxed italic">"{team.problemStatement}"</p>
                                        </div>
                                    </div>

                                    {/* Grading Section */}
                                    <div className="lg:w-[400px] space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                                                    <Trophy className="w-3 h-3 mr-1.5 text-amber-500" /> Score (0-100)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                        placeholder="Score"
                                                        value={currentScore}
                                                        onChange={(e) => handleScoreChange(team.id, e.target.value)}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">/ 100</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                                                <MessageSquare className="w-3 h-3 mr-1.5 text-indigo-500" /> Jury Remarks
                                            </label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                                                placeholder="Provide feedback or notes..."
                                                value={currentRemarks}
                                                onChange={(e) => handleRemarksChange(team.id, e.target.value)}
                                            />
                                        </div>

                                        <button
                                            onClick={() => handleSaveJudging(team.id)}
                                            disabled={savingId === team.id || !isDirty}
                                            className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all ${isDirty
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5'
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {savingId === team.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>{team.score !== undefined ? 'Update Marks' : 'Submit Evaluation'}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredTeams.length === 0 && (
                    <div className="text-center py-20 glass-card rounded-3xl border border-white/60">
                        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
                            <Search className="w-12 h-12 text-slate-300" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">No teams found in this room</h4>
                        <p className="text-slate-500 mt-2">Try searching with a different room number or check-in status.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
