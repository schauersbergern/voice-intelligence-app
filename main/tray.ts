/**
 * System tray / menu bar integration
 * Provides quick access to settings and app control from the system tray
 */

import { IPC_CHANNELS, type WhisperMode, type EnrichmentMode, type AudioDevice } from '../shared/types';
import { Menu, MenuItemConstructorOptions, Tray, app, nativeImage } from 'electron';
import { getMainWindow } from './window-manager';
import { getAllSettings, saveSetting } from './store';
import { setWhisperMode } from './whisper-handler';
import { setEnrichmentMode } from './enrichment';

let tray: Tray | null = null;
let audioDevices: AudioDevice[] = [];


// Crisp 22x22 microphone icon - white on black (not template, keeps white in dark mode)
const ICON_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAIAAABL1vtsAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAAEsAAAAAQAAASwAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAABagAwAEAAAAAQAAABYAAAAASU13RgAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAUJJREFUOBG1UbuKg1AU9Jk0qaxsLATFMj8h+kX+jj+ggqCl+Bd2ips6jViJqLuTXBDRcwPJ7p5CZo5n5s49VxQEQRRFfD+vX+ohlz4//K+USCG/8FJV1fM827Zvt9uyLOTkqz3IshyG4fezAEDftjBNcxgGZgEAyrPgrvN8Pq8hAUBJCzRpC0mScP56fwBQNEkX+oa+7wdB4DiOoiiQzfNsGEbf93Vd71wQkDbWNK1t23EcmQAAFM2dnlFpvfD29zRNXdfhy5pIsaXbSWA6RVVVuq4nScKm4zgGRXMnZlQmU9zvd8uyLpdLlmVlWZ5Op6ZpgI8WDzlpwUZd18X5KICjmHUgfyycV0VRXK9X/AXgzTz6vBQQ53n+9SwA5nU0epUCD5mmaRRFkGEX6wMfXbgpiFGqhRT0o1LD/9bjrfK9A38AcKyHRTqTgH4AAAAASUVORK5CYII=';

// Recording indicator - same icon for now
const ICON_RECORDING_DATA_URL = ICON_DATA_URL;

/**
 * Initialize the system tray icon and menu.
 * Sets up the initial icon, tooltip, and builds the context menu.
 */
export function createTray(): void {
    try {
        // Create icon from data URL for reliability
        const icon = nativeImage.createFromDataURL(ICON_DATA_URL);
        // Don't use template image - keep white icon for dark menu bar
        icon.setTemplateImage(false);

        tray = new Tray(icon);
        tray.setToolTip('Voice Intelligence');

        // Build initial menu
        rebuildMenu();
    } catch (err) {
        console.error('Failed to create tray:', err);
    }
}

/**
 * Rebuild the context menu based on current application settings.
 * This ensures the menu reflects the current state (e.g., Local vs API mode).
 */
export async function rebuildMenu(): Promise<void> {
    if (!tray) return;

    try {
        const settings = await getAllSettings();
        const isLocal = settings.whisperMode === 'local';

        const menuTemplate: MenuItemConstructorOptions[] = [
            { label: '🎙 Voice Intelligence', enabled: false },
            { type: 'separator' },
            {
                label: 'Microphone',
                submenu: createMicrophoneSubmenu(settings.microphoneId)
            },
            {
                label: 'Transcription Engine',
                submenu: [
                    {
                        label: 'Local (Offline)',
                        type: 'radio',
                        checked: isLocal,
                        click: () => handleEngineChange('local')
                    },
                    {
                        label: 'OpenAI Whisper API',
                        type: 'radio',
                        checked: !isLocal,
                        click: () => handleEngineChange('api')
                    },
                ]
            },
        ];

        // Add language submenu only when Local mode is active
        if (isLocal) {
            menuTemplate.push({
                label: 'Language',
                submenu: [
                    { label: 'English', type: 'radio', checked: settings.whisperLanguage === 'english', click: () => handleLanguageChange('english') },
                    { label: 'German', type: 'radio', checked: settings.whisperLanguage === 'german', click: () => handleLanguageChange('german') },
                    { label: 'Spanish', type: 'radio', checked: settings.whisperLanguage === 'spanish', click: () => handleLanguageChange('spanish') },
                    { label: 'French', type: 'radio', checked: settings.whisperLanguage === 'french', click: () => handleLanguageChange('french') },
                    { label: 'Italian', type: 'radio', checked: settings.whisperLanguage === 'italian', click: () => handleLanguageChange('italian') },
                    { label: 'Portuguese', type: 'radio', checked: settings.whisperLanguage === 'portuguese', click: () => handleLanguageChange('portuguese') },
                    { label: 'Dutch', type: 'radio', checked: settings.whisperLanguage === 'dutch', click: () => handleLanguageChange('dutch') },
                    { label: 'Polish', type: 'radio', checked: settings.whisperLanguage === 'polish', click: () => handleLanguageChange('polish') },
                    { label: 'Auto-detect', type: 'radio', checked: settings.whisperLanguage === 'auto', click: () => handleLanguageChange('auto') },
                ]
            });
        }

        // Enrichment menu: only available in API mode
        if (!isLocal) {
            menuTemplate.push({
                label: 'Enrichment',
                submenu: [
                    { label: 'Off', type: 'radio', checked: settings.enrichmentMode === 'none', click: () => handleEnrichmentChange('none') },
                    { label: 'Clean', type: 'radio', checked: settings.enrichmentMode === 'clean', click: () => handleEnrichmentChange('clean') },
                    { label: 'Format', type: 'radio', checked: settings.enrichmentMode === 'format', click: () => handleEnrichmentChange('format') },
                    { label: 'Summarize', type: 'radio', checked: settings.enrichmentMode === 'summarize', click: () => handleEnrichmentChange('summarize') },
                ]
            });
        } else {
            menuTemplate.push({
                label: 'Enrichment',
                submenu: [
                    { label: 'Requires Cloud Mode', enabled: false },
                ]
            });
        }

        menuTemplate.push(
            { type: 'separator' },
            { label: 'Show Window', click: showWindow },
            {
                label: 'Quit',
                click: () => {
                    // tray?.destroy(); // Let app.quit handle cleanup via will-quit/before-quit if needed
                    app.quit();
                }
            },
        );

        const contextMenu = Menu.buildFromTemplate(menuTemplate);
        tray.setContextMenu(contextMenu);
    } catch (err) {
        console.error('Failed to build tray menu:', err);
    }
}

