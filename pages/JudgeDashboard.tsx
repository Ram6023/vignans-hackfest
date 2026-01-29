import React, { useEffect, useState } from 'react';
import { Team, HackathonConfig } from '../types';
import { dbService } from '../services/mockDb';
import { Timer } from '../components/Timer';
import { Search, MapPin, Loader2, Users, CheckCircle, ExternalLink, Trophy, Star, Award, MessageSquare, Save, ChevronDown, ClipboardList, Info } from 'lucide-react';

import { useRealtimeTeams } from '../hooks/useRealtime';

interface JudgeDashboardProps {
    judgeId: string;
}

const ROUND_CRITERIA = {
    round1: {
        focus: 'Thinking, innovation, clarity',
        items: [
            { title: 'Problem & Target Audience', question: 'How clearly is the problem defined and the target audience identified?' },
            { title: 'Innovation & Uniqueness', question: 'How original and innovative is the idea compared to existing solutions?' },
            { title: 'Solution Feasibility', question: 'Is the idea realistically achievable within given constraints?' },
            { title: 'Real-World Impact', question: 'How impactful and relevant is the solution to real-world users?' },
            { title: 'Presentation & Explanation', question: 'How clearly and confidently did the team explain their idea?' },
        ]
    },
    round2: {
        focus: 'UI, UX, frontend engineering',
        items: [
            { title: 'UI/UX & Responsiveness', question: 'How visually appealing, user-friendly, and responsive is the interface?' },
            { title: 'Frontend Logic & State', question: 'How well is the frontend logic and state handling implemented?' },
            { title: 'User Flow & Navigation', question: 'Is the user journey smooth, intuitive, and logical?' },
            { title: 'Error Handling & Edge Cases', question: 'How well does the frontend handle errors and invalid inputs?' },
            { title: 'Performance & Optimization', question: 'How efficient and responsive is the frontend application?' },
        ]
    },
    round3: {
        focus: 'Engineering depth & correctness',
        items: [
            { title: 'Architecture & API Design', question: 'How well-structured is the backend architecture and API design?' },
            { title: 'Database Design & Usage', question: 'How effective is the database schema, relationships, and queries?' },
            { title: 'Security & Authentication', question: 'How well are security concerns and access control handled?' },
            { title: 'Code Quality & Scalability', question: 'Is the backend code clean, maintainable, and scalable?' },
            { title: 'Error Handling & Reliability', question: 'How robust is the backend in handling failures?' },
        ]
    },
    round4: {
        focus: 'Final decision & winner selection',
        items: [
            { title: 'Overall Completeness', question: 'How complete and functional is the final full-stack solution?' },
            { title: 'Technical Depth & Execution', question: 'How strong is the technical implementation across the stack?' },
            { title: 'Innovation vs Execution', question: 'How well does the team balance creativity with practical execution?' },
            { title: 'Demo & Team Understanding', question: 'How effective was the demo and how well did they handle Q&A?' },
            { title: 'Future Scope & Scaling', question: 'How promising is the solution in terms of future improvements?' },
        ]
    }
};

