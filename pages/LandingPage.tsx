import React, { useState, useEffect } from 'react';
import {
    Rocket, Calendar, Users, Trophy, Code2, Zap,
    ArrowRight, Clock, MapPin, Star, Gift, Sparkles,
    ChevronRight, Play, Award, Target, Lightbulb,
    Timer, Coffee, Wifi, CheckCircle
} from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Countdown to hackathon start (set to upcoming date)
    useEffect(() => {
        const hackathonDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 days from now

        const timer = setInterval(() => {
            const now = new Date();
            const diff = hackathonDate.getTime() - now.getTime();

            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const stats = [
        { icon: Users, value: '50+', label: 'Teams Competing', color: 'from-violet-500 to-purple-600' },
        { icon: Trophy, value: '₹1L+', label: 'Prize Pool', color: 'from-amber-500 to-orange-600' },
        { icon: Clock, value: '24h', label: 'Hackathon', color: 'from-blue-500 to-cyan-600' },
        { icon: Star, value: '20+', label: 'Mentors', color: 'from-emerald-500 to-teal-600' },
    ];

    const tracks = [
        { icon: Lightbulb, title: 'AI/ML', description: 'Build intelligent solutions using AI and Machine Learning', color: 'violet' },
        { icon: Target, title: 'Sustainability', description: 'Create eco-friendly tech for a greener future', color: 'emerald' },
        { icon: Code2, title: 'Web3', description: 'Explore blockchain and decentralized applications', color: 'blue' },
        { icon: Zap, title: 'Open Innovation', description: 'Solve any problem with your creative solution', color: 'amber' },
    ];

    const timeline = [
        { time: '9:00 AM', event: 'Opening Ceremony & Keynote', icon: Rocket },
        { time: '10:00 AM', event: 'Hacking Begins!', icon: Code2 },
        { time: '1:00 PM', event: 'Lunch & Networking', icon: Coffee },
        { time: '3:00 PM', event: 'Workshop: AI APIs', icon: Lightbulb },
        { time: '10:00 AM', event: 'Submissions Due', icon: CheckCircle },
        { time: '12:00 PM', event: 'Judging & Awards', icon: Award },
    ];

    const sponsors = [
        'Google Cloud', 'Microsoft', 'AWS', 'GitHub', 'Notion'
    ];

    const perks = [
        { icon: Wifi, title: 'High-Speed WiFi', description: 'Blazing fast internet for all participants' },
        { icon: Coffee, title: 'Unlimited Food', description: 'Meals, snacks, and beverages throughout' },
        { icon: Gift, title: 'Swag Kits', description: 'Exclusive goodies for all hackers' },
        { icon: Award, title: 'Certificates', description: 'Participation certificates for everyone' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-violet-600/20 blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-[-30%] right-[-20%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '80px 80px'
                    }}></div>
                </div>

                {/* Navigation */}
                <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                                <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 rounded-xl">
                                    <Rocket className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <span className="text-xl font-bold tracking-tight">Vignan's Hackfest</span>
                                <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-violet-500/20 text-violet-300 rounded-full">2025</span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#about" className="text-slate-400 hover:text-white transition-colors font-medium">About</a>
                            <a href="#tracks" className="text-slate-400 hover:text-white transition-colors font-medium">Tracks</a>
                            <a href="#schedule" className="text-slate-400 hover:text-white transition-colors font-medium">Schedule</a>
                            <a href="#sponsors" className="text-slate-400 hover:text-white transition-colors font-medium">Sponsors</a>
                        </div>

                        <button
                            onClick={onGetStarted}
                            className="btn-slide-in-primary text-sm py-2.5 px-5"
                        >
                            <span>Login</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-sm font-semibold text-slate-300">Registration Open • January 2025</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 leading-[0.9]">
                        <span className="block text-white">Build.</span>
                        <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Innovate.
                        </span>
                        <span className="block text-white">Transform.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Join 50+ teams in the ultimate 24-hour coding challenge. Solve real-world problems, learn from mentors, and compete for amazing prizes.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button
                            onClick={onGetStarted}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                            <Rocket className="w-5 h-5 mr-2" />
                            <span>Join the Hackathon</span>
                            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group">
                            <Play className="w-5 h-5 mr-2" />
                            <span>Watch Recap</span>
                        </button>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center justify-center gap-4 mb-16">
                        {[
                            { value: timeLeft.days, label: 'Days' },
                            { value: timeLeft.hours, label: 'Hours' },
                            { value: timeLeft.minutes, label: 'Minutes' },
                            { value: timeLeft.seconds, label: 'Seconds' },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center mb-2">
                                    <span className="text-3xl md:text-4xl font-black text-white tabular-nums">
                                        {String(item.value).padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3 shadow-lg`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                    <span className="text-xs text-slate-500 mb-2 font-medium">Scroll to explore</span>
                    <div className="w-6 h-10 rounded-full border-2 border-slate-700 flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-slate-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Tracks Section */}
            <section id="tracks" className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-violet-500/10 text-violet-400 text-sm font-bold rounded-full mb-4">COMPETITION TRACKS</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Choose Your Challenge</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">Pick a track that matches your passion and skills. All tracks welcome innovative solutions.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tracks.map((track, index) => (
                            <div key={index} className="group relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 hover:border-violet-500/50 transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${track.color === 'violet' ? 'from-violet-500 to-purple-600' :
                                        track.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                                            track.color === 'blue' ? 'from-blue-500 to-cyan-600' :
                                                'from-amber-500 to-orange-600'
                                    } mb-6 shadow-xl relative`}>
                                    <track.icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{track.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{track.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Perks Section */}
            <section className="py-24 px-6 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-bold rounded-full mb-4">PARTICIPANT PERKS</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">What You Get</h2>
                        <p className="text-xl text-slate-400">Everything you need to hack through the night</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {perks.map((perk, index) => (
                            <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center hover:border-emerald-500/50 transition-all hover:-translate-y-1">
                                <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                                    <perk.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
                                <p className="text-sm text-slate-400">{perk.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-slate-950 to-blue-900/50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[150px]"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-8 shadow-2xl shadow-violet-500/30">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        Ready to Build Something
                        <span className="block bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Amazing?</span>
                    </h2>

                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                        Join hundreds of developers, designers, and innovators. Form your team, choose your challenge, and start building.
                    </p>

                    <button
                        onClick={onGetStarted}
                        className="group inline-flex items-center justify-center px-10 py-5 text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 transition-all duration-300"
                    >
                        <Rocket className="w-6 h-6 mr-3" />
                        <span>Join Now — It's Free</span>
                        <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="mt-6 text-sm text-slate-500">No payment required • Open to all students</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2 rounded-xl">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white">Vignan's Hackfest 2025</span>
                    </div>

                    <p className="text-slate-500 text-sm">
                        © 2025 Vignan University. Built with 💜 for innovators.
                    </p>

                    <div className="flex items-center space-x-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