/**
 * Create microphone submenu items
 */
function createMicrophoneSubmenu(selectedId: string): MenuItemConstructorOptions[] {
    if (audioDevices.length === 0) {
        return [{ label: 'No devices found', enabled: false }];
    }

    return audioDevices.map(device => ({
        label: device.label || `Microphone ${device.deviceId}`,
        type: 'radio',
        checked: device.deviceId === selectedId || (selectedId === 'default' && device.deviceId === 'default'),
        click: () => handleMicrophoneChange(device.deviceId)
    }));
}

/**
 * Update the list of available audio devices
 * Called from renderer via IPC
 */
export async function updateAudioDevices(devices: AudioDevice[]): Promise<void> {
    // Only update if changed deep equality check could be done but for now just length or simple check
    // Simple check to avoid constant rebuilding:
    const isDifferent = devices.length !== audioDevices.length ||
        devices.some((d, i) => d.deviceId !== audioDevices[i].deviceId || d.label !== audioDevices[i].label);

    if (isDifferent) {
        audioDevices = devices;
        await rebuildMenu();
    }
}

/**
 * Update the tray icon to reflect the current recording state.
 * @param recording - Whether recording is currently active
 */
export function updateTrayIcon(recording: boolean): void {
    if (!tray) return;

    const dataUrl = recording ? ICON_RECORDING_DATA_URL : ICON_DATA_URL;
    const icon = nativeImage.createFromDataURL(dataUrl);
    icon.setTemplateImage(!recording); // Template only for non-recording state

    tray.setImage(icon);

    // Update tooltip to show recording state
    tray.setToolTip(recording ? 'Voice Intelligence (Recording...)' : 'Voice Intelligence');
}

/**
 * Show and focus the main window
 */
function showWindow(): void {
    const win = getMainWindow();
    if (win) {
        win.show();
        win.focus();
    }
}

/**
 * Handle transcription engine change from menu
 */
async function handleEngineChange(mode: WhisperMode): Promise<void> {
    await saveSetting('whisperMode', mode);
    setWhisperMode(mode);

    // Notify renderer of change
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
        win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, { whisperMode: mode });
    }

    // Rebuild menu to show/hide language submenu
    await rebuildMenu();
}

/**
 * Handle language change from menu
 */
async function handleLanguageChange(lang: string): Promise<void> {
    await saveSetting('whisperLanguage', lang);

    // Notify renderer
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
        win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, { whisperLanguage: lang });
    }
}

/**
 * Handle enrichment mode change from menu
 */
async function handleEnrichmentChange(mode: EnrichmentMode): Promise<void> {
    await saveSetting('enrichmentMode', mode);
    setEnrichmentMode(mode);

    // Notify renderer
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
        win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, { enrichmentMode: mode });
    }
}

/**
 * Handle microphone change from menu.
 * Persists selection to store and notifies all renderer windows.
 * @param deviceId - The device ID of the selected microphone
 */
async function handleMicrophoneChange(deviceId: string): Promise<void> {
    await saveSetting('microphoneId', deviceId);

    // Notify renderer
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
        win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, { microphoneId: deviceId });
    }
}

/**
 * Destroy the system tray instance.
 * Call this when the application is quitting.
 */
export function destroyTray(): void {
    if (tray) {
        tray.destroy();
        tray = null;
    }
}
