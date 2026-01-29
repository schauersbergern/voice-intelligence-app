import React from 'react';
import { useAudioDevices } from '../hooks/useAudioDevices';

interface MicrophoneSelectorProps {
    // Optional: pass in control if parent manages state, but hook manages global state/sync
    // So we might not need props, or just className/style
    style?: React.CSSProperties;
    className?: string;
}

export const MicrophoneSelector: React.FC<MicrophoneSelectorProps> = ({ style, className }) => {
    const { devices, selectedId, setSelectedId, isLoading } = useAudioDevices();

    if (isLoading && devices.length === 0) {
        return <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Loading microphones...</div>;
    }

    if (devices.length === 0) {
        return (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                No microphones found. Please check permissions.
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', ...style }} className={className}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', minWidth: '65px' }}>
                Microphone:
            </label>
            <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    maxWidth: '100%' // Ensure it doesn't overflow
                }}
            >
                {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${device.deviceId.substring(0, 8)}...`}
                    </option>
                ))}
            </select>
            {/* Optional: Test button could go here */}
        </div>
    );
};
