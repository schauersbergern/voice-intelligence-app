// Voice Intelligence App - Shared Types
// This file contains TypeScript types shared between main and renderer processes

// ============================================================================
// IPC Channel Names
// ============================================================================

/** IPC channel names as const for type safety */
export const IPC_CHANNELS = {
    PING: 'app:ping',
    SEND_AUDIO: 'audio:send-for-transcription',
    SET_WHISPER_MODE: 'whisper:set-mode',
    SET_API_KEY: 'settings:set-api-key',
    GET_WHISPER_MODE: 'whisper:get-mode',
} as const;

// ============================================================================
// Whisper Types
// ============================================================================

/** Whisper transcription mode */
export type WhisperMode = 'local' | 'api';

/** Result from transcription */
export interface TranscriptionResult {
    text: string;
    duration: number;
    mode: WhisperMode;
}

// ============================================================================
// IPC API Interface
// ============================================================================

/**
 * API exposed to renderer via contextBridge.
 * All methods use invoke/handle pattern (request/response).
 */
export interface ElectronAPI {
    /**
     * Test IPC communication.
     * @returns Promise resolving to 'pong'
     */
    ping: () => Promise<string>;

    /**
     * Send audio data to main process for transcription.
     * @param audioData - WAV audio as ArrayBuffer (16kHz mono 16-bit PCM)
     * @returns Promise resolving with transcription result
     */
    sendAudioForTranscription: (audioData: ArrayBuffer) => Promise<TranscriptionResult>;

    /**
     * Set the Whisper transcription mode.
     * @param mode - 'local' for whisper.cpp or 'api' for OpenAI
     */
    setWhisperMode: (mode: WhisperMode) => Promise<void>;

    /**
     * Get the current Whisper transcription mode.
     */
    getWhisperMode: () => Promise<WhisperMode>;

    /**
     * Set the OpenAI API key for API mode.
     * @param key - OpenAI API key
     */
    setApiKey: (key: string) => Promise<void>;
}