export const JudgeDashboard: React.FC<JudgeDashboardProps> = ({ judgeId }) => {
    const { teams, loading: teamsLoading } = useRealtimeTeams();
    const [config, setConfig] = useState<HackathonConfig | null>(null);
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [roomFilter, setRoomFilter] = useState('');
    const [selectedRound, setSelectedRound] = useState<'round1' | 'round2' | 'round3' | 'round4'>('round1');
    const [editingScores, setEditingScores] = useState<Record<string, Record<string, {
        score: string,
        remarks: string,
        criteriaScores?: number[]
    }>>>({});
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
            [teamId]: {
                ...(prev[teamId] || {}),
                [selectedRound]: {
                    ...(prev[teamId]?.[selectedRound] || { score: '', remarks: '' }),
                    score: value
                }
            }
        }));
    };

    const handleRemarksChange = (teamId: string, value: string) => {
        setEditingScores(prev => ({
            ...prev,
            [teamId]: {
                ...(prev[teamId] || {}),
                [selectedRound]: {
                    ...(prev[teamId]?.[selectedRound] || { score: '', remarks: '' }),
                    remarks: value
                }
            }
        }));
    };

    const handleCriteriaScoreChange = (teamId: string, index: number, value: number) => {
        setEditingScores(prev => {
            const currentRoundEdits = prev[teamId]?.[selectedRound] || { score: '0', remarks: '' };
            const criteriaCount = ROUND_CRITERIA[selectedRound].items.length;

            let currentCriteriaScores = currentRoundEdits.criteriaScores
                ? [...currentRoundEdits.criteriaScores]
                : new Array(criteriaCount).fill(0);

            if (currentCriteriaScores.length !== criteriaCount) {
                currentCriteriaScores = new Array(criteriaCount).fill(0);
            }

            currentCriteriaScores[index] = value;

            const sum = currentCriteriaScores.reduce((a, b) => a + b, 0);

            return {
                ...prev,
                [teamId]: {
                    ...(prev[teamId] || {}),
                    [selectedRound]: {
                        ...currentRoundEdits,
                        criteriaScores: currentCriteriaScores,
                        score: sum.toString()
                    }
                }
            };
        });
    };

    const handleSaveJudging = async (teamId: string) => {
        const edit = editingScores[teamId]?.[selectedRound];
        if (!edit) return;

        setSavingId(teamId);
        try {
            const scoreNum = parseInt(edit.score) || 0;
            await dbService.updateJudging(teamId, scoreNum, edit.remarks, selectedRound);
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

    const rounds = [
        { id: 'round1', label: '1st Round: Idea Elevation', color: 'blue' },
        { id: 'round2', label: '2nd Round: Frontend & Logics', color: 'green' },
        { id: 'round3', label: '3rd Round: Backend & Technical', color: 'purple' },
        { id: 'round4', label: '4th Round: Final Round', color: 'amber' }
    ] as const;

    const getRoundKey = (roundId: string) => {
        switch (roundId) {
            case 'round1': return 'ideaElevation';
            case 'round2': return 'frontendLogics';
            case 'round3': return 'backendTechnicality';
            case 'round4': return 'finalRound';
            default: return '';
        }
    };

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
                        <div className="mt-8 w-full text-left">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
                                <span>Select Active Round</span>
                                <span className="text-indigo-500 lowercase font-medium">Focus: {ROUND_CRITERIA[selectedRound].focus}</span>
                            </label>
                            <div className="relative group">
                                <select
                                    value={selectedRound}
                                    onChange={(e) => setSelectedRound(e.target.value as any)}
                                    className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 pr-10 font-bold text-slate-700 focus:border-indigo-500 focus:bg-white transition-all outline-none cursor-pointer"
                                >
                                    {rounds.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="glass-card p-6 rounded-2xl border border-white/60">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Project Evaluation</h3>
                        <p className="text-indigo-600 font-bold text-sm tracking-wide uppercase">Active: {rounds.find(r => r.id === selectedRound)?.label}</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <select
                            className="block w-full pl-12 pr-10 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                            value={roomFilter}
                            onChange={(e) => setRoomFilter(e.target.value)}
                        >
                            <option value="">All Rooms / Halls</option>
                            {Array.from(new Set(teams.filter(t => t.isCheckedIn).map(t => t.roomNumber))).sort().map(room => (
                                <option key={room} value={room}>Room: {room}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
                    </div>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredTeams.map((team) => {
                    const roundKey = getRoundKey(selectedRound);
                    const savedScore = (team.roundScores as any)?.[roundKey];
                    const savedRemarks = (team.roundRemarks as any)?.[roundKey];

                    const edit = editingScores[team.id]?.[selectedRound];
                    const currentScore = edit?.score ?? (savedScore?.toString() || '');
                    const currentRemarks = edit?.remarks ?? (savedRemarks || '');

                    const isDirty = (edit?.score !== undefined && edit.score !== (savedScore?.toString() || '')) ||
                        (edit?.remarks !== undefined && edit.remarks !== (savedRemarks || ''));

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
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold ring-1 ring-amber-100">
                                                <Trophy className="w-3.5 h-3.5 mr-1.5" />
                                                Total Score: {team.score || 0}
                                            </span>
                                        </div>

                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Problem Statement</p>
                                            <p className="text-sm text-slate-700 font-medium leading-relaxed italic">"{team.problemStatement}"</p>
                                        </div>

                                        {/* Evaluation Checklist */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                                    <ClipboardList className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Evaluation Checklist
                                                </h5>
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                    {ROUND_CRITERIA[selectedRound].items.length} points
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {ROUND_CRITERIA[selectedRound].items.map((criterion, idx) => {
                                                    const criterionScore = edit?.criteriaScores?.[idx] || 0;
                                                    return (
                                                        <div key={idx} className="group relative bg-white border border-slate-100 p-3 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all">
                                                            <div className="flex items-start gap-2">
                                                                <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                                    {idx + 1}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-900 transition-colors uppercase tracking-tight">{criterion.title}</p>
                                                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight mb-2">{criterion.question}</p>

                                                                    <div className="relative">
                                                                        <select
                                                                            value={criterionScore}
                                                                            onChange={(e) => handleCriteriaScoreChange(team.id, idx, parseInt(e.target.value))}
                                                                            className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 focus:border-indigo-500 focus:bg-white outline-none cursor-pointer transition-all"
                                                                        >
                                                                            <option value="0">Select Score</option>
                                                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(s => (
                                                                                <option key={s} value={s}>{s} / 20</option>
                                                                            ))}
                                                                        </select>
                                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grading Section */}
                                    <div className="lg:w-[400px] space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                                                    <Trophy className="w-3 h-3 mr-1.5 text-amber-500" /> {rounds.find(r => r.id === selectedRound)?.label.split(':')[1].trim()} Score
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
                                                <MessageSquare className="w-3 h-3 mr-1.5 text-indigo-500" /> Round Feedback
                                            </label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                                                placeholder={`Feedback for ${rounds.find(r => r.id === selectedRound)?.label.split(':')[1].trim()}...`}
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
                                                    <span>{savedScore !== undefined ? 'Update Round Marks' : 'Submit Round Evaluation'}</span>
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
