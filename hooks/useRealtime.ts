// Custom React hooks for real-time functionality

import { useEffect, useState, useCallback, useRef } from 'react';
import { wsService, WebSocketEvent, WebSocketEventType } from '../services/websocket';
import { Team, Announcement, Volunteer } from '../types';
import { dbService } from '../services/mockDb';

// Hook for listening to WebSocket events
export function useWebSocket(eventTypes: WebSocketEventType[], callback: (event: WebSocketEvent) => void) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        const unsubscribes = eventTypes.map(type =>
            wsService.on(type, (event) => callbackRef.current(event))
        );

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [eventTypes.join(',')]);
}

// Hook for real-time teams data
export function useRealtimeTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTeams = useCallback(async () => {
        const data = await dbService.getAllTeams();
        setTeams(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    useWebSocket(['TEAM_CREATED', 'TEAM_UPDATED', 'TEAM_CHECKED_IN', 'TEAM_SUBMITTED', 'SCORE_UPDATED'], (event) => {
        if (event.type === 'TEAM_CREATED') {
            setTeams(prev => [...prev, event.payload as Team]);
        } else {
            setTeams(prev => prev.map(t =>
                t.id === (event.payload as Team).id ? event.payload as Team : t
            ));
        }
    });

    return { teams, loading, refetch: fetchTeams };
}

// Hook for real-time announcements
export function useRealtimeAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = useCallback(async () => {
        const data = await dbService.getAnnouncements();
        setAnnouncements(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    useWebSocket(['ANNOUNCEMENT_POSTED'], (event) => {
        setAnnouncements(prev => [event.payload as Announcement, ...prev]);
    });

    return { announcements, loading, refetch: fetchAnnouncements };
}

// Hook for real-time notifications
export interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export function useRealtimeNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
        return newNotification;
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Listen for WebSocket events and create notifications
    useWebSocket(['TEAM_CREATED', 'TEAM_CHECKED_IN', 'TEAM_SUBMITTED', 'ANNOUNCEMENT_POSTED', 'SCORE_UPDATED'], (event) => {
        switch (event.type) {
            case 'TEAM_CREATED':
                addNotification({
                    type: 'info',
                    title: 'New Team Registered',
                    message: `${(event.payload as Team).name} has joined the hackathon!`
                });
                break;
            case 'TEAM_CHECKED_IN':
                addNotification({
                    type: 'success',
                    title: 'Team Checked In',
                    message: `${(event.payload as Team).name} has checked in successfully.`
                });
                break;
            case 'TEAM_SUBMITTED':
                addNotification({
                    type: 'success',
                    title: 'Project Submitted',
                    message: `${(event.payload as Team).name} submitted their project!`
                });
                break;
            case 'ANNOUNCEMENT_POSTED':
                addNotification({
                    type: 'warning',
                    title: 'New Announcement',
                    message: (event.payload as Announcement).message.substring(0, 100)
                });
                break;
            case 'SCORE_UPDATED':
                addNotification({
                    type: 'info',
                    title: 'Score Updated',
                    message: `${(event.payload as Team).name}'s score has been updated to ${(event.payload as Team).score}`
                });
                break;
        }
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
    };
}

// Hook for real-time connection status
export function useConnectionStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const [lastPing, setLastPing] = useState<Date | null>(null);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Ping every 30 seconds
        const pingInterval = setInterval(() => {
            setLastPing(new Date());
        }, 30000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(pingInterval);
        };
    }, []);

    return { isOnline, lastPing };
}
