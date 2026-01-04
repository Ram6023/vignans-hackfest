import React, { useEffect, useState } from 'react';
import { ScheduleEvent } from '../types';
import { dbService } from '../services/mockDb';
import {
    Calendar, Clock, MapPin, User,
    Utensils, Wrench, Trophy, Users,
    Flag, Coffee, CheckCircle, Circle,
    ChevronRight
} from 'lucide-react';

interface ScheduleProps {
    compact?: boolean;
}

export const Schedule: React.FC<ScheduleProps> = ({ compact = false }) => {
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchSchedule = async () => {
            const data = await dbService.getSchedule();
            setEvents(data);
            setLoading(false);
        };
        fetchSchedule();

        // Update current time every minute
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getEventIcon = (type: ScheduleEvent['type']) => {
        switch (type) {
            case 'ceremony': return Flag;
            case 'workshop': return Wrench;
            case 'meal': return Utensils;
            case 'judging': return Trophy;
            case 'networking': return Users;
            case 'deadline': return Clock;
            case 'break': return Coffee;
            default: return Calendar;
        }
    };

    const getEventColor = (type: ScheduleEvent['type']) => {
        switch (type) {
            case 'ceremony': return { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' };
            case 'workshop': return { bg: 'from-blue-500 to-cyan-600', light: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
            case 'meal': return { bg: 'from-amber-500 to-orange-600', light: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
            case 'judging': return { bg: 'from-rose-500 to-pink-600', light: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' };
            case 'networking': return { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
            case 'deadline': return { bg: 'from-red-500 to-rose-600', light: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
            case 'break': return { bg: 'from-slate-400 to-slate-500', light: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
            default: return { bg: 'from-slate-500 to-slate-600', light: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
        }
    };

    const isEventActive = (event: ScheduleEvent) => {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);
        return currentTime >= start && currentTime <= end;
    };

    const isEventPast = (event: ScheduleEvent) => {
        return new Date(event.endTime) < currentTime;
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Group events by date
    const groupedEvents = events.reduce((groups, event) => {
        const date = formatDate(event.startTime);
        if (!groups[date]) groups[date] = [];
        groups[date].push(event);
        return groups;
    }, {} as Record<string, ScheduleEvent[]>);

    if (loading) {
        return (
            <div className="glass-card rounded-3xl p-8 flex items-center justify-center min-h-[300px]">
                <div className="animate-pulse flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-violet-500" />
                    <span className="text-slate-500 font-medium">Loading schedule...</span>
                </div>
            </div>
        );
    }

    if (compact) {
        // Compact view - only show upcoming events
        const upcomingEvents = events.filter(e => !isEventPast(e)).slice(0, 4);

        return (
            <div className="glass-card rounded-3xl overflow-hidden border border-white/60 h-full">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 flex items-center">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white mr-3 shadow-lg shadow-violet-200">
                            <Calendar className="w-4 h-4" />
                        </div>
                        Upcoming Events
                    </h3>
                </div>
                <div className="p-4 space-y-3">
                    {upcomingEvents.map((event) => {
                        const Icon = getEventIcon(event.type);
                        const colors = getEventColor(event.type);
                        const isActive = isEventActive(event);

                        return (
                            <div
                                key={event.id}
                                className={`group flex items-center p-3 rounded-xl transition-all duration-300 ${isActive
                                        ? `${colors.light} ${colors.border} border-2 shadow-md`
                                        : 'bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bg} text-white mr-3 shadow-sm`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm truncate ${isActive ? colors.text : 'text-slate-900'}`}>
                                        {event.title}
                                    </p>
                                    <p className="text-xs text-slate-500 flex items-center mt-0.5">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatTime(event.startTime)}
                                        {event.location && (
                                            <>
                                                <span className="mx-1.5">•</span>
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {event.location}
                                            </>
                                        )}
                                    </p>
                                </div>
                                {isActive && (
                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/80 rounded-lg text-emerald-600 animate-pulse">
                                        Now
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Full view
    return (
        <div className="glass-card rounded-3xl overflow-hidden border border-white/60">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 sm:px-8 py-6 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl blur-md opacity-50"></div>
                        <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Event Schedule</h3>
                        <p className="text-sm text-slate-500">Track all hackathon events and workshops</p>
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                    <div key={date} className="mb-8 last:mb-0">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {date}
                        </h4>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-200 via-slate-200 to-slate-100"></div>

                            <div className="space-y-4">
                                {dateEvents.map((event, index) => {
                                    const Icon = getEventIcon(event.type);
                                    const colors = getEventColor(event.type);
                                    const isActive = isEventActive(event);
                                    const isPast = isEventPast(event);

                                    return (
                                        <div
                                            key={event.id}
                                            className={`relative flex items-start group ${isPast ? 'opacity-60' : ''}`}
                                        >
                                            {/* Timeline dot */}
                                            <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${isActive
                                                    ? `bg-gradient-to-br ${colors.bg} ring-4 ring-white shadow-xl scale-110`
                                                    : isPast
                                                        ? 'bg-slate-200 text-slate-500'
                                                        : `bg-gradient-to-br ${colors.bg} group-hover:scale-105`
                                                }`}>
                                                {isPast ? (
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                ) : (
                                                    <Icon className="w-5 h-5 text-white" />
                                                )}
                                            </div>

                                            {/* Event card */}
                                            <div className={`ml-4 flex-1 p-5 rounded-2xl transition-all duration-300 ${isActive
                                                    ? `${colors.light} ${colors.border} border-2 shadow-lg`
                                                    : 'bg-white border border-slate-100 group-hover:shadow-md group-hover:border-slate-200'
                                                }`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h5 className={`font-bold text-lg ${isActive ? colors.text : 'text-slate-900'}`}>
                                                            {event.title}
                                                        </h5>
                                                        {isActive && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-white/80 text-emerald-600 mt-1">
                                                                <Circle className="w-2 h-2 mr-1 fill-emerald-500 text-emerald-500 animate-pulse" />
                                                                Happening Now
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${colors.light} ${colors.text}`}>
                                                        {event.type}
                                                    </span>
                                                </div>

                                                {event.description && (
                                                    <p className="text-slate-600 text-sm mb-3">{event.description}</p>
                                                )}

                                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                                    <span className="flex items-center text-slate-500">
                                                        <Clock className="w-4 h-4 mr-1.5" />
                                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                    </span>
                                                    {event.location && (
                                                        <span className="flex items-center text-slate-500">
                                                            <MapPin className="w-4 h-4 mr-1.5" />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                    {event.speaker && (
                                                        <span className="flex items-center text-slate-500">
                                                            <User className="w-4 h-4 mr-1.5" />
                                                            {event.speaker}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
