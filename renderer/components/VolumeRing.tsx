import React, { CSSProperties } from 'react';

interface VolumeRingProps {
    volume: number;        // 0.0 to 1.0
    isRecording: boolean;
    children: React.ReactNode;
}

export function VolumeRing({ volume, isRecording, children }: VolumeRingProps) {
    // Determine color based on volume: Blue -> Purple -> Pink
    // Hue: Starts around 240 (Blue) and goes down to 300 (Purple) then 330 (Pink)
    // Let's map 0 -> 1 to Hue 220 -> 320

    // Base hue: 220 (Blue-ish)
    // Max hue shift: 100 degrees
    const hue = 220 + (volume * 100);
    const color = `hsl(${hue}, 90%, 60%)`;

    // Calculate ring fill angle: 0 to 360 degrees
    // Ensure at least a tiny bit is visible when recording to show it's active
    const fillPercentage = isRecording ? Math.max(volume * 100, 5) : 0;

    // Glow intensity
    const glowSize = volume * 20;

    const style: CSSProperties = {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        padding: '6px', // Space for the ring
    };

    const ringStyle: CSSProperties = {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: '50%',
        background: `conic-gradient(
            ${color} ${fillPercentage}%, 
            rgba(255, 255, 255, 0.1) ${fillPercentage}%
        )`,
        filter: isRecording
            ? `drop-shadow(0 0 ${glowSize}px ${color}) blur(1px)`
            : 'none',
        opacity: isRecording ? 0.8 + (volume * 0.2) : 0,
        transition: 'all 0.1s ease-out',
        zIndex: 0,
        pointerEvents: 'none',
    };

    return (
        <div style={style}>
            {/* The Ring */}
            <div style={ringStyle} />

            <div style={{ position: 'relative', zIndex: 2 }}>
                {children}
            </div>
        </div>
    );
}
