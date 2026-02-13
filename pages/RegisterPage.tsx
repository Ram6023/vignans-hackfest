import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/mockDb';
import { Team, ProblemStatement, Volunteer } from '../types';
import {
    Rocket, Users, Mail, User, Code2, FileText,
    Plus, X, ArrowRight, ArrowLeft, CheckCircle,
    Loader2, Sparkles, Zap, AlertCircle
} from 'lucide-react';

interface RegisterPageProps {
    onRegister: (team: Team) => void;
    onBack: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onBack }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    // Form state
    const [teamName, setTeamName] = useState('');
    const [email, setEmail] = useState('');
    const [members, setMembers] = useState<string[]>(['']);
    const [selectedProblem, setSelectedProblem] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState('');
    const [techStack, setTechStack] = useState<string[]>([]);
    const [techInput, setTechInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const ps = await dbService.getProblemStatements();
            const vols = await dbService.getVolunteers();
            setProblemStatements(ps);
            setVolunteers(vols.filter(v => v.isAvailable));
        };
        fetchData();
    }, []);

    const addMember = () => {
        if (members.length < 4) {
            setMembers([...members, '']);
        }
    };

    const removeMember = (index: number) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const updateMember = (index: number, value: string) => {
        const newMembers = [...members];
        newMembers[index] = value;
        setMembers(newMembers);
    };

    const addTech = () => {
        if (techInput.trim() && !techStack.includes(techInput.trim())) {
            setTechStack([...techStack, techInput.trim()]);
            setTechInput('');
        }
    };

    const removeTech = (tech: string) => {
        setTechStack(techStack.filter(t => t !== tech));
    };

    const validateStep1 = () => {
        if (!teamName.trim()) return 'Team name is required';
        if (!email.trim() || !email.includes('@')) return 'Valid email is required';
        const validMembers = members.filter(m => m.trim());
        if (validMembers.length < 1) return 'At least one team member is required';
        return null;
    };

    const validateStep2 = () => {
        if (!selectedProblem) return 'Please select a problem statement';
        return null;
    };

    const handleSubmit = async () => {
        setError('');
        setIsSubmitting(true);

        try {
            const db = dbService.getDb();
            const lowerTeamName = teamName.trim().toLowerCase();
            const lowerEmail = email.trim().toLowerCase();

            const nameExists = db.teams.some(t => t.name.toLowerCase() === lowerTeamName);
            const emailExists = db.teams.some(t => t.email.toLowerCase() === lowerEmail);

            if (nameExists) {
                setError('A team with this name already exists.');
                setIsSubmitting(false);
                return;
            }

            if (emailExists) {
                setError('This email is already registered to a team.');
                setIsSubmitting(false);
                return;
            }

            const validMembers = members.filter(m => m.trim());
            const selectedPS = problemStatements.find(p => p.id === selectedProblem);
            const randomVolunteer = volunteers[Math.floor(Math.random() * volunteers.length)];

            const newTeam: Team = {
                id: `team_${Date.now()}`,
                name: teamName.trim(),
                email: email.trim(),
                members: validMembers,
                problemStatement: selectedPS?.title || 'Open Innovation',
                projectDescription: projectDescription.trim(),
                roomNumber: `R-${Math.floor(Math.random() * 5) + 1}0${Math.floor(Math.random() * 9) + 1}`,
                tableNumber: `T-${Math.floor(Math.random() * 30) + 1}`,
                wifiSsid: 'Vignan-Guest',
                wifiPass: 'VHACK2K26!',
                assignedVolunteerId: randomVolunteer?.id || '',
                isCheckedIn: false,
                score: 0,
                skills: [],
                lookingForMembers: validMembers.length < 4,
                onboardingStatus: 'not_started',
            };

            await dbService.createTeam(newTeam);
            onRegister(newTeam);
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            const error = validateStep1();
            if (error) {
                setError(error);
                return;
            }
        } else if (step === 2) {
            const error = validateStep2();
            if (error) {
                setError(error);
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const prevStep = () => {
        setError('');
        setStep(step - 1);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-emerald-100 text-emerald-700';
            case 'intermediate': return 'bg-amber-100 text-amber-700';
            case 'advanced': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center text-center p-16 xl:p-20">
                    {/* Premium Logo & Branding Section - Centered */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-16 flex flex-col items-center"
                    >
                        <h1 className="text-6xl xl:text-[9.5rem] font-black tracking-tighter flex flex-col items-center group cursor-default mb-6 relative">
                            <motion.span
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="bg-gradient-to-r from-white via-violet-100 to-indigo-100 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_80px_rgba(139,92,246,0.6)] transition-all duration-1000 uppercase block"
                            >
                                VHACK
                            </motion.span>
                            <div className="flex items-center gap-8 -mt-6">
                                <motion.span
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
                                    className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-extrabold"
                                >
                                    2.0
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
                                    className="text-4xl xl:text-6xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent font-black tracking-[0.2em]"
                                >
                                    2K26
                                </motion.span>
                            </div>
                        </h1>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-2"></div>
                            <motion.img
                                whileHover={{ scale: 1.15, rotate: 2 }}
                                src="/vignan-logo.png"
                                alt="Vignan Logo"
                                className="h-16 opacity-90 hover:opacity-100 transition-all duration-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">Vignan University</span>
                        </motion.div>
                    </motion.div>

                    <h1 className="text-5xl xl:text-6xl font-black tracking-tight text-white mb-6 leading-[1.1]">
                        <span className="block">Build.</span>
                        <span className="block">Innovate.</span>
                        <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Win Big.
                        </span>
                    </h1>

                    <p className="text-lg xl:text-xl text-slate-400 max-w-md mb-12 leading-relaxed font-medium">
                        Register your team to participate in the hackathon. Choose your challenge, build your solution, and compete for amazing prizes!
                    </p>

                    {/* Progress Steps */}
                    <div className="flex items-center space-x-4 w-full max-w-md">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex-1">
                                <div className={`h-2 rounded-full transition-all duration-500 ${step >= s
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : 'bg-white/10'
                                    }`}></div>
                                <p className={`text-xs mt-2 font-medium ${step >= s ? 'text-emerald-400' : 'text-slate-600'}`}>
                                    {s === 1 ? 'Team Info' : s === 2 ? 'Problem' : 'Details'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-y-auto">
                <div className="relative w-full max-w-lg">
                    {/* Back button */}
                    <button
                        onClick={onBack}
                        className="mb-6 flex items-center text-slate-500 hover:text-violet-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </button>

                    {/* Mobile progress */}
                    <div className="flex items-center space-x-2 mb-8 lg:hidden">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-200'
                                }`}></div>
                        ))}
                    </div>

                    {/* Step 1: Team Info */}
                    {step === 1 && (
                        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                                    Team Information
                                </h2>
                                <p className="text-slate-500 font-medium">
                                    Tell us about your team
                                </p>
                            </div>

                            {/* Team Name */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Team Name *</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                        placeholder="Enter your team name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Team Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                        placeholder="team@example.com"
                                    />
                                </div>
                            </div>

                            {/* Team Members */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Team Members * <span className="text-slate-400 font-normal">(2-4 members)</span>
                                </label>
                                <div className="space-y-3">
                                    {members.map((member, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="relative flex-1">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={member}
                                                    onChange={(e) => updateMember(index, e.target.value)}
                                                    className="block w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                                    placeholder={`Member ${index + 1} name`}
                                                />
                                            </div>
                                            {members.length > 1 && (
                                                <button
                                                    onClick={() => removeMember(index)}
                                                    className="p-3 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {members.length < 4 && (
                                    <button
                                        onClick={addMember}
                                        className="mt-3 flex items-center text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Member
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Problem Statement */}
                    {step === 2 && (
                        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                                    Choose Your Challenge
                                </h2>
                                <p className="text-slate-500 font-medium">
                                    Select a problem statement to work on
                                </p>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {problemStatements.map((ps) => (
                                    <div
                                        key={ps.id}
                                        onClick={() => setSelectedProblem(ps.id)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedProblem === ps.id
                                            ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className={`font-bold ${selectedProblem === ps.id ? 'text-emerald-900' : 'text-slate-900'}`}>
                                                {ps.title}
                                            </h3>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-lg ${getDifficultyColor(ps.difficulty)}`}>
                                                    {ps.difficulty}
                                                </span>
                                                {selectedProblem === ps.id && (
                                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{ps.description}</p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">{ps.category}</span>
                                            {ps.sponsor && (
                                                <span className="text-violet-600 font-semibold flex items-center">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    Sponsored by {ps.sponsor}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Project Details */}
                    {step === 3 && (
                        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                                    Project Details
                                </h2>
                                <p className="text-slate-500 font-medium">
                                    Tell us about your planned solution (optional)
                                </p>
                            </div>

                            {/* Project Description */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Project Description
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                    <textarea
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                        rows={4}
                                        className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                                        placeholder="Briefly describe your project idea..."
                                    />
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Tech Stack
                                </label>
                                <div className="relative">
                                    <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                                        className="block w-full pl-12 pr-24 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                        placeholder="e.g., React, Python, TensorFlow"
                                    />
                                    <button
                                        onClick={addTech}
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-200 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                {techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                                            >
                                                {tech}
                                                <button onClick={() => removeTech(tech)} className="ml-2 text-slate-400 hover:text-rose-600">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                                <h4 className="font-bold text-emerald-900 mb-3 flex items-center">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Registration Summary
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-slate-600">Team:</span> <span className="text-slate-900">{teamName}</span></p>
                                    <p><span className="font-medium text-slate-600">Members:</span> <span className="text-slate-900">{members.filter(m => m.trim()).join(', ')}</span></p>
                                    <p><span className="font-medium text-slate-600">Challenge:</span> <span className="text-slate-900">{problemStatements.find(p => p.id === selectedProblem)?.title}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center p-4 rounded-2xl bg-rose-50 border border-rose-100 mt-6">
                            <div className="flex-shrink-0 p-1 bg-rose-100 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-rose-600" />
                            </div>
                            <p className="ml-3 text-sm font-semibold text-rose-700">{error}</p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8">
                        {step > 1 ? (
                            <button
                                onClick={prevStep}
                                className="flex items-center px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={nextStep}
                                className="btn-slide-in-primary"
                            >
                                <span>Continue</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="btn-slide-in-primary bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5" />
                                        <span>Register Team</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
