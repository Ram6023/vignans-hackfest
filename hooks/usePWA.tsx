import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
    isInstalled: boolean;
    isInstallable: boolean;
    isOnline: boolean;
    isStandalone: boolean;
    installPrompt: BeforeInstallPromptEvent | null;
}

export function usePWA() {
    const [state, setState] = useState<PWAState>({
        isInstalled: false,
        isInstallable: false,
        isOnline: navigator.onLine,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true,
        installPrompt: null,
    });

    // Handle install prompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setState(prev => ({
                ...prev,
                isInstallable: true,
                installPrompt: e as BeforeInstallPromptEvent,
            }));
        };

        const handleAppInstalled = () => {
            setState(prev => ({
                ...prev,
                isInstalled: true,
                isInstallable: false,
                installPrompt: null,
            }));
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    // Handle online/offline status
    useEffect(() => {
        const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
        const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Handle display mode changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handleChange = (e: MediaQueryListEvent) => {
            setState(prev => ({ ...prev, isStandalone: e.matches }));
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Install the PWA
    const install = useCallback(async () => {
        if (!state.installPrompt) return false;

        try {
            await state.installPrompt.prompt();
            const { outcome } = await state.installPrompt.userChoice;

            if (outcome === 'accepted') {
                setState(prev => ({
                    ...prev,
                    isInstalled: true,
                    isInstallable: false,
                    installPrompt: null,
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('PWA install error:', error);
            return false;
        }
    }, [state.installPrompt]);

    // Dismiss the install prompt
    const dismissInstallPrompt = useCallback(() => {
        setState(prev => ({
            ...prev,
            isInstallable: false,
        }));
    }, []);

    return {
        ...state,
        install,
        dismissInstallPrompt,
    };
}

// Offline indicator component
export function OfflineIndicator({ isOnline }: { isOnline: boolean }) {
    if (isOnline) return null;

    return (
        <div className="offline-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>You're offline</span>
        </div>
    );
}

// Install prompt component
export function InstallPrompt({
    isInstallable,
    onInstall,
    onDismiss
}: {
    isInstallable: boolean;
    onInstall: () => void;
    onDismiss: () => void;
}) {
    const [dismissed, setDismissed] = useState(false);

    if (!isInstallable || dismissed) return null;

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss();
    };

    return (
        <div className="install-prompt">
            <button className="install-prompt-close" onClick={handleDismiss} aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
            <div className="install-prompt-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
            </div>
            <div className="install-prompt-content">
                <div className="install-prompt-title">Install VHACK 2.0</div>
                <div className="install-prompt-text">Add to home screen for quick access</div>
            </div>
            <button className="install-prompt-btn" onClick={onInstall}>
                Install
            </button>
        </div>
    );
}

export default usePWA;
