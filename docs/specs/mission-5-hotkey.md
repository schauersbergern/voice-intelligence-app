# Mission 5: Global Hotkey

## Objective
Enable system-wide keyboard shortcut to activate the app and toggle recording.

## Success Criteria
- [x] Global hotkey works even when app is not focused
- [x] Hotkey brings app to foreground
- [x] Hotkey toggles recording on/off
- [x] Visual feedback when hotkey is pressed
- [x] Hotkey is configurable in settings

## Steps

### 5.1 Register Global Shortcut
In main/index.ts, use Electron's globalShortcut:
```typescript
import { globalShortcut } from 'electron';

// Default: Cmd+Shift+Space (Mac) / Ctrl+Shift+Space (Windows)
globalShortcut.register('CommandOrControl+Shift+Space', () => {
  // Toggle recording
});
```

### 5.2 Implement Toggle Behavior
When hotkey pressed:
1. If window hidden → show and focus window
2. If not recording → start recording
3. If recording → stop recording, process audio

### 5.3 Window Management
Create main/window-manager.ts:
```typescript
function showAndFocus(): void
function hideWindow(): void
function isVisible(): boolean
```

### 5.4 Add IPC for Recording Control
Extend shared/types.ts:
```typescript
interface ElectronAPI {
  // ... existing
  onRecordingToggle: (callback: () => void) => void;
  getRecordingState: () => Promise<boolean>;
}
```

### 5.5 Settings for Hotkey Customization
- Store hotkey preference in electron-store or similar
- Allow user to change in settings page
- Re-register shortcut when changed

### 5.6 Handle App Lifecycle
- Unregister shortcuts on app quit
- Re-register on app focus (optional, for reliability)

## Files to Create/Modify
- main/index.ts (shortcut registration)
- main/window-manager.ts (window visibility control)
- main/shortcuts.ts (shortcut management)
- shared/types.ts (recording control types)
- main/preload.ts (expose recording events)
- renderer/pages/index.tsx (respond to toggle)

## Dependencies
- Mission 4 must be complete (transcription works)

## Platform Notes
- macOS: May need accessibility permissions
- Windows: Works out of the box
- Test with other apps focused to verify global behavior

## Default Hotkey
- Primary: `CommandOrControl+Shift+Space`
- Alternative suggestions for settings:
  - `CommandOrControl+Shift+V` (V for Voice)
  - `CommandOrControl+Option+Space` (Mac)
  - Double-tap Cmd/Ctrl (advanced, needs custom implementation)

## Edge Cases
- What if hotkey conflicts with another app? → Show warning in settings
- What if permission denied on macOS? → Guide user to System Preferences
