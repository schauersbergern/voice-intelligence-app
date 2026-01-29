import { useState, useRef, useCallback } from 'react';
import { encodeWAV } from '../utils/audio-utils';

export type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

interface UseAudioRecorderReturn {
    state: RecordingState;
    error: string | null;
    duration: number;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<ArrayBuffer | null>;
}

const BUFFER_SIZE = 4096;

/**
 * React hook for microphone audio recording
 * Produces 16kHz mono WAV audio suitable for Whisper transcription
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
    const [state, setState] = useState<RecordingState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);

    // Refs to persist across renders
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const audioChunksRef = useRef<Float32Array[]>([]);
    const startTimeRef = useRef<number>(0);
    const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /**
     * Start recording audio from the default microphone.
     * Requests permission if not granted.
     * Sets up AudioContext and ScriptProcessor for raw data capture.
     */
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            setState('idle');

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });
            mediaStreamRef.current = stream;

            // Create audio context (use device sample rate, we'll downsample later)
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            // Create source from microphone stream
            const source = audioContext.createMediaStreamSource(stream);

            // Create script processor for capturing audio data
            // Using ScriptProcessorNode (deprecated but widely supported)
            const scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            // Clear previous chunks
            audioChunksRef.current = [];

            // Capture audio data
            scriptProcessor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                // Clone the data since the buffer will be reused
                audioChunksRef.current.push(new Float32Array(inputData));
            };

            // Connect: source -> processor -> destination (required for processing)
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            // Start duration timer
            startTimeRef.current = Date.now();
            setDuration(0);
            durationIntervalRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 100);

            setState('recording');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to start recording';

            // Handle common permission errors
            if (message.includes('Permission denied') || message.includes('NotAllowedError')) {
                setError('Microphone permission denied. Please allow access in System Settings.');
            } else {
                setError(message);
            }
            setState('error');
        }
    }, []);

    /**
     * Stop recording and process the audio.
     * Stops permission tracks, closes AudioContext, and encodes result to WAV.
     * @returns Promise resolving to WAV ArrayBuffer or null if failed
     */
    const stopRecording = useCallback(async (): Promise<ArrayBuffer | null> => {
        if (state !== 'recording') {
            return null;
        }

        setState('processing');

        // Stop duration timer
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }

        try {
            // Stop all audio processing
            if (scriptProcessorRef.current) {
                scriptProcessorRef.current.disconnect();
                scriptProcessorRef.current = null;
            }

            // Stop media stream tracks
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }

            // Get sample rate before closing context
            const sampleRate = audioContextRef.current?.sampleRate ?? 44100;

            // Close audio context
            if (audioContextRef.current) {
                await audioContextRef.current.close();
                audioContextRef.current = null;
            }

            // Concatenate all audio chunks
            const chunks = audioChunksRef.current;
            if (chunks.length === 0) {
                setState('idle');
                return null;
            }

            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const fullAudio = new Float32Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                fullAudio.set(chunk, offset);
                offset += chunk.length;
            }

            // Clear chunks
            audioChunksRef.current = [];

            // Encode to WAV (will downsample to 16kHz)
            const wavBuffer = encodeWAV(fullAudio, sampleRate);

            setState('idle');
            return wavBuffer;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to process recording';
            setError(message);
            setState('error');
            return null;
        }
    }, [state]);

    return {
        state,
        error,
        duration,
        startRecording,
        stopRecording,
    };
}
