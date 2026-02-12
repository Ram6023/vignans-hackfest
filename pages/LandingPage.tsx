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
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Modern Gradient Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-fuchsia-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Navigation */}
                <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 transition-all duration-300 ${isScrolled
                    ? 'backdrop-blur-md bg-[#0a0a0f]/60 border-b border-white/10 shadow-lg shadow-black/20'
                    : 'bg-transparent border-b border-transparent'
                    }`}>
                    <div className="max-w-7xl mx-auto flex items-center justify-end">
                        <div className="hidden md:flex items-center space-x-12">
                            <a href="#tracks" className="nav-link-wavy text-lg text-white/60 hover:text-white transition-colors">Tracks</a>
                            <a href="#perks" className="nav-link-wavy text-lg text-white/60 hover:text-white transition-colors">Perks</a>
                            <a href="#schedule" className="nav-link-wavy text-lg text-white/60 hover:text-white transition-colors">Schedule</a>
                        </div>
                    </div>
                </nav>

                {/* Hero Content - Split Layout */}
                <div className="relative z-10 max-w-7xl mx-auto px-8 pt-32">

                    {/* Main Header Row: Logo | Divider | Title | Login Button */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">

                        {/* Left Side - Logo + Title */}
                        <div className="animate-fade-in-up flex items-center gap-6 sm:gap-10">
                            {/* Logo on the left */}
                            <img
                                src="/vignan-logo.png"
                                alt="Vignan Logo"
                                className="h-24 md:h-36 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 duration-500"
                            />

                            {/* Vertical Divider Line */}
                            <div className="h-20 md:h-28 w-px bg-white/20"></div>

                            {/* Title - slightly to the right */}
                            <div className="flex flex-col text-left pl-2">
                                <h1 className="hackathon-title text-5xl md:text-7xl lg:text-8xl mb-0 leading-[1.1]">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-indigo-100">
                                        HACKIFY
                                    </span>
                                </h1>
                                <p className="hackathon-title text-4xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 -mt-2">
                                    2026
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Login Only */}
                        <div className="flex-shrink-0 animate-fade-in-left" style={{ animationDelay: '0.3s' }}>
                            <button
                                onClick={onGetStarted}
                                className="group relative inline-flex items-center justify-center gap-4 px-16 py-6 text-xl font-semibold rounded-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-purple-500/30"
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #4f46e5 100%)',
                                    boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.4)'
                                }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                </div>
                                <span className="relative z-10">Login</span>
                                <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Tagline - Centered below header */}
                    <p className="text-xl md:text-2xl text-white/40 font-medium tracking-wide text-center mb-12">
                        Build <span className="text-white/70">·</span> Innovate <span className="text-white/70">·</span> Transform
                    </p>

                    {/* Countdown - Bigger */}
                    <FadeInSection delay="200ms">
                        <div className="flex items-center justify-center gap-8 mb-16">
                            {[
                                { value: timeLeft.days, label: 'Days' },
                                { value: timeLeft.hours, label: 'Hours' },
                                { value: timeLeft.minutes, label: 'Min' },
                                { value: timeLeft.seconds, label: 'Sec' },
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-24 h-24 md:w-28 md:h-28 bg-white/5 backdrop-blur rounded-3xl flex items-center justify-center mb-3 border border-white/10 shadow-lg shadow-purple-900/10 transform transition-transform hover:scale-105">
                                        <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                                            {String(item.value).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-white/30 uppercase tracking-wider">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </FadeInSection>

                    {/* Stats - Bigger Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {stats.map((stat, index) => (
                            <FadeInSection key={index} delay={`${index * 100}ms`}>
                                <div className="group p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 transform transition-transform group-hover:scale-110 duration-300`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
                                    <p className="text-base text-white/40">{stat.label}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tracks Section */}
            <section id="tracks" className="py-24 px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-purple-950/10 to-[#0a0a0f]"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <FadeInSection>
                        <div className="text-center mb-14">
                            <span className="inline-block px-5 py-2 bg-purple-500/10 text-purple-400 text-base font-semibold rounded-full mb-5 border border-purple-500/20">TRACKS</span>
                            <h2 className="text-5xl md:text-6xl font-bold mb-5">Choose Your Path</h2>
                            <p className="text-xl text-white/40 max-w-2xl mx-auto">Pick a track that excites you. All submissions welcome.</p>
                        </div>
                    </FadeInSection>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tracks.map((track, index) => (
                            <FadeInSection key={index} delay={`${index * 100}ms`}>
                                <div
                                    className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 h-full"
                                >
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${track.color === 'purple' ? 'from-purple-500/20 to-indigo-500/20 text-purple-400' :
                                        track.color === 'violet' ? 'from-violet-500/20 to-fuchsia-500/20 text-violet-400' :
                                            track.color === 'indigo' ? 'from-indigo-500/20 to-blue-500/20 text-indigo-400' :
                                                'from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400'
                                        } mb-5 transform transition-transform group-hover:rotate-6`}>
                                        <track.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:to-purple-200 transition-colors">{track.title}</h3>
                                    <p className="text-base text-white/40 group-hover:text-white/60 transition-colors">{track.description}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Perks Section */}
            <section id="perks" className="py-24 px-8">
                <div className="max-w-6xl mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-14">
                            <span className="inline-block px-5 py-2 bg-indigo-500/10 text-indigo-400 text-base font-semibold rounded-full mb-5 border border-indigo-500/20">PERKS</span>
                            <h2 className="text-5xl md:text-6xl font-bold mb-5">What You Get</h2>
                            <p className="text-xl text-white/40">Everything you need for 24 hours of hacking</p>
                        </div>
                    </FadeInSection>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {perks.map((perk, index) => (
                            <FadeInSection key={index} delay={`${index * 100}ms`}>
                                <div
                                    className="text-center p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                                >
                                    <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-5 transform transition-transform hover:scale-110 duration-300">
                                        <perk.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{perk.title}</h3>
                                    <p className="text-base text-white/40">{perk.description}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-8 border-t border-white/[0.06] bg-[#0a0a0f]">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-base text-white/30 hover:text-white/50 transition-colors cursor-default">
                        © 2026 Vignan University · Built with passion
                    </p>
                </div>
            </footer>
        </div>
    );
};
