// Unified Whisper transcription handler
// Routes transcription to OpenAI API (Local transcription is now handled in Renderer)

import type { WhisperMode, RawTranscriptionResult } from '../shared/types';
import { transcribeWithAPI } from './whisper-api';

// In-memory settings
let currentMode: WhisperMode = 'api';
let apiKey: string = '';

/**
 * Set the transcription mode.
 * @param mode - 'local' for browser-based, 'api' for OpenAI Cloud
 */
export function setWhisperMode(mode: WhisperMode): void {
    currentMode = mode;
}

/**
 * Get the current transcription mode.
 */
export function getWhisperMode(): WhisperMode {
    return currentMode;
}

/**
 * Set the OpenAI API key for API mode.
 * @param key - The OpenAI API key string
 */
export function setApiKey(key: string): void {
    apiKey = key;
}

/**
 * Check if the transcription service is ready to process audio.
 * For API mode, this checks if an API key is present.
 * @returns Object indicating readiness and optional error message
 */
export async function isReady(): Promise<{ ready: boolean; message?: string }> {
    if (currentMode === 'local') {
        // Local mode is handled by Renderer, so Main process is effectively "ready" or shouldn't be called
        // We'll return true here, but transcribe() will throw if called
        return { ready: true };
    } else if (currentMode === 'api') {
        if (!apiKey || apiKey.trim() === '') {
            return {
                ready: false,
                message: 'API key required. Please enter your OpenAI API key.'
            };
        }
    }
    return { ready: true };
}

/**
 * Transcribe audio using the current mode
 * @param audioBuffer - WAV audio buffer (16kHz mono 16-bit PCM)
 * @returns Transcription result
 */
export async function transcribe(audioBuffer: Buffer): Promise<RawTranscriptionResult> {
    const startTime = Date.now();

    // Check if ready
    const readyStatus = await isReady();
    if (!readyStatus.ready) {
        throw new Error(readyStatus.message);
    }

    let text: string;

    if (currentMode === 'local') {
        throw new Error("Local transcription should be handled by Renderer process.");
    } else {
        text = await transcribeWithAPI(audioBuffer, apiKey);
    }

    const duration = (Date.now() - startTime) / 1000;

    return {
        text,
        duration,
        mode: currentMode,
    };
}
