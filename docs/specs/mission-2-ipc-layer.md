# Mission 2: IPC Layer

## Objective
Establish secure, type-safe communication between Electron main process and Next.js renderer.

## Success Criteria
- [ ] contextBridge exposes typed API to renderer
- [ ] Renderer can call main process and receive responses
- [ ] All IPC channels are typed in shared/types.ts
- [ ] No direct ipcRenderer exposure (security)

## Steps

### 2.1 Define IPC Types
In shared/types.ts, define:
```typescript
interface ElectronAPI {
  // Will be expanded in later missions
  ping: () => Promise<string>;
}
```

### 2.2 Implement Preload Script
In main/preload.ts:
- Use contextBridge.exposeInMainWorld
- Expose only invoke-style methods (request/response)
- Name the global: `window.electronAPI`

### 2.3 Register IPC Handlers
In main/index.ts (or separate main/ipc-handlers.ts):
- Register handler for 'ping' channel
- Return 'pong' to verify communication works

### 2.4 Create Type Declaration
Create renderer/types/electron.d.ts:
```typescript
interface Window {
  electronAPI: import('../../shared/types').ElectronAPI;
}
```

### 2.5 Test from Renderer
In renderer/pages/index.tsx:
- Add button that calls `window.electronAPI.ping()`
- Display result to confirm IPC works

## Files to Create/Modify
- shared/types.ts (IPC type definitions)
- main/preload.ts (contextBridge implementation)
- main/index.ts (IPC handler registration)
- renderer/types/electron.d.ts (window type augmentation)
- renderer/pages/index.tsx (test button)

## Dependencies
- Mission 1 must be complete

## Security Notes
- NEVER use `nodeIntegration: true`
- NEVER expose `ipcRenderer.on` directly — wrap in specific listeners
- All IPC must go through contextBridge
