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
    // Register the main recording toggle hotkey
    const success = globalShortcut.register(DEFAULT_HOTKEY, handleRecordingToggle);

    if (!success) {
        console.warn(`Failed to register global shortcut: ${DEFAULT_HOTKEY}`);
        console.warn('The shortcut may be in use by another application');
    } else {
        console.log(`Global shortcut registered: ${DEFAULT_HOTKEY}`);
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
    console.log('Recording toggle triggered via hotkey');
}

/**
 * Unregister all global shortcuts
 */
export function unregisterAllShortcuts(): void {
    globalShortcut.unregisterAll();
    console.log('All global shortcuts unregistered');
}

/**
 * Check if a shortcut is registered
 */
export function isShortcutRegistered(accelerator: string = DEFAULT_HOTKEY): boolean {
    return globalShortcut.isRegistered(accelerator);
}
