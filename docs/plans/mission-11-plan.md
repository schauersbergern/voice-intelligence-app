# Mission 11: Menu Bar, Configurable Hotkey & Background Operation

## Goal

Add system tray/menu bar integration, make the global hotkey configurable, and ensure the app runs reliably in the background.

---

## Proposed Changes

### 1. Background Operation (R-003)

> [!IMPORTANT]
> This must be implemented first as it's the foundation for menu bar functionality.

#### [MODIFY] [background.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/background.ts)

**Window close interception** — Prevent window from being destroyed; hide it instead:

```typescript
// In createWindow(), after creating mainWindow:
mainWindow.on('close', (event) => {
    // Prevent actual close, just hide
    event.preventDefault();
    mainWindow.hide();
});
```

**App lifecycle** — Don't quit when windows close:

```diff
 app.on('window-all-closed', () => {
-    if (process.platform !== 'darwin') {
-        app.quit();
-    }
+    // Don't quit - keep running in tray
 });
```

**Sleep/wake handling** — Re-register shortcuts after system wake:

```typescript
import { powerMonitor } from 'electron';

powerMonitor.on('resume', () => {
    registerGlobalShortcuts();
});
```

**Add IPC handler for hotkey updates**:

```typescript
ipcMain.handle(IPC_CHANNELS.SET_HOTKEY, async (_event, accelerator: string) => {
    const success = updateHotkey(accelerator);
    if (success) {
        await saveSetting('hotkey', accelerator);
    }
    return success; // Return true/false for conflict detection
});
```

---

### 2. Menu Bar / System Tray (R-001)

#### [NEW] [tray.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/tray.ts)

Create a new module for tray management:

```typescript
import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'path';
import { getMainWindow } from './window-manager';
import { getAllSettings, saveSetting } from './store';

let tray: Tray | null = null;
let isRecording = false;

export function createTray(): void {
    const iconPath = path.join(__dirname, '../resources/iconTemplate.png');
    tray = new Tray(nativeImage.createFromPath(iconPath));
    tray.setToolTip('Voice Intelligence');
    rebuildMenu();
}

export async function rebuildMenu(): Promise<void> {
    if (!tray) return;
    
    const settings = await getAllSettings();
    const isLocal = settings.whisperMode === 'local';
    
    const contextMenu = Menu.buildFromTemplate([
        { label: '🎙 Voice Intelligence', enabled: false },
        { type: 'separator' },
        {
            label: 'Transcription Engine',
            submenu: [
                { label: 'Local (Offline)', type: 'radio', checked: isLocal, click: () => handleEngineChange('local') },
                { label: 'OpenAI Whisper API', type: 'radio', checked: !isLocal, click: () => handleEngineChange('api') },
            ]
        },
        ...(isLocal ? [{
            label: 'Language',
            submenu: [
                { label: 'English', type: 'radio' as const, checked: settings.whisperLanguage === 'english', click: () => handleLanguageChange('english') },
                { label: 'German', type: 'radio' as const, checked: settings.whisperLanguage === 'german', click: () => handleLanguageChange('german') },
                { label: 'Spanish', type: 'radio' as const, checked: settings.whisperLanguage === 'spanish', click: () => handleLanguageChange('spanish') },
                { label: 'French', type: 'radio' as const, checked: settings.whisperLanguage === 'french', click: () => handleLanguageChange('french') },
                { label: 'Auto-detect', type: 'radio' as const, checked: settings.whisperLanguage === 'auto', click: () => handleLanguageChange('auto') },
            ]
        }] : []),
        {
            label: 'Enrichment',
            submenu: [
                { label: 'Off', type: 'radio', checked: settings.enrichmentMode === 'none', click: () => handleEnrichmentChange('none') },
                { label: 'Clean', type: 'radio', checked: settings.enrichmentMode === 'clean', click: () => handleEnrichmentChange('clean') },
                { label: 'Format', type: 'radio', checked: settings.enrichmentMode === 'format', click: () => handleEnrichmentChange('format') },
                { label: 'Summarize', type: 'radio', checked: settings.enrichmentMode === 'summarize', click: () => handleEnrichmentChange('summarize') },
            ]
        },
        { type: 'separator' },
        { label: 'Show Window', click: () => showWindow() },
        { label: 'Quit', click: () => { tray?.destroy(); app.exit(0); } },
    ]);
    
    tray.setContextMenu(contextMenu);
}

export function updateTrayIcon(recording: boolean): void {
    if (!tray) return;
    isRecording = recording;
    const iconName = recording ? 'icon-recording.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, '../resources', iconName);
    tray.setImage(nativeImage.createFromPath(iconPath));
}

function showWindow(): void {
    const win = getMainWindow();
    if (win) {
        win.show();
        win.focus();
    }
}

// Handler functions that update settings and rebuild menu
async function handleEngineChange(mode: 'local' | 'api'): Promise<void> {
    await saveSetting('whisperMode', mode);
    await rebuildMenu(); // Rebuild to show/hide language submenu
}

async function handleLanguageChange(lang: string): Promise<void> {
    await saveSetting('whisperLanguage', lang);
}

async function handleEnrichmentChange(mode: string): Promise<void> {
    await saveSetting('enrichmentMode', mode);
}
```

