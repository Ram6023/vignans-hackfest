import React, { useState, useEffect, useRef } from 'react';
import {
    Users, Trophy, Code2, Zap,
    ArrowRight, Clock, Star, Gift,
    Award, Target, Lightbulb,
    Coffee, Wifi
} from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

// Hook for scroll animation
const useOnScreen = (options: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Only animate once
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [options]);

    return [ref, isVisible] as const;
};

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: string }> = ({ children, delay = '0ms' }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            style={{ transitionDelay: delay }}
        >
            {children}
        </div>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll position for header transparency
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Countdown to hackathon start (Updated to 2026)
    useEffect(() => {
        const hackathonDate = new Date('2026-02-26T09:00:00'); // Set to Feb 26, 2026

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
        { icon: Users, value: '50+', label: 'Teams', color: 'from-purple-500 to-indigo-600' },
        { icon: Trophy, value: '₹1L+', label: 'Prizes', color: 'from-fuchsia-500 to-purple-600' },
        { icon: Clock, value: '24h', label: 'Duration', color: 'from-violet-500 to-purple-500' },
        { icon: Star, value: '20+', label: 'Mentors', color: 'from-indigo-400 to-purple-500' },
    ];

    const tracks = [
        { icon: Lightbulb, title: 'AI/ML', description: 'Build intelligent solutions with AI', color: 'purple' },
        { icon: Target, title: 'Sustainability', description: 'Tech for a greener future', color: 'violet' },
        { icon: Code2, title: 'Web3', description: 'Decentralized applications', color: 'indigo' },
        { icon: Zap, title: 'Open Innovation', description: 'Solve any problem creatively', color: 'fuchsia' },
    ];

    const perks = [
        { icon: Wifi, title: 'High-Speed WiFi', description: 'Blazing fast internet' },
        { icon: Coffee, title: 'Unlimited Food', description: 'Meals & snacks included' },
        { icon: Gift, title: 'Swag Kits', description: 'Exclusive goodies' },
        { icon: Award, title: 'Certificates', description: 'For all participants' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
            {/* Modern Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 transition-all duration-500 ${isScrolled
                ? 'backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/10 shadow-2xl shadow-black/50'
                : 'bg-transparent border-b border-transparent'
                }`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Compact Logo on Left */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tighter uppercase leading-none">VHACK <span className="text-violet-400">2.0</span></span>
                            <span className="text-[8px] font-bold text-slate-500 tracking-[0.3em] uppercase">2K26</span>
                        </div>
                    </div>

                    {/* Nav Links + Login */}
                    <div className="flex items-center gap-6 md:gap-12">
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#tracks" className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Tracks</a>
                            <a href="#perks" className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Perks</a>
                            <a href="#schedule" className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Schedule</a>
                        </div>

                        <button
                            onClick={onGetStarted}
                            className="relative group px-8 py-3 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 transition-all duration-500 group-hover:hue-rotate-15"></div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)] blur-2xl scale-150 border-white/20 border"></div>
                            <div className="relative flex items-center gap-2">
                                <span className="text-sm font-black uppercase tracking-widest">Login</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-8">
                {/* Modern Gradient Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-fuchsia-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
                    {/* VHACK 2.0 Branding */}
                    <div className="flex flex-col items-center justify-center text-center">
                        {/* VHACK 2.0 — Single Line */}
                        <h1 className="flex items-baseline gap-4 md:gap-8 group cursor-default">
                            <span className="text-[14vw] md:text-[10rem] lg:text-[14rem] font-black tracking-tighter leading-none uppercase bg-gradient-to-r from-white via-violet-100 to-indigo-100 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_80px_rgba(139,92,246,0.6)] transition-all duration-1000">
                                VHACK
                            </span>
                            <span className="text-[8vw] md:text-[5rem] lg:text-[7rem] font-black bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                2.0
                            </span>
                        </h1>

                        {/* 2K26 — Below */}
                        <span className="text-[6vw] md:text-[4rem] lg:text-[5rem] font-black tracking-[0.3em] bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mt-2">
                            2K26
                        </span>

                        {/* Logos Row */}
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <span className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.4em]">In Association With</span>
                            <div className="h-px w-64 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                            <div className="flex items-center gap-6 md:gap-10">
                                <img
                                    src="/vignan-logo.png"
                                    alt="Vignan Logo"
                                    className="h-16 md:h-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] brightness-125 hover:scale-110 transition-transform duration-500"
                                />
                                <div className="w-px h-10 bg-white/15"></div>
                                <div className="h-16 md:h-24 w-32 md:w-48 rounded-lg overflow-hidden flex items-center justify-center hover:scale-110 transition-transform duration-500">
                                    <img
                                        src="/nexus-logo.jpeg"
                                        alt="Nexus Logo"
                                        className="w-full h-full object-cover scale-150 mix-blend-screen"
                                    />
                                </div>
                                <div className="w-px h-10 bg-white/15"></div>
                                <img
                                    src="/aidx-logo.jpeg"
                                    alt="AID-X Logo"
                                    className="h-16 md:h-24 rounded-lg mix-blend-screen hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>

                    <FadeInSection delay="300ms">
                        <p className="text-xl md:text-2xl text-white/30 font-medium tracking-widest text-center mt-12 max-w-2xl uppercase">
                            Innovate <span className="text-white/60">·</span> Build <span className="text-white/60">·</span> Transform
                        </p>
                    </FadeInSection>

                    {/* Countdown */}
                    <FadeInSection delay="500ms">
                        <div className="flex items-center justify-center gap-4 md:gap-8 mt-16">
                            {[
                                { value: timeLeft.days, label: 'Days' },
                                { value: timeLeft.hours, label: 'Hours' },
                                { value: timeLeft.minutes, label: 'Min' },
                                { value: timeLeft.seconds, label: 'Sec' },
                            ].map((item, index) => (
                                <div key={index} className="text-center group">
                                    <div className="w-20 h-20 md:w-32 md:h-32 bg-white/5 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center justify-center mb-4 border border-white/10 shadow-2xl transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:-translate-y-2">
                                        <span className="text-3xl md:text-6xl font-black text-white tabular-nums leading-none">
                                            {String(item.value).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-white/40 transition-colors">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* Stats Summary Section */}
            <section className="py-24 px-8 border-t border-white/5 bg-[#0a0a0f]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <FadeInSection key={index} delay={`${index * 100}ms`}>
                                <div className="group relative p-10 rounded-[3rem] bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all duration-500 overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity`}></div>
                                    <div className={`inline-flex p-5 rounded-[1.5rem] bg-gradient-to-br ${stat.color} mb-6 transform transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-xl shadow-purple-900/40`}>
                                        <stat.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-5xl font-black text-white mb-2 leading-none">{stat.value}</h3>
                                    <p className="text-sm font-bold text-white/20 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tracks Section */}
            <section id="tracks" className="py-32 px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <FadeInSection>
                        <div className="text-center mb-24">
                            <span className="inline-block px-8 py-3 bg-purple-500/10 text-purple-400 text-xs font-black rounded-full mb-6 border border-purple-500/20 tracking-[0.5em] uppercase">The Challenges</span>
                            <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">Choose Your Track</h2>
                            <p className="text-xl text-white/30 max-w-2xl mx-auto font-medium">Push the boundaries of what's possible in these core focus areas.</p>
                        </div>
                    </FadeInSection>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {tracks.map((track, index) => (
                            <FadeInSection key={index} delay={`${index * 150}ms`}>
                                <div className="group h-full p-10 rounded-[3.5rem] bg-[#0d0d14] border border-white/[0.05] hover:border-purple-500/40 transition-all duration-700 hover:shadow-[0_0_80px_rgba(139,92,246,0.15)] hover:-translate-y-4">
                                    <div className={`inline-flex p-6 rounded-[2rem] bg-white/[0.03] text-white/40 mb-8 transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:text-purple-400 group-hover:bg-purple-500/20`}>
                                        <track.icon className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-100 transition-colors uppercase tracking-tighter">{track.title}</h3>
                                    <p className="text-lg text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">{track.description}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Perks Section */}
            <section id="perks" className="py-32 px-8 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-20">
                            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Event Perks</h2>
                            <p className="text-xl text-white/30 font-medium tracking-widest uppercase">Fueled for 24 Hours</p>
                        </div>
                    </FadeInSection>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {perks.map((perk, index) => (
                            <FadeInSection key={index} delay={`${index * 100}ms`}>
                                <div className="text-center p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500 group">
                                    <div className="inline-flex p-6 rounded-[2rem] bg-indigo-500/10 text-indigo-400 mb-6 transform transition-all duration-500 group-hover:scale-125 group-hover:-rotate-6">
                                        <perk.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{perk.title}</h3>
                                    <p className="text-base text-white/30 font-medium">{perk.description}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-8 border-t border-white/5 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <img src="/vignan-logo.png" alt="Vignan Logo" className="h-10 grayscale opacity-40" />
                        <span className="text-sm font-black text-white/20 uppercase tracking-[1em]">VHACK 2.0</span>
                    </div>
                    <p className="text-sm font-bold text-white/20 uppercase tracking-widest">
                        © 2026 Vignan University · Built for innovators
                    </p>
                </div>
            </footer>
        </div>
    );
};
