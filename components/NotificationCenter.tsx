import React, { useState, useEffect, useRef } from 'react';
import { useRealtimeNotifications, Notification } from '../hooks/useRealtime';
import {
    Bell, X, Check, CheckCheck, Trash2,
    Info, CheckCircle, AlertTriangle, XCircle,
    ChevronDown
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications
    } = useRealtimeNotifications();

    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState<Notification | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const prevUnreadCount = useRef(unreadCount);

    // Show toast for new notifications
    useEffect(() => {
        if (unreadCount > prevUnreadCount.current && notifications.length > 0) {
            const latestNotification = notifications[0];
            setShowToast(latestNotification);
            setTimeout(() => setShowToast(null), 4000);
        }
        prevUnreadCount.current = unreadCount;
    }, [unreadCount, notifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return CheckCircle;
            case 'info': return Info;
            case 'warning': return AlertTriangle;
            case 'error': return XCircle;
        }
    };

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'success': return { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' };
            case 'info': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
            case 'warning': return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
            case 'error': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-20 right-4 z-[100] animate-[slideIn_0.3s_ease-out]">
                    <div className={`flex items-start p-4 rounded-2xl shadow-2xl bg-white border-2 ${getNotificationColor(showToast.type).border} max-w-sm`}>
                        <div className={`p-2 rounded-xl ${getNotificationColor(showToast.type).bg} mr-3`}>
                            {React.createElement(getNotificationIcon(showToast.type), {
                                className: `w-5 h-5 ${getNotificationColor(showToast.type).text}`
                            })}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm">{showToast.title}</p>
                            <p className="text-slate-600 text-sm mt-0.5 line-clamp-2">{showToast.message}</p>
                        </div>
                        <button
                            onClick={() => setShowToast(null)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Notification Bell & Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-2.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-md group"
                >
                    <Bell className="w-5 h-5 text-slate-600 group-hover:text-violet-600 transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-[scaleIn_0.2s_ease-out]">
                        {/* Header */}
                        <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">Notifications</h3>
                                    <p className="text-xs text-slate-500">{unreadCount} unread</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-violet-600 transition-colors"
                                            title="Mark all as read"
                                        >
                                            <CheckCheck className="w-4 h-4" />
                                        </button>
                                    )}
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={clearNotifications}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition-colors"
                                            title="Clear all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[50vh] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="inline-flex p-4 rounded-full bg-slate-100 mb-3">
                                        <Bell className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-600 font-medium">No notifications yet</p>
                                    <p className="text-slate-400 text-sm mt-1">We'll notify you when something happens</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map((notification) => {
                                        const Icon = getNotificationIcon(notification.type);
                                        const colors = getNotificationColor(notification.type);

                                        return (
                                            <div
                                                key={notification.id}
                                                onClick={() => markAsRead(notification.id)}
                                                className={`flex items-start p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.read ? 'bg-violet-50/50' : ''
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-xl ${colors.bg} mr-3 flex-shrink-0`}>
                                                    <Icon className={`w-4 h-4 ${colors.text}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <p className={`text-sm ${notification.read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                                                            {notification.title}
                                                        </p>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5 ml-2"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{formatTime(notification.timestamp)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
