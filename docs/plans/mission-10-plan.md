# Mission 10: Advanced UX & Persistence - Implementation Plan

## Goal Description
Implement critical UX improvements to enable a seamless "zero-click" voice-to-text workflow. This includes persisting user settings, simplifying the UI (unified API key, OpenAI-only), and adding advanced global hotkey features (Push-to-Talk) and auto-paste functionality.

## User Review Required
> [!IMPORTANT]
> **New Native Dependencies**: This mission introduces `uiohook-napi` (for global key events) and `@nut-tree/nut-js` (for keyboard simulation). These require:
> 1.  Rebuilding native modules (`npm run postinstall` or `electron-builder install-app-deps`).
> 2.  **macOS Accessibility Permissions**: The app will request accessibility permissions on first run to intercept global keystrokes and simulate paste.

> [!WARNING]
> **Push-to-Talk Limitations**: Global keydown/keyup detection on macOS requires Accessibility permissions. If denied, the feature will not work. We must handle this gracefully.

> [!CAUTION]
> **Native Module Risks**: `uiohook-napi` and `nut.js` rely on native bindings. Build failures are common.
> - **Mitigation**: We will ensure `electron-builder install-app-deps` is run. If native modules fail to load in production, the app should fall back to non-PTT mode (standard toggle) rather than crashing.

> [!NOTE]
> **Scope Clarification**: This plan implements R-001 to R-008 from `mission-10-requirements.md`. Sound Feedback and Tray Icon (mentioned in previous task lists) are excluded as they are not in the current requirements spec.

## Proposed Changes

### Dependencies
#### [MODIFY] package.json
- Add `electron-store` (Persistence)
- Add `uiohook-napi` (Global Keyboard Hook)
- Add `@nut-tree/nut-js` (Auto-Paste/Keyboard Simulation)

### Main Process (Electron)

#### [NEW] main/store.ts
- Initialize `electron-store`.
- Define schema for settings:
  - `whisperMode`: 'local' | 'api' (default: 'local')
  - `whisperLanguage`: string (default: 'english')
  - `enrichmentMode`: string (default: 'none')
  - `apiKey`: string (unified)
  - `llmProvider`: 'openai' (fixed)

#### [MODIFY] main/background.ts
- Initialize store on launch.
- Register IPC handlers for getting/saving settings.
- Initialize `uiohook-napi` for global key listening.
- Handle Accessibility permission checks.

#### [MODIFY] main/shortcuts.ts
- Refactor to support "Push-to-Talk" logic (keydown starts, keyup stops).
- Use `uiohook-napi` instead of `globalShortcut` for this specific feature (standard `globalShortcut` doesn't support keyup).

#### [MODIFY] main/automation.ts (NEW)
- Implement `triggerPaste()` using `nut.js`.
- Logic: Simulate `Cmd+V`.

### Renderer Process (React)

#### [MODIFY] renderer/pages/index.tsx
- Remove "LLM Provider" dropdown (Hardcode OpenAI).
- Merge "API Key" fields into one Unified Key.
- Load settings from IPC on mount.
- Save settings to IPC on change.
- Disable Record button if model loading (already partially done, need to enforce strict state).

#### [MODIFY] shared/types.ts
- Update types for Settings object.

## Verification Plan

### Automated Tests
- Verify native module build: `npm run postinstall`
- Verify app launch: `npm run dev`

### Manual Verification
1.  **Persistence**:
    - Change settings (e.g., set Language to German, Mode to API).
    - Restart app.
    - Verify settings are preserved.
2.  **Unified API Key**:
    - Enter key in new field.
    - Run API transcription -> Verify success.
    - Run Enrichment -> Verify success (using same key).
3.  **Push-to-Talk**:
    - Hold `Cmd+Shift+Space`.
    - Speak.
    - Release.
    - Verify recording stops and transcription starts.
4.  **Auto-Paste** (Magic Moment):
    - Focus TextEdit.
    - Hold hotkey, speak, release.
    - Verify text appears in TextEdit automatically.
