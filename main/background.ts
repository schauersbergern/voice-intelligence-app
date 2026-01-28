import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { IPC_CHANNELS, type WhisperMode } from '../shared/types';
import { transcribe, setWhisperMode, getWhisperMode, setApiKey } from './whisper-handler';
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
        console.log(`Received audio: ${audioData.byteLength} bytes`);
        const result = await transcribe(Buffer.from(audioData));
        console.log(`Transcription complete: "${result.text.substring(0, 50)}..." (${result.duration.toFixed(2)}s)`);
        return result;
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
}

// ============================================================================
// Window Management
// ============================================================================

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 700,
        resizable: true,
        center: true,
        title: 'Voice Intelligence',
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
        : `file://${path.join(__dirname, '../renderer/out/index.html')}`;

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
