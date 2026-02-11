import React, { useState, useEffect } from 'react';
import { Announcement } from '../types';
import { Megaphone, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PriorityBannerProps {
    announcements: Announcement[];
}

export const PriorityBanner: React.FC<PriorityBannerProps> = ({ announcements }) => {
    const [visibleAnn, setVisibleAnn] = useState<Announcement | null>(null);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    useEffect(() => {
        // Find the most recent sticky or urgent announcement that isn't dismissed
        const sticky = announcements.find(a =>
            (a.isSticky || a.priority === 'urgent') && !dismissedIds.includes(a.id)
        );
        setVisibleAnn(sticky || null);
    }, [announcements, dismissedIds]);

    const handleDismiss = () => {
        if (visibleAnn) {
            setDismissedIds(prev => [...prev, visibleAnn.id]);
        }
    };

    if (!visibleAnn) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative z-[60] bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-white overflow-hidden shadow-lg"
            >
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 -translate-x-full animate-[shimmer_3s_infinite]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative z-10">
                    <div className="flex items-center flex-1 mr-4">
                        <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg mr-3 backdrop-blur-sm">
                            <Megaphone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="flex items-center px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-wider mr-3 mb-1 sm:mb-0">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Priority Update
                            </span>
                            <p className="text-sm font-semibold leading-tight mb-0.5 sm:mb-0">
                                {visibleAnn.message}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// Add shimmer keyframes to your global CSS if not present
// @keyframes shimmer {
//   100% { transform: translateX(100%); }
// }
