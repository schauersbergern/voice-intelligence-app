/**
 * Unified Whisper transcription handler
 * Routes transcription to local whisper.cpp or OpenAI API based on mode
 */

import type { WhisperMode, RawTranscriptionResult } from '../shared/types';
import { transcribeLocal, isModelAvailable } from './whisper-local';
import { transcribeWithAPI } from './whisper-api';

// In-memory settings (will be persisted in a future mission)
let currentMode: WhisperMode = 'api'; // Default to API mode (easier to test)
let apiKey: string = '';

/**
 * Set the transcription mode
 */
export function setWhisperMode(mode: WhisperMode): void {
    currentMode = mode;
    console.log(`Whisper mode set to: ${mode}`);
}

/**
 * Get the current transcription mode
 */
export function getWhisperMode(): WhisperMode {
    return currentMode;
}

/**
 * Set the OpenAI API key
 */
export function setApiKey(key: string): void {
    apiKey = key;
    console.log('API key updated');
}

/**
 * Check if transcription is ready
 */
export async function isReady(): Promise<{ ready: boolean; message?: string }> {
    if (currentMode === 'local') {
        const modelExists = await isModelAvailable();
        if (!modelExists) {
            return {
                ready: false,
                message: 'Local model not found. Please download ggml-base.en.bin or switch to API mode.'
            };
        }
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
        text = await transcribeLocal(audioBuffer);
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
