# Mission 2: IPC Layer - Implementation Plan

## Objective

Establish secure, type-safe communication between Electron main process and Next.js renderer using `contextBridge` and `ipcRenderer.invoke`.

## Design Decisions

### Type Safety Strategy

Define types in `shared/types.ts` that are imported by both:
- **Main process**: For `ipcMain.handle` handlers
- **Preload script**: For the API object exposed via `contextBridge`
- **Renderer**: Via declaration file augmenting `Window`

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Renderer  │────▶│   Preload   │────▶│    Main     │
│  (React UI) │     │ (Bridge)    │     │ (Handlers)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                  ┌────────▼────────┐
                  │  shared/types.ts │
                  │  (Single Source) │
                  └─────────────────┘
```

### Security Principles

1. **One method per IPC channel** - Never expose generic `send` or `invoke`
2. **No raw ipcRenderer** - All calls wrapped in explicit typed functions
3. **Argument whitelisting** - Future methods will validate inputs
4. **Request/response only** - Use `invoke`/`handle` pattern (no `send`/`on` for now)

---

## Proposed Changes

### Shared Types

#### [MODIFY] [types.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/shared/types.ts)

Define the `ElectronAPI` interface that describes all IPC methods available to renderer:

```typescript
// IPC API exposed to renderer via contextBridge
export interface ElectronAPI {
  // Test communication (Mission 2)
  ping: () => Promise<string>;
  
  // Placeholder for future missions
  // audio:start-recording, audio:stop-recording, etc.
}

// IPC channel names as const for type safety
export const IPC_CHANNELS = {
  PING: 'app:ping',
} as const;
```

---

### Main Process

#### [MODIFY] [index.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/index.ts)

**Critical configuration check**: Verify BrowserWindow is configured with preload script:

```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

const mainWindow = new BrowserWindow({
  width: 400,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  }
});
```

> [!IMPORTANT]
> Without the `preload` configuration, the preload script will NOT execute and IPC will fail silently. This is the most common misconfiguration issue.

Register IPC handlers using `ipcMain.handle`:

```typescript
import { IPC_CHANNELS } from '../shared/types';

// Register IPC handlers
function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PING, async () => {
    console.log('Ping received'); // Debug log - remove after verification
    return 'pong';
  });
}

// Call registerIpcHandlers() in app.whenReady()
```

> [!NOTE]
> Per CLAUDE.md, `ipcMain.handle` registration could live in a separate `main/ipc-handlers.ts` file for organization. For Mission 2, keeping it in `index.ts` is simpler. We'll refactor when more handlers are added.

---

### Preload Script

#### [MODIFY] [preload.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/preload.ts)

> [!IMPORTANT]
> This file requires explicit approval per CLAUDE.md guardrails.

Replace placeholder with typed implementation:

```typescript
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, type ElectronAPI } from '../shared/types';

console.log('Preload script loaded'); // Debug log - remove after verification

// Implement all API methods with explicit channel binding
const api: ElectronAPI = {
  ping: () => ipcRenderer.invoke(IPC_CHANNELS.PING),
};

contextBridge.exposeInMainWorld('electronAPI', api);
```

**Security notes:**
- Each method is explicitly bound to its channel
- No generic `invoke` or `send` exposed
- `ipcRenderer.on` NOT exposed (no untriggered events to renderer)

---

### Renderer Types

#### [NEW] [electron.d.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/types/electron.d.ts)

Declaration file to augment the global `Window` type:

```typescript
import type { ElectronAPI } from '../../shared/types';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
```

> [!TIP]
> This gives full autocomplete and type checking when using `window.electronAPI.ping()` in React components.

---

### Renderer UI

#### [MODIFY] [index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx)

Add test button to verify IPC works:

```tsx
import { useState } from 'react';

const [pingResult, setPingResult] = useState<string | null>(null);

async function handlePing() {
  // Check if API is available (catches misconfiguration)
  if (!window.electronAPI) {
    setPingResult('ERROR: Electron API not available');
    return;
  }

  try {
    console.log('Calling ping...'); // Debug log - remove after verification
    const result = await window.electronAPI.ping();
    setPingResult(result);
  } catch (error) {
    setPingResult(`ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// In JSX:
<div>
  <button onClick={handlePing}>Test IPC</button>
  {pingResult && <p>Response: {pingResult}</p>}
</div>
```

**Error handling notes:**
- Checks if `window.electronAPI` exists (catches missing preload)
- Wraps in try/catch for IPC failures
- User-friendly error messages for debugging

---

## Verification Plan

### Automated Tests

No automated tests for Mission 2. Manual verification is faster for this scope.

### Manual Verification

1. **TypeScript compiles**
   ```bash
   npx tsc --noEmit
   ```
   Expected: 0 errors

2. **Type safety (before running app)**
   - Open `renderer/pages/index.tsx` in VSCode
   - Type `window.electronAPI.` and verify autocomplete shows `ping`
   - Hover over `window.electronAPI` - should show type `ElectronAPI`
   - Try typing `window.electronAPI.nonexistent()` - should show TypeScript error

3. **App launches**
   ```bash
   npm run dev
   ```
   Expected: Window opens with UI

4. **Console verification (DevTools)**
   - Open DevTools (View → Toggle Developer Tools)
   - Console should show: `"Preload script loaded"`
   - No errors should be present

5. **IPC works**
   - Click "Test IPC" button
   - Console should show: `"Calling ping..."` → `"Ping received"` (in main process logs if visible)
   - UI should display: `"Response: pong"`

6. **Error handling works**
   - If you see `"ERROR: Electron API not available"`, the preload script isn't configured correctly
   - Verify BrowserWindow `webPreferences.preload` path is correct

---

## Implementation Order

1. Update `shared/types.ts` with `ElectronAPI` interface and `IPC_CHANNELS` constants
2. Verify `main/index.ts` has correct BrowserWindow webPreferences (preload path, contextIsolation)
3. Modify `main/preload.ts` to expose typed API (**requires approval per CLAUDE.md**)
4. Modify `main/index.ts` to register IPC handler (call `registerIpcHandlers()` in app.whenReady())
5. Create `renderer/types/electron.d.ts` for Window typing
6. Verify TypeScript recognizes `window.electronAPI` type in VSCode
7. Modify `renderer/pages/index.tsx` to add test button with error handling
8. Test with `npm run dev`
9. Verify console logs and ping/pong response
10. Remove debug console.log statements after verification

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| MODIFY | [shared/types.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/shared/types.ts) | IPC interface + channel constants |
| MODIFY | [main/preload.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/preload.ts) | Secure contextBridge implementation |
| MODIFY | [main/index.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/index.ts) | IPC handler registration |
| NEW | [renderer/types/electron.d.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/types/electron.d.ts) | Window type augmentation |
| MODIFY | [renderer/pages/index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx) | Test button UI |
