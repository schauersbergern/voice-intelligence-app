# Mission 1: Foundation Setup - Implementation Plan

## Objective

Scaffold a minimal Electron + Next.js desktop app using Nextron with TypeScript strict mode, targeting macOS as the primary platform.

## Research Summary

### Nextron Project Structure

Based on research, Nextron projects follow this standard structure:

```
project-root/
├── main/                    # Electron main process
│   ├── index.ts            # App entry, window management
│   └── preload.ts          # Secure IPC bridge via contextBridge
├── renderer/               # Next.js frontend
│   ├── pages/              # Next.js pages
│   │   ├── _app.tsx        # Next.js app wrapper
│   │   └── index.tsx       # Main page
│   ├── next.config.js      # Next.js Electron-compatible config
│   └── tsconfig.json       # Renderer-specific TypeScript config
├── shared/                 # Shared types between processes
│   └── types.ts
├── resources/              # App icons, Whisper models, assets
├── package.json            # Dependencies and scripts
└── tsconfig.json           # Root TypeScript configuration
```

**Note**: `electron-builder.yml` will be added in Mission 8 (Packaging).

### Key Considerations

1. **Initialization Approach**: Two options exist:
   - **Option A**: Run `npx create-nextron-app` in a temp directory, then migrate files
   - **Option B**: Manually scaffold using Nextron's conventions (more control, fewer conflicts)

2. **Recommendation**: Given the project already has a directory structure (`main/`, `renderer/`, `shared/`, `resources/`), **Option B (manual scaffolding)** is preferred because:
   - Avoids conflicts with existing git history
   - Gives full control over dependencies (minimal footprint goal)
   - Matches the custom architecture defined in CLAUDE.md
   - Easier to maintain TypeScript strict mode from the start

---

## Proposed Changes

### Root Configuration

#### [NEW] [package.json](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/package.json)
- Define project metadata (name, version, author)
- Add **minimal production dependencies**:
  - `next`, `react`, `react-dom` - Frontend framework
  - `electron` - Desktop runtime
- Add dev dependencies:
  - `nextron` - CLI for Electron + Next.js dev/build (dev-only)
  - `typescript` - Type checking
  - `electron-builder` - App packaging (used by Nextron)
  - `@types/node`, `@types/react` - Type definitions
- Scripts (explicit commands):
  ```json
  {
    "dev": "nextron dev",
    "build": "nextron build --mac",
    "test": "echo \"No tests yet\" && exit 0"
  }
  ```
- Expected install size: ~500MB (Electron binary is large)

#### [NEW] [tsconfig.json](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/tsconfig.json)
- Enable `strict: true` with all strict flags
- Set appropriate target (ES2020+) and module resolution (Node16)
- **Path aliases**: Only `shared/` can be imported from both processes. `main/` and `renderer/` are isolated due to Electron's process boundary. No cross-process imports.
- Separate `renderer/tsconfig.json` will extend this with JSX settings

---

### Main Process (Electron)

#### [NEW] [main/index.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/index.ts)
- Create BrowserWindow (400x600, resizable, centered on screen)
- **Environment detection**: Use `app.isPackaged` to determine dev vs prod
  ```typescript
  const isDev = !app.isPackaged;
  const url = isDev
    ? 'http://localhost:3000'  // Next.js dev server
    : `file://${path.join(__dirname, '../renderer/out/index.html')}`; // Static export
  ```
- Load appropriate URL based on environment
- Handle app lifecycle events (ready, window-all-closed, activate)
- Standard window chrome (frameless can be added later)

#### [NEW] [main/preload.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/preload.ts)
- Empty placeholder using `contextBridge`
- Stub for future IPC bridge
- **CRITICAL**: Security boundary - no raw `ipcRenderer` exposure

---

### Renderer Process (Next.js)

#### [NEW] [renderer/next.config.js](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/next.config.js)
- `output: 'export'` - Required for Electron static loading
- `distDir: 'out'` - Output directory for static export (default, but explicit is better)
- `images: { unoptimized: true }` - No Image Optimization API in Electron
- `trailingSlash: true` - Required for file:// protocol compatibility

#### [NEW] [renderer/pages/index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx)
- Simple "Voice Intelligence" title page
- Basic styling placeholder
- React functional component with TypeScript

#### [NEW] [renderer/pages/_app.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/_app.tsx)
- Standard Next.js app wrapper
- Global styles import point

#### [NEW] [renderer/tsconfig.json](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/tsconfig.json)
- Extends root tsconfig
- React/Next.js specific JSX settings

---

### Shared Types

#### [MODIFY] [types.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/shared/types.ts)
- Keep placeholder export
- Add comment documenting future IPC types

---

## Verification Plan

### Automated Tests

No automated tests for Mission 1 (foundation only). Tests will be added starting Mission 2.

### Pre-Implementation Checks

Before running `npm install`:
1. Verify `.gitignore` covers: `node_modules/`, `dist/`, `.next/`, `renderer/out/`
2. Confirm directory structure matches plan (`main/`, `renderer/`, `shared/`, `resources/`)

### Manual Verification

After implementation, verify these success criteria:

1. **App Launches**
   ```bash
   npm run dev
   ```
   - Expected: Electron window opens showing "Voice Intelligence" text
   - Window should be roughly 400x600 pixels

2. **TypeScript Strict Mode**
   ```bash
   npx tsc --noEmit
   ```
   - Expected: No type errors, strict mode active

3. **Window Management**
   - Minimize window → window minimizes to dock
   - Close window → app quits (macOS behavior)
   - Resize window → window resizes freely

4. **Hot Reload (Development)**
   - Edit `renderer/pages/index.tsx` (e.g., change text)
   - Expected: Browser/window updates without full restart
   - Edit `main/index.ts` (e.g., change window title)
   - Expected: App restarts automatically

---

## Implementation Order

1. Verify `.gitignore` is sufficient
2. Create `package.json` with dependencies (Nextron as devDependency only)
3. Create root `tsconfig.json` (strict mode, shared types)
4. Create `main/index.ts` (with isDev environment check) and `main/preload.ts`
5. Create `renderer/tsconfig.json` (extends root, JSX settings)
6. Create `renderer/next.config.js` (static export, distDir)
7. Create `renderer/pages/_app.tsx` and `renderer/pages/index.tsx`
8. Run `npm install` (expect ~500MB download)
9. Test with `npm run dev` (uses `nextron dev` command)
10. Verify success criteria

---

## Dependencies Inventory

### Production
| Package | Purpose |
|---------|---------|
| `electron` | Desktop runtime |
| `next` | React framework |
| `react` | UI library |
| `react-dom` | React DOM renderer |

### Development
| Package | Purpose |
|---------|---------|
| `nextron` | CLI for dev/build orchestration |
| `typescript` | Type checking |
| `electron-builder` | macOS packaging (used by Nextron) |
| `@types/node` | Node.js types |
| `@types/react` | React types |

**Total: 9 packages** — Intentionally minimal per CLAUDE.md guidelines.

**Note**: `electron-builder.yml` will be created in Mission 8 (Packaging), not Mission 1. Nextron uses sensible defaults for now.
