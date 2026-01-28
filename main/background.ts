import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { IPC_CHANNELS } from '../shared/types';

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

// ============================================================================
// IPC Handlers
// ============================================================================

function registerIpcHandlers(): void {
    ipcMain.handle(IPC_CHANNELS.PING, async () => {
        return 'pong';
    });

    ipcMain.handle(IPC_CHANNELS.SEND_AUDIO, async (_event, audioData: ArrayBuffer) => {
        // Log audio receipt (Mission 4 will add transcription here)
        console.log(`Received audio: ${audioData.byteLength} bytes`);
    });
}

// ============================================================================
// Window Management
// ============================================================================

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: true,
        center: true,
        title: 'Voice Intelligence',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const url = isDev
        ? 'http://localhost:8888'
        : `file://${path.join(__dirname, '../renderer/out/index.html')}`;

    mainWindow.loadURL(url);

    mainWindow.on('closed', () => {
        mainWindow = null;
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
});

app.on('window-all-closed', () => {
    // On macOS, keep app in dock unless explicitly quit
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS, re-create window when dock icon clicked and no windows exist
    if (mainWindow === null) {
        createWindow();
    }
});
