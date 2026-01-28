# Mission 1: Foundation Setup

## Objective
Scaffold a minimal Electron + Next.js desktop app using Nextron with TypeScript strict mode.

## Success Criteria
- [ ] App launches and displays a window
- [ ] TypeScript strict mode enabled
- [ ] Basic window management works (open, close, minimize)
- [ ] Project structure matches CLAUDE.md architecture
- [ ] Hot reload works in development

## Steps

### 1.1 Initialize Nextron Project
Use the Nextron TypeScript template as base:
```bash
npx create-nextron-app voice-intelligence-app --example with-typescript
```

If already in directory, adapt the existing structure to Nextron conventions.

### 1.2 Configure TypeScript Strict Mode
Update tsconfig.json:
- `"strict": true`
- `"noImplicitAny": true`
- `"strictNullChecks": true`

### 1.3 Configure Next.js for Electron
In renderer/next.config.js:
- `output: 'export'` (static export required)
- `images: { unoptimized: true }`
- `trailingSlash: true`

### 1.4 Basic Window Configuration
In main/index.ts:
- Window size: 400x600 (compact, floating-style)
- Frame: true (standard window chrome for now)
- resizable: true
- Always on top: false (will be configurable later)

### 1.5 Verify Development Workflow
- `npm run dev` should launch the app
- Changes in renderer/ should hot reload
- Changes in main/ should restart the app

## Files to Create/Modify
- main/index.ts (window management)
- main/preload.ts (empty bridge for now)
- renderer/next.config.js (Electron-compatible config)
- renderer/pages/index.tsx (basic "Hello Voice Intelligence" page)
- tsconfig.json (strict mode)
- shared/types.ts (empty, placeholder)

## Dependencies
None — this is the first mission.

## Notes
- Keep it minimal. No extra packages yet.
- Don't add audio, Whisper, or any features — just the shell.
- Verify it works before moving to Mission 2.
