/**
 * Global keyboard shortcuts management using Electron's native globalShortcut
 * Replaces uiohook-napi to prevent fatal crashes
 */

import { globalShortcut, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../shared/types';

// Hotkey definition
const HOTKEY = 'CommandOrControl+Shift+Space';

let mainWindow: BrowserWindow | null = null;

/**
 * Initialize global shortcuts
 */
export function initializeShortcuts(window: BrowserWindow) {
    mainWindow = window;
    registerGlobalShortcuts();
}

export function registerGlobalShortcuts() {
    try {
        // Unregister first to be safe
        globalShortcut.unregisterAll();

        // Register the toggle hotkey
        const ret = globalShortcut.register(HOTKEY, () => {
            console.log('Global hotkey triggered');
            if (mainWindow && !mainWindow.isDestroyed()) {
                // Send toggle signal to renderer
                // The renderer keeps track of state (Recording vs Idle)
                // This implements "Toggle-to-Talk" behavior
                mainWindow.webContents.send(IPC_CHANNELS.TOGGLE_RECORDING);
            }
        });

        if (!ret) {
            console.error('Registration failed for', HOTKEY);
        } else {
            console.log('Global shortcuts initialized:', HOTKEY);
        }
    } catch (err) {
        console.error('Failed to register global shortcuts:', err);
    }
}

export function cleanupShortcuts() {
    globalShortcut.unregisterAll();
}

// Deprecated: No longer needed but kept for signature compatibility if called elsewhere
export function unregisterAllShortcuts() {
    cleanupShortcuts();
}
