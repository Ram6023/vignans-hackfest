// WebSocket Service - Simulates real-time communication using BroadcastChannel
// In production, this would connect to a real WebSocket server

import { Team, Announcement, Volunteer } from '../types';

export type WebSocketEventType =
    | 'TEAM_CREATED'
    | 'TEAM_UPDATED'
    | 'TEAM_CHECKED_IN'
    | 'TEAM_SUBMITTED'
    | 'ANNOUNCEMENT_POSTED'
    | 'VOLUNTEER_ASSIGNED'
    | 'SCORE_UPDATED'
    | 'USER_JOINED'
    | 'SCHEDULE_UPDATED';

export interface WebSocketEvent {
    type: WebSocketEventType;
    payload: any;
    timestamp: string;
    userId?: string;
}

type EventCallback = (event: WebSocketEvent) => void;

class WebSocketService {
    private channel: BroadcastChannel;
    private listeners: Map<WebSocketEventType, EventCallback[]> = new Map();
    private connectionId: string;
    private isConnected: boolean = false;

    constructor() {
        this.connectionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.channel = new BroadcastChannel('hackfest_realtime');
        this.setupListeners();
    }

    private setupListeners() {
        this.channel.onmessage = (event: MessageEvent<WebSocketEvent>) => {
            const wsEvent = event.data;
            const callbacks = this.listeners.get(wsEvent.type) || [];
            callbacks.forEach(cb => cb(wsEvent));

            // Also trigger global listeners
            const globalCallbacks = this.listeners.get('*' as WebSocketEventType) || [];
            globalCallbacks.forEach(cb => cb(wsEvent));
        };
        this.isConnected = true;
    }

    connect(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.isConnected) {
                this.channel = new BroadcastChannel('hackfest_realtime');
                this.setupListeners();
            }
            // Broadcast that a new user joined
            this.broadcast({
                type: 'USER_JOINED',
                payload: { connectionId: this.connectionId },
                timestamp: new Date().toISOString()
            });
            resolve();
        });
    }

    disconnect() {
        this.isConnected = false;
        this.channel.close();
    }

    on(eventType: WebSocketEventType | '*', callback: EventCallback) {
        const type = eventType as WebSocketEventType;
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)!.push(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(type) || [];
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    off(eventType: WebSocketEventType, callback?: EventCallback) {
        if (callback) {
            const callbacks = this.listeners.get(eventType) || [];
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        } else {
            this.listeners.delete(eventType);
        }
    }

    broadcast(event: Omit<WebSocketEvent, 'userId'>) {
        const fullEvent: WebSocketEvent = {
            ...event,
            userId: this.connectionId
        };
        this.channel.postMessage(fullEvent);

        // Also trigger local listeners
        const callbacks = this.listeners.get(event.type) || [];
        callbacks.forEach(cb => cb(fullEvent));

        const globalCallbacks = this.listeners.get('*' as WebSocketEventType) || [];
        globalCallbacks.forEach(cb => cb(fullEvent));
    }

    // Convenience methods for common events
    teamCreated(team: Team) {
        this.broadcast({
            type: 'TEAM_CREATED',
            payload: team,
            timestamp: new Date().toISOString()
        });
    }

    teamUpdated(team: Team) {
        this.broadcast({
            type: 'TEAM_UPDATED',
            payload: team,
            timestamp: new Date().toISOString()
        });
    }

    teamCheckedIn(team: Team) {
        this.broadcast({
            type: 'TEAM_CHECKED_IN',
            payload: team,
            timestamp: new Date().toISOString()
        });
    }

    teamSubmitted(team: Team) {
        this.broadcast({
            type: 'TEAM_SUBMITTED',
            payload: team,
            timestamp: new Date().toISOString()
        });
    }

    announcementPosted(announcement: Announcement) {
        this.broadcast({
            type: 'ANNOUNCEMENT_POSTED',
            payload: announcement,
            timestamp: new Date().toISOString()
        });
    }

    scoreUpdated(team: Team) {
        this.broadcast({
            type: 'SCORE_UPDATED',
            payload: team,
            timestamp: new Date().toISOString()
        });
    }

    volunteerAssigned(data: { team: Team; volunteer: Volunteer }) {
        this.broadcast({
            type: 'VOLUNTEER_ASSIGNED',
            payload: data,
            timestamp: new Date().toISOString()
        });
    }

    getConnectionId() {
        return this.connectionId;
    }
}

// Singleton instance
export const wsService = new WebSocketService();
