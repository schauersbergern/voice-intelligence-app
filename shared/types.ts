// Voice Intelligence App - Shared Types
// This file contains TypeScript types shared between main and renderer processes

// ============================================================================
// IPC Channel Names
// ============================================================================

/** IPC channel names as const for type safety */
export const IPC_CHANNELS = {
    PING: 'app:ping',
    // Future channels (Mission 3+):
    // AUDIO_START: 'audio:start-recording',
    // AUDIO_STOP: 'audio:stop-recording',
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

    // Future methods (Mission 3+):
    // startRecording: () => Promise<void>;
    // stopRecording: () => Promise<AudioBuffer>;
    // transcribe: (audio: ArrayBuffer) => Promise<TranscriptionResult>;
}

// ============================================================================
// Domain Types (placeholder for future missions)
// ============================================================================

// export interface TranscriptionResult {
//   text: string;
//   confidence: number;
//   segments?: TranscriptionSegment[];
// }
