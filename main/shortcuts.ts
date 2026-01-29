/**
 * Global keyboard shortcuts management
 */

import { globalShortcut } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import { getMainWindow, showAndFocus, isVisible } from './window-manager';

const DEFAULT_HOTKEY = 'CommandOrControl+Shift+Space';

/**
 * Register global keyboard shortcuts
 */
export function registerGlobalShortcuts(): void {
    const success = globalShortcut.register(DEFAULT_HOTKEY, handleRecordingToggle);

    if (!success) {
        // Shortcut may be in use by another application
    }
}

/**
 * Handle the recording toggle hotkey
 */
function handleRecordingToggle(): void {
    const mainWindow = getMainWindow();
    if (!mainWindow) return;

    // Always bring window to front when hotkey is pressed
    if (!isVisible()) {
        showAndFocus();
    }

    // Send toggle event to renderer
    mainWindow.webContents.send(IPC_CHANNELS.TOGGLE_RECORDING);
}

/**
 * Unregister all global shortcuts
 */
export function unregisterAllShortcuts(): void {
    globalShortcut.unregisterAll();
}

/**
 * Check if a shortcut is registered
 */
export function isShortcutRegistered(accelerator: string = DEFAULT_HOTKEY): boolean {
    return globalShortcut.isRegistered(accelerator);
}