**Key design**: `rebuildMenu()` is called whenever settings change that affect menu visibility (e.g., switching between Local/API mode shows/hides the Language submenu).

#### Icon Assets

Create in `resources/`:
- `iconTemplate.png` (16x16) — Default state, macOS template
- `iconTemplate@2x.png` (32x32) — Retina version
- `icon-recording.png` (16x16) — Red recording indicator

---

### 3. Configurable Hotkey (R-002)

#### [MODIFY] [shortcuts.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/shortcuts.ts)

```typescript
import { globalShortcut, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../shared/types';
import { initStore } from './store';

let mainWindow: BrowserWindow | null = null;
let currentHotkey: string = 'Alt+Space'; // Default

export async function initializeShortcuts(window: BrowserWindow): Promise<void> {
    mainWindow = window;
    
    // Load hotkey from store
    const store = await initStore();
    currentHotkey = store.get('hotkey') || 'Alt+Space';
    
    registerGlobalShortcuts();
}

export function registerGlobalShortcuts(): boolean {
    try {
        globalShortcut.unregisterAll();
        
        const success = globalShortcut.register(currentHotkey, () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send(IPC_CHANNELS.TOGGLE_RECORDING);
            }
        });
        
        if (!success) {
            console.error('Failed to register hotkey:', currentHotkey);
        }
        return success;
    } catch (err) {
        console.error('Error registering hotkey:', err);
        return false;
    }
}

// Returns true if successful, false if conflict/error
export function updateHotkey(accelerator: string): boolean {
    currentHotkey = accelerator;
    return registerGlobalShortcuts();
}

export function cleanupShortcuts(): void {
    globalShortcut.unregisterAll();
}
```

#### [MODIFY] [store.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/store.ts)

Add hotkey to schema:

```diff
 const schema = {
     whisperMode: { type: 'string', enum: ['local', 'api'], default: 'local' },
     whisperLanguage: { type: 'string', default: 'english' },
     enrichmentMode: { type: 'string', enum: ['none', 'clean', 'format', 'summarize', 'action', 'email', 'notes', 'commit', 'tweet', 'slack'], default: 'none' },
     apiKey: { type: 'string', default: '' },
-    llmProvider: { type: 'string', enum: ['openai', 'anthropic'], default: 'openai' }
+    llmProvider: { type: 'string', enum: ['openai', 'anthropic'], default: 'openai' },
+    hotkey: { type: 'string', default: 'Alt+Space' }
 } as const;
```

#### [MODIFY] [types.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/shared/types.ts)

```diff
 export interface AppSettings {
     whisperMode: WhisperMode;
     whisperLanguage: string;
     enrichmentMode: EnrichmentMode;
     apiKey: string;
     llmProvider: LLMProvider;
+    hotkey: string;
 }

 export const IPC_CHANNELS = {
     // ... existing channels
+    SET_HOTKEY: 'settings:set-hotkey',
 } as const;

 export interface ElectronAPI {
     // ... existing methods
+    setHotkey: (accelerator: string) => Promise<boolean>; // Returns success/failure
 }
```

#### [MODIFY] [preload.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/preload.ts)

```typescript
setHotkey: (accelerator: string): Promise<boolean> => 
    ipcRenderer.invoke(IPC_CHANNELS.SET_HOTKEY, accelerator),
```

#### [NEW] [HotkeyInput.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/components/HotkeyInput.tsx)

React component for hotkey capture with:
- Display current hotkey in human-readable format (⌥ Space, ⌘⇧V, etc.)
- "Click to change" button → enters listening mode
- Captures keydown, builds accelerator string
- Escape cancels
- Shows warning toast if `setHotkey()` returns false (conflict)

#### [MODIFY] [index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx)

- **Remove** all Enter key handling for recording
- Add `HotkeyInput` component to settings panel
- Load hotkey from settings on mount

---

## Platform-Specific Considerations

| Feature | macOS | Windows |
|---------|-------|---------|
| Tray location | Menu bar (top-right) | System tray (bottom-right) |
| Default hotkey | `Alt+Space` | `Alt+Space` |
| Icon format | Template PNG (auto-themes) | Standard PNG |
| Window hide | `mainWindow.hide()` | `mainWindow.hide()` |

> [!WARNING]
> On Windows, `Alt+Space` opens the window system menu. If `setHotkey()` returns false due to conflict, show a warning suggesting `Ctrl+Space` as an alternative.

---

## Verification Plan

### Manual Verification
1. Launch app → tray icon appears
2. Close window → app stays running in tray
3. Click "Show Window" → window appears
4. Change transcription engine from tray → setting updates, language menu shows/hides
5. Change hotkey in settings → new hotkey works immediately
6. Try conflicting hotkey → warning shown, old hotkey retained
7. Restart app → hotkey persists
8. Sleep/wake cycle → hotkey still works
9. Use hotkey while in another app → recording starts
