// Notification Service - Handles browser and PWA notifications
import { wsService } from './websocket';

class NotificationService {
    private permission: NotificationPermission = 'default';

    constructor() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }
    }

    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('Notifications not supported in this browser');
            return false;
        }

        const result = await Notification.requestPermission();
        this.permission = result;
        return result === 'granted';
    }

    showNotification(title: string, options?: NotificationOptions) {
        if (this.permission === 'granted') {
            // Check if we're in a PWA or background
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, {
                        icon: '/icons/icon-192x192.png',
                        badge: '/icons/icon-72x72.png',
                        vibrate: [200, 100, 200],
                        ...options
                    });
                });
            } else {
                // Fallback to standard Notification
                new Notification(title, {
                    icon: '/icons/icon-192x192.png',
                    ...options
                });
            }
        }
    }

    setupRealtimeListeners() {
        wsService.on('ANNOUNCEMENT_POSTED', (event) => {
            const announcement = event.payload;
            this.showNotification('New Hackathon Update', {
                body: announcement.message,
                tag: 'announcement',
                renotify: true
            });
        });

        wsService.on('HELP_REQUESTED', (event) => {
            const team = event.payload;
            // Only show to volunteers/admins
            // In a real app, we'd check user role here
            this.showNotification('Help Needed!', {
                body: `${team.name} needs a mentor in Room ${team.roomNumber}`,
                tag: 'help-request'
            });
        });
    }
}

export const notificationService = new NotificationService();
