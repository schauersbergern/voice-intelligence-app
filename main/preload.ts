import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, type ElectronAPI, type WhisperMode, type EnrichmentMode, type LLMProvider } from '../shared/types';

// Secure IPC bridge
// CRITICAL: Never expose raw ipcRenderer to the renderer process
// All IPC communication must go through explicit, typed API methods

// Implement all API methods with explicit channel binding
const api: ElectronAPI = {
    ping: () => ipcRenderer.invoke(IPC_CHANNELS.PING),

    sendAudioForTranscription: (audioData: ArrayBuffer) =>
        ipcRenderer.invoke(IPC_CHANNELS.SEND_AUDIO, audioData),

    setWhisperMode: (mode: WhisperMode) =>
        ipcRenderer.invoke(IPC_CHANNELS.SET_WHISPER_MODE, mode),

    getWhisperMode: () =>
        ipcRenderer.invoke(IPC_CHANNELS.GET_WHISPER_MODE),

    setApiKey: (key: string) =>
        ipcRenderer.invoke(IPC_CHANNELS.SET_API_KEY, key),

    onRecordingToggle: (callback: () => void) => {
        const handler = () => callback();
        ipcRenderer.on(IPC_CHANNELS.TOGGLE_RECORDING, handler);
        // Return cleanup function
        return () => {
            ipcRenderer.removeListener(IPC_CHANNELS.TOGGLE_RECORDING, handler);
        };
    },

    getRecordingState: () =>
        ipcRenderer.invoke(IPC_CHANNELS.GET_RECORDING_STATE),

    setRecordingState: (isRecording: boolean) =>
        ipcRenderer.invoke(IPC_CHANNELS.SET_RECORDING_STATE, isRecording),

    setEnrichmentMode: (mode: EnrichmentMode) =>
        ipcRenderer.invoke(IPC_CHANNELS.SET_ENRICHMENT_MODE, mode),

    getEnrichmentMode: () =>
        ipcRenderer.invoke(IPC_CHANNELS.GET_ENRICHMENT_MODE),

    setLLMProvider: (provider: LLMProvider, apiKey: string) =>
        ipcRenderer.invoke(IPC_CHANNELS.SET_LLM_PROVIDER, provider, apiKey),

    enrichTranscription: (text: string) =>
        ipcRenderer.invoke(IPC_CHANNELS.ENRICH_TRANSCRIPTION, text),

    getSettings: () =>
        ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),

    saveSetting: (key, value) =>
        ipcRenderer.invoke(IPC_CHANNELS.SAVE_SETTING, key, value),

    triggerPaste: () =>
        ipcRenderer.invoke(IPC_CHANNELS.TRIGGER_PASTE),

    copyToClipboard: (text: string) =>
        ipcRenderer.invoke(IPC_CHANNELS.COPY_TO_CLIPBOARD, text),

    setHotkey: (accelerator: string) =>
        ipcRenderer.invoke(IPC_CHANNELS.SET_HOTKEY, accelerator),

    onSettingsChanged: (callback: (settings: Record<string, unknown>) => void) => {
        const handler = (_event: Electron.IpcRendererEvent, settings: Record<string, unknown>) => callback(settings);
        ipcRenderer.on(IPC_CHANNELS.SETTINGS_CHANGED, handler);
        return () => {
            ipcRenderer.removeListener(IPC_CHANNELS.SETTINGS_CHANGED, handler);
        };
    },
};

contextBridge.exposeInMainWorld('electronAPI', api);
