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
};

contextBridge.exposeInMainWorld('electronAPI', api);
