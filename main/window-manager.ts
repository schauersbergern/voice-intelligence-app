/**
 * Window manager for controlling main window visibility
 */

import type { BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

/**
 * Set the main window reference
 */
export function setMainWindow(window: BrowserWindow | null): void {
    mainWindow = window;
}

/**
 * Get the main window reference
 */
export function getMainWindow(): BrowserWindow | null {
    return mainWindow;
}

/**
 * Show and focus the main window
 */
export function showAndFocus(): void {
    if (!mainWindow) return;

    if (mainWindow.isMinimized()) {
        mainWindow.restore();
    }

    mainWindow.show();
    mainWindow.focus();
}

/**
 * Hide/minimize the window
 */
export function hideWindow(): void {
    if (!mainWindow) return;
    mainWindow.hide();
}

/**
 * Check if window is visible and focused
 */
export function isVisible(): boolean {
    if (!mainWindow) return false;
    return mainWindow.isVisible() && !mainWindow.isMinimized();
}

/**
 * Check if window exists
 */
export function hasWindow(): boolean {
    return mainWindow !== null && !mainWindow.isDestroyed();
}
