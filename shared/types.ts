// Voice Intelligence App - Shared Types
// This file contains TypeScript types shared between main and renderer processes

// ============================================================================
// IPC Channel Names
// ============================================================================

/** IPC channel names as const for type safety */
export const IPC_CHANNELS = {
    PING: 'app:ping',
    SEND_AUDIO: 'audio:send-for-transcription',
    // Future channels (Mission 4+):
    // WHISPER_TRANSCRIBE: 'whisper:transcribe',
    // SETTINGS_GET: 'settings:get',
    // SETTINGS_SET: 'settings:set',
} as const;

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
     * @returns Promise resolving when audio is received
     */
    sendAudioForTranscription: (audioData: ArrayBuffer) => Promise<void>;
}

// ============================================================================
// Domain Types
// ============================================================================

// Future types for Mission 4+:
// export interface TranscriptionResult {
//   text: string;
//   confidence: number;
//   segments?: TranscriptionSegment[];
// }

