# Mission 5: Global Hotkey Implementation Plan

## Goal

Enable system-wide keyboard shortcut (Cmd+Shift+Space or Ctrl+Shift+Space) to activate the app and toggle recording.

---

## Proposed Changes

### Main Process - Window Manager

#### [NEW] [window-manager.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/window-manager.ts)

Window visibility control:
- `showAndFocus()` - bring window to front
- `hideWindow()` - minimize/hide window
- `isVisible()` - check if window is visible
- `getMainWindow()` - get reference to main window

---

### Main Process - Shortcuts

#### [NEW] [shortcuts.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/shortcuts.ts)

Global shortcut management:
- `registerGlobalShortcuts()` - register default hotkey
- `unregisterAllShortcuts()` - cleanup on quit
- Default hotkey: `CommandOrControl+Shift+Space`
- Sends event to renderer to toggle recording

---

### Shared Types

#### [MODIFY] [types.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/shared/types.ts)

Add recording control IPC:
```typescript
IPC_CHANNELS.TOGGLE_RECORDING = 'recording:toggle'
IPC_CHANNELS.GET_RECORDING_STATE = 'recording:get-state'
IPC_CHANNELS.SET_RECORDING_STATE = 'recording:set-state'

interface ElectronAPI {
  onRecordingToggle: (callback: () => void) => () => void;
  setRecordingState: (isRecording: boolean) => Promise<void>;
  getRecordingState: () => Promise<boolean>;
}
```

---

### Main Process - Background

#### [MODIFY] [background.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/background.ts)

- Initialize shortcuts after window creation
- Store window reference in window-manager
- Unregister shortcuts on app quit
- Add IPC handlers for recording state

---

### Preload Script

#### [MODIFY] [preload.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/preload.ts)

Expose recording toggle event listener:
```typescript
onRecordingToggle: (callback: () => void) => {
  ipcRenderer.on(IPC_CHANNELS.TOGGLE_RECORDING, callback);
  return () => ipcRenderer.removeListener(IPC_CHANNELS.TOGGLE_RECORDING, callback);
}
```

---

### Renderer - UI

#### [MODIFY] [index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx)

- Listen for `onRecordingToggle` event
- Toggle recording when event received
- Visual feedback when toggled via hotkey

---

## File Summary

| Action | File | Description |
|--------|------|-------------|
| NEW | `main/window-manager.ts` | Window visibility control |
| NEW | `main/shortcuts.ts` | Global shortcut registration |
| MODIFY | `shared/types.ts` | Recording control IPC |
| MODIFY | `main/background.ts` | Integrate shortcuts |
| MODIFY | `main/preload.ts` | Expose toggle event |
| MODIFY | `renderer/pages/index.tsx` | Listen for toggle |

---

## Verification Plan

### TypeScript Check
```bash
npx tsc --noEmit
```

### Manual Testing (in Electron App)

1. **Start app**: `npm run dev`
2. **Focus another app** (e.g., Terminal or Chrome)
3. **Press Cmd+Shift+Space** (Mac) or Ctrl+Shift+Space (Windows/Linux)
4. Expected: App window comes to foreground, recording starts
5. **Press hotkey again**
6. Expected: Recording stops, transcription processes
7. **Verify visual feedback**: Recording indicator should pulse when recording via hotkey

### Edge Cases

1. **App already recording** → hotkey should stop recording
2. **App in foreground** → should just toggle recording, no window management needed
3. **App closed** → hotkey won't work (expected, app must be running)

---

## Design Decisions

1. **No persist for hotkey setting**: For simplicity, using fixed default hotkey. Customization can be added in a future mission.

2. **Recording state in main process**: Need to track recording state in main to handle hotkey toggles correctly. Renderer syncs state via IPC.

3. **Event-based toggle**: Using IPC events (not invoke/handle) for recording toggle since it's initiated from main process.
