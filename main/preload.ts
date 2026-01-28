import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, type ElectronAPI } from '../shared/types';

// Secure IPC bridge
// CRITICAL: Never expose raw ipcRenderer to the renderer process
// All IPC communication must go through explicit, typed API methods

// Implement all API methods with explicit channel binding
const api: ElectronAPI = {
    ping: () => ipcRenderer.invoke(IPC_CHANNELS.PING),
    sendAudioForTranscription: (audioData: ArrayBuffer) =>
        ipcRenderer.invoke(IPC_CHANNELS.SEND_AUDIO, audioData),
};

contextBridge.exposeInMainWorld('electronAPI', api);
