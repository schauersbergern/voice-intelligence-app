// Voice Intelligence App - Shared Types
// This file contains TypeScript types shared between main and renderer processes

// ============================================================================
// IPC Channel Names
// ============================================================================

/** IPC channel names as const for type safety */
export const IPC_CHANNELS = {
    PING: 'app:ping',
    SEND_AUDIO: 'audio:send-for-transcription',
    ENRICH_TRANSCRIPTION: 'transcription:enrich',
    SET_WHISPER_MODE: 'whisper:set-mode',
    SET_API_KEY: 'settings:set-api-key',
    GET_WHISPER_MODE: 'whisper:get-mode',
    TOGGLE_RECORDING: 'recording:toggle',
    GET_RECORDING_STATE: 'recording:get-state',
    SET_RECORDING_STATE: 'recording:set-state',
    SET_ENRICHMENT_MODE: 'enrichment:set-mode',
    GET_ENRICHMENT_MODE: 'enrichment:get-mode',
    SET_LLM_PROVIDER: 'enrichment:set-provider',
    GET_SETTINGS: 'settings:get-all',
    SAVE_SETTING: 'settings:save-one',
    TRIGGER_PASTE: 'automation:trigger-paste',
    COPY_TO_CLIPBOARD: 'clipboard:copy',
    SET_HOTKEY: 'settings:set-hotkey',
    SETTINGS_CHANGED: 'settings:changed',
    AUDIO_DEVICES_UPDATED: 'audio:devices-updated',
} as const;

// ============================================================================
// Whisper Types
// ============================================================================

/** Whisper transcription mode */
export type WhisperMode = 'local' | 'api';

/** Result from transcription */
export interface TranscriptionResult {
    text: string;
    enrichedText: string;
    wasEnriched: boolean;
    duration: number;
    mode: WhisperMode;
}

/** Raw result from whisper transcription (before enrichment) */
export interface RawTranscriptionResult {
    text: string;
    duration: number;
    mode: WhisperMode;
}

// ============================================================================
// Enrichment Types
// ============================================================================

/** LLM enrichment processing modes */
export type EnrichmentMode = 'clean' | 'format' | 'summarize' | 'action' | 'email' | 'notes' | 'commit' | 'tweet' | 'slack' | 'none';

/** LLM provider options */
export type LLMProvider = 'openai' | 'anthropic';

/** Audio input device */
export interface AudioDevice {
    deviceId: string;
    label: string;
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

    /**
     * Listen for recording toggle events from global hotkey.
     * @param callback - Function called when toggle is triggered
     * @returns Cleanup function to remove listener
     */
    onRecordingToggle: (callback: () => void) => () => void;

    /**
     * Get the current recording state from main process.
     */
    getRecordingState: () => Promise<boolean>;

    /**
     * Set the recording state in main process.
     * @param isRecording - Whether recording is active
     */
    setRecordingState: (isRecording: boolean) => Promise<void>;

    /**
     * Set the LLM enrichment mode.
     */
    setEnrichmentMode: (mode: EnrichmentMode) => Promise<void>;

    /**
     * Get the current enrichment mode.
     */
    getEnrichmentMode: () => Promise<EnrichmentMode>;

    /**
     * Set the LLM provider and API key.
     */
    setLLMProvider: (provider: LLMProvider, apiKey: string) => Promise<void>;

    /**
     * Enrich transcription text using LLM (for local mode).
     * @param text - Raw transcription text
     * @returns Promise resolving with enriched transcription result
     */
    enrichTranscription: (text: string) => Promise<TranscriptionResult>;

    /**
     * Get all persisted settings.
     */
    getSettings: () => Promise<AppSettings>;

    /**
     * Save a setting value.
     */
    saveSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;

    /**
     * Trigger global paste action (Cmd+V).
     */
    triggerPaste: () => Promise<void>;

    /**
     * Copy text to system clipboard.
     * @param text - Text to copy
     */
    copyToClipboard: (text: string) => Promise<void>;

    /**
     * Set the global hotkey.
     * @param accelerator - Electron accelerator string
     * @returns Promise resolving to true if successful, false if conflict
     */
    setHotkey: (accelerator: string) => Promise<boolean>;

    /**
     * Listen for settings changes from main process (e.g., menu bar changes).
     * @param callback - Function called with partial settings object
     * @returns Cleanup function to remove listener
     */
    onSettingsChanged: (callback: (settings: Partial<AppSettings>) => void) => () => void;

    /**
     * Update the list of available audio devices in the main process.
     * @param devices - List of audio input devices
     */
    updateAudioDevices: (devices: AudioDevice[]) => Promise<void>;
}

export interface AppSettings {
    whisperMode: WhisperMode;
    whisperLanguage: string;
    enrichmentMode: EnrichmentMode;
    apiKey: string;
    llmProvider: LLMProvider;
    hotkey: string;
    microphoneId: string;
}
