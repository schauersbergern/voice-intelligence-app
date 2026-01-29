/**
 * Global keyboard shortcuts management using Electron's native globalShortcut
 * Supports configurable hotkeys stored in electron-store
 */

import { globalShortcut, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import { initStore } from './store';

// Default hotkey
const DEFAULT_HOTKEY = 'Alt+Space';

let mainWindow: BrowserWindow | null = null;
let currentHotkey: string = DEFAULT_HOTKEY;

/**
 * Initialize global shortcuts
 */
export async function initializeShortcuts(window: BrowserWindow): Promise<void> {
    mainWindow = window;

    // Load hotkey from store
    try {
        const store = await initStore();
        currentHotkey = store.get('hotkey') || DEFAULT_HOTKEY;
    } catch {
        currentHotkey = DEFAULT_HOTKEY;
    }

    registerGlobalShortcuts();
}

/**
 * Register the current hotkey
 * @returns true if successful, false if failed
 */
export function registerGlobalShortcuts(): boolean {
    try {
        // Unregister first to be safe
        globalShortcut.unregisterAll();

        // Register the toggle hotkey
        const success = globalShortcut.register(currentHotkey, () => {
            console.log('Global hotkey triggered:', currentHotkey);
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send(IPC_CHANNELS.TOGGLE_RECORDING);
            }
        });

        if (!success) {
            console.error('Registration failed for:', currentHotkey);
            return false;
        }

        console.log('Global shortcut registered:', currentHotkey);
        return true;
    } catch (err) {
        console.error('Failed to register global shortcuts:', err);
        return false;
    }
}

/**
 * Update the hotkey to a new accelerator
 * @param accelerator - Electron accelerator string (e.g., "Alt+Space")
 * @returns true if successful, false if conflict/error
 */
export function updateHotkey(accelerator: string): boolean {
    const previousHotkey = currentHotkey;
    currentHotkey = accelerator;

    const success = registerGlobalShortcuts();

    if (!success) {
        // Revert to previous hotkey on failure
        currentHotkey = previousHotkey;
        registerGlobalShortcuts();
    }

    return success;
}

/**
 * Get the current hotkey
 */
export function getCurrentHotkey(): string {
    return currentHotkey;
}

export function cleanupShortcuts(): void {
    globalShortcut.unregisterAll();
}
