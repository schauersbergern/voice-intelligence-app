import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { IPC_CHANNELS, type WhisperMode, type EnrichmentMode, type LLMProvider } from '../shared/types';
import { transcribe, setWhisperMode, getWhisperMode, setApiKey } from './whisper-handler';
import { enrich, setEnrichmentMode, getEnrichmentMode, setLLMProvider } from './enrichment';
import { setMainWindow } from './window-manager';
import { registerGlobalShortcuts, unregisterAllShortcuts } from './shortcuts';

const isDev = !app.isPackaged;

// Recording state tracked in main process for hotkey coordination
let isRecording = false;

// ============================================================================
// IPC Handlers
// ============================================================================

function registerIpcHandlers(): void {
    ipcMain.handle(IPC_CHANNELS.PING, async () => {
        return 'pong';
    });

    ipcMain.handle(IPC_CHANNELS.SEND_AUDIO, async (_event, audioData: ArrayBuffer) => {
        // Step 1: Transcribe audio
        const transcriptionResult = await transcribe(Buffer.from(audioData));

        // Step 2: Enrich transcription with LLM
        const { enrichedText, wasEnriched } = await enrich(transcriptionResult.text);

        return {
            ...transcriptionResult,
            enrichedText,
            wasEnriched,
        };
    });

    ipcMain.handle(IPC_CHANNELS.SET_WHISPER_MODE, async (_event, mode: WhisperMode) => {
        setWhisperMode(mode);
    });

    ipcMain.handle(IPC_CHANNELS.GET_WHISPER_MODE, async () => {
        return getWhisperMode();
    });

    ipcMain.handle(IPC_CHANNELS.SET_API_KEY, async (_event, key: string) => {
        setApiKey(key);
    });

    ipcMain.handle(IPC_CHANNELS.GET_RECORDING_STATE, async () => {
        return isRecording;
    });

    ipcMain.handle(IPC_CHANNELS.SET_RECORDING_STATE, async (_event, recording: boolean) => {
        isRecording = recording;
    });

    ipcMain.handle(IPC_CHANNELS.SET_ENRICHMENT_MODE, async (_event, mode: EnrichmentMode) => {
        setEnrichmentMode(mode);
    });

    ipcMain.handle(IPC_CHANNELS.GET_ENRICHMENT_MODE, async () => {
        return getEnrichmentMode();
    });

    ipcMain.handle(IPC_CHANNELS.SET_LLM_PROVIDER, async (_event, provider: LLMProvider, apiKey: string) => {
        setLLMProvider(provider, apiKey);
    });
}

// ============================================================================
// Window Management
// ============================================================================

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 450,
        height: 750,
        minWidth: 320,
        minHeight: 450,
        maxWidth: 600,
        maxHeight: 850,
        resizable: true,
        center: true,
        title: 'Voice Intelligence',
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#1a1a2e',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Store reference in window manager
    setMainWindow(mainWindow);

    const url = isDev
        ? 'http://localhost:8888'
        : `file://${path.join(__dirname, 'index.html')}`;

    mainWindow.loadURL(url);

    mainWindow.on('closed', () => {
        setMainWindow(null);
    });

    // Open DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
}

// ============================================================================
// App Lifecycle
// ============================================================================

app.whenReady().then(() => {
    registerIpcHandlers();
    createWindow();
    registerGlobalShortcuts();
});

app.on('will-quit', () => {
    unregisterAllShortcuts();
});

app.on('window-all-closed', () => {
    // On macOS, keep app in dock unless explicitly quit
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS, re-create window when dock icon clicked and no windows exist
    const { getMainWindow } = require('./window-manager');
    if (getMainWindow() === null) {
        createWindow();
    }
});
