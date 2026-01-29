import path from 'path';
import { app, BrowserWindow, ipcMain, clipboard, powerMonitor } from 'electron';
import { IPC_CHANNELS, type WhisperMode, type EnrichmentMode, type LLMProvider } from '../shared/types';
import { transcribe, setWhisperMode, getWhisperMode, setApiKey } from './whisper-handler';
import { enrich, setEnrichmentMode, getEnrichmentMode, setLLMProvider } from './enrichment';
import { setMainWindow, getMainWindow } from './window-manager';
import { initializeShortcuts, cleanupShortcuts, updateHotkey, registerGlobalShortcuts } from './shortcuts';
import { getAllSettings, saveSetting, initStore } from './store';
import { createTray, updateTrayIcon, rebuildMenu } from './tray';

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
        updateTrayIcon(recording);
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

    ipcMain.handle(IPC_CHANNELS.ENRICH_TRANSCRIPTION, async (_event, text: string) => {
        const { enrichedText, wasEnriched } = await enrich(text);
        return {
            text,
            enrichedText: wasEnriched ? enrichedText : text,
            wasEnriched,
            duration: 0,
            mode: 'local' as const,
        };
    });

    // --- Automation Handlers ---
    ipcMain.handle(IPC_CHANNELS.TRIGGER_PASTE, async () => {
        const { triggerPaste } = require('./automation');
        await triggerPaste();
    });

    // --- Persistence Handlers ---
    ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, async () => {
        return await getAllSettings();
    });

    ipcMain.handle(IPC_CHANNELS.SAVE_SETTING, async (_event, key: string, value: any) => {
        await saveSetting(key, value);
        // Sync app settings changes to tray menu
        rebuildMenu();
    });

    ipcMain.handle(IPC_CHANNELS.COPY_TO_CLIPBOARD, async (_event, text: string) => {
        clipboard.writeText(text);
    });

    // --- Hotkey Handler ---
    ipcMain.handle(IPC_CHANNELS.SET_HOTKEY, async (_event, accelerator: string) => {
        const success = updateHotkey(accelerator);
        if (success) {
            await saveSetting('hotkey', accelerator);
        }
        return success;
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

    // Intercept close to hide instead of destroy (background operation)
    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });

    const url = isDev
        ? 'http://localhost:8888'
        : `file://${path.join(__dirname, 'index.html')}`;

    mainWindow.loadURL(url);

    // Open DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
}

// ============================================================================
// App Lifecycle
// ============================================================================

app.whenReady().then(async () => {
    await initStore();

    // Restore saved settings to handlers
    const settings = await getAllSettings();
    if (settings.apiKey) {
        setApiKey(settings.apiKey);
    }
    if (settings.whisperMode) {
        setWhisperMode(settings.whisperMode);
    }
    if (settings.enrichmentMode) {
        setEnrichmentMode(settings.enrichmentMode);
    }

    registerIpcHandlers();
    createWindow();

    // Create system tray
    createTray();

    // Initialize global shortcuts (PTT)
    const win = getMainWindow();
    if (win) {
        await initializeShortcuts(win);
    }

    // Re-register shortcuts after system wake
    powerMonitor.on('resume', () => {
        registerGlobalShortcuts();
    });
});

app.on('will-quit', () => {
    cleanupShortcuts();
});

app.on('window-all-closed', () => {
    // Don't quit - keep running in tray
});

app.on('activate', () => {
    // On macOS, show window when dock icon clicked
    const win = getMainWindow();
    if (win) {
        win.show();
        win.focus();
    } else {
        createWindow();
    }
});
