import { useEffect, useState, useRef } from 'react';

/**
 * Hook to analyze audio volume from a MediaStream.
 * Returns a normalized volume level between 0 and 1.
 * 
 * @param stream - The MediaStream to analyze
 * @param enabled - Whether analysis should be active
 * @returns number - current volume level (0.0 to 1.0)
 */
export function useVolumeAnalyser(stream: MediaStream | null, enabled: boolean = true): number {
    const [volume, setVolume] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!stream || !enabled) {
            setVolume(0);
            return () => { };
        }

        try {
            // Create AudioContext if needed
            if (!audioContextRef.current) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContextClass();
            }

            const ctx = audioContextRef.current;

            // Resume context if suspended (browser autoplay policy)
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            // Create analyser
            if (!analyserRef.current) {
                analyserRef.current = ctx.createAnalyser();
                analyserRef.current.fftSize = 256;
                analyserRef.current.smoothingTimeConstant = 0.5;
            }

            const analyser = analyserRef.current;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            // Connect stream source
            // Note: We need to handle potential errors if stream tracks are ended
            try {
                sourceRef.current = ctx.createMediaStreamSource(stream);
                sourceRef.current.connect(analyser);
            } catch (err) {
                console.warn('Error connecting stream to analyser:', err);
                return;
            }

            const updateVolume = () => {
                if (!enabled) return;

                analyser.getByteFrequencyData(dataArray);

                // Calculate RMS (Root Mean Square) for better volume perception
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    const normalized = dataArray[i] / 255;
                    sum += normalized * normalized;
                }
                const rms = Math.sqrt(sum / dataArray.length);

                // Apply some scaling and clamping to make it more responsive
                // The input is usually quiet, so we boost it a bit
                const boosted = Math.min(rms * 4, 1);

                setVolume(boosted);
                rafRef.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();

            return () => {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }
                if (sourceRef.current) {
                    sourceRef.current.disconnect();
                    sourceRef.current = null;
                }
                // We keep the context alive to avoid hitting max context limits, 
                // or we could close it. For a long-running app, reusing is safer.
                // But if we create a new one every time, we SHOULD close it.
                // Let's ensure we close it to be safe and avoid leaks.
                if (audioContextRef.current) {
                    audioContextRef.current.close().catch(console.error);
                    audioContextRef.current = null;
                }
                analyserRef.current = null;
            };
        } catch (err) {
            console.error('Failed to initialize volume analyser:', err);
            return () => { };
        }
    }, [stream, enabled]);

    return volume;
}
