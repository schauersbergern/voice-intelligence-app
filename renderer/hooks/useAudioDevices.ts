import { useState, useEffect, useCallback } from 'react';
import type { AudioDevice } from '../../shared/types';

interface UseAudioDevicesReturn {
    devices: AudioDevice[];
    selectedId: string;
    setSelectedId: (id: string) => Promise<void>;
    isLoading: boolean;
}

export function useAudioDevices(): UseAudioDevicesReturn {
    const [devices, setDevices] = useState<AudioDevice[]>([]);
    const [selectedId, setSelectedId] = useState<string>('default');
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Enumerate available audio input devices
     */
    const enumerateDevices = useCallback(async () => {
        try {
            // Check if we have permission first (implied by ability to enumerate labels)
            // But we can just call enumerateDevices. If no permission, labels will be empty.
            // Requesting permission is handled by useAudioRecorder when recording starts.
            // However, to get labels we might need permission.
            // We'll optimistically try to get devices.

            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = allDevices
                .filter(d => d.kind === 'audioinput')
                .map(d => ({
                    deviceId: d.deviceId,
                    label: d.label || `Microphone ${d.deviceId.slice(0, 5)}...`
                }));

            // Filter out default if it's just a duplicate of another device, 
            // but usually 'default' is a virtual device. We'll keep it.
            // Actually, we should check if unique devices are found.

            setDevices(audioInputs);
            setIsLoading(false);

            // Sync to Main Process for Tray Menu
            // We only send if we have meaningful labels (permission granted)
            const hasLabels = audioInputs.some(d => d.label && !d.label.startsWith('Microphone device'));
            if (window.electronAPI && (hasLabels || audioInputs.length > 0)) {
                window.electronAPI.updateAudioDevices(audioInputs).catch(console.error);
            }

        } catch (err) {
            console.error('Error enumerating devices:', err);
            setIsLoading(false);
        }
    }, []);

    // Initial load and listeners
    useEffect(() => {
        enumerateDevices();

        // Listen for device changes (plug/unplug)
        navigator.mediaDevices.addEventListener('devicechange', enumerateDevices);

        // Listen for settings changes from Main Process (e.g. Tray menu selection)
        let cleanupSettings: (() => void) | undefined;
        if (window.electronAPI) {
            // Load initial setting
            window.electronAPI.getSettings().then(settings => {
                if (settings.microphoneId) {
                    setSelectedId(settings.microphoneId);
                }
            }).catch(console.error);

            // Listen for changes
            cleanupSettings = window.electronAPI.onSettingsChanged((settings) => {
                if (settings.microphoneId) {
                    setSelectedId(settings.microphoneId as string);
                }
            });
        }

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', enumerateDevices);
            if (cleanupSettings) cleanupSettings();
        };
    }, [enumerateDevices]);

    // Handle selection change
    const handleSetSelectedId = async (id: string) => {
        setSelectedId(id);
        if (window.electronAPI) {
            await window.electronAPI.saveSetting('microphoneId', id);
        }
    };

    return {
        devices,
        selectedId,
        setSelectedId: handleSetSelectedId,
        isLoading
    };
}
