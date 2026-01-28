# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

macOS desktop app that captures voice input, transcribes it (local Whisper or OpenAI API), and enriches it through LLM processing. Built with Electron + Next.js using the Nextron framework.

## Development Workflow

This project is built incrementally via missions defined in [docs/specs/](docs/specs/). Each mission has its own spec file with objectives, success criteria, and implementation steps. Work through missions sequentially.

**Planning process:** For each mission, first create an implementation plan in `docs/plans/mission-N-plan.md` before writing code. See [docs/PROMPTS.md](docs/PROMPTS.md) for the complete playbook of prompts to use for each mission phase.

## Quick Commands

```bash
npm run dev      # Start development mode (launches Electron + Next.js hot reload)
npm run build    # Compile TypeScript and package for distribution (.dmg on macOS)
npm test         # Run test suite
```

## Architecture

```
main/           → Electron main process (IPC handlers, Whisper, settings, window mgmt)
renderer/       → Next.js frontend (UI, hooks, pages)
  ├─ pages/     → Next.js pages (index.tsx, settings.tsx, etc.)
  ├─ hooks/     → React hooks (useAudioRecorder, etc.)
  └─ types/     → Type declarations (electron.d.ts for window.electronAPI)
shared/         → TypeScript types shared between main and renderer processes
resources/      → Static assets (Whisper models, icons)
  └─ models/    → Whisper .bin files (gitignored, user downloads manually)
app/            → Nextron build output (compiled main + preload JS, gitignored)
docs/
  ├─ specs/     → Mission specifications
  ├─ plans/     → Implementation plans per mission
  └─ PROMPTS.md → Step-by-step prompts for each mission phase
```

**Data flow:** Renderer captures audio → IPC to main → Whisper transcription → LLM enrichment → IPC response → UI display

**Heavy operations:** Use `utilityProcess` for model loading and transcription to avoid blocking the main thread.

## Build System

**Nextron compilation:**
- `npm run dev` compiles TypeScript in `main/` and `shared/` to `app/` directory
- `main/background.ts` → `app/background.js` (Electron main process entry)
- `main/preload.ts` → `app/preload.js` (loaded by BrowserWindow)
- Renderer runs on Next.js dev server (http://localhost:8888) in development
- In production, renderer is statically exported to `renderer/out/`

**TypeScript configs:**
- Root `tsconfig.json`: Strict mode for main process and shared types
- `renderer/tsconfig.json`: Separate config for Next.js (extends Next.js defaults)

## Audio Requirements

Whisper requires specific audio format:
- **Sample rate:** 16kHz (critical - other rates will fail or give poor results)
- **Channels:** Mono (stereo will be downmixed)
- **Format:** WAV (16-bit PCM)

Audio capture happens in renderer via Web Audio API, then transfers to main process via IPC for transcription.

## Critical Guardrails

- **NEVER modify main/preload.ts without explicit approval** - security-critical file
- **NEVER expose full ipcRenderer to renderer** - use contextBridge only
- Don't use Next.js API routes - use IPC handlers in main process instead
- Don't use SSR features - Electron requires static export (`output: 'export'`)
- Keep dependencies minimal - every native module complicates packaging
- Always read files before editing them

## IPC Communication Pattern

**Channel naming convention:**
```
<domain>:<action>
audio:start-recording
whisper:transcribe
settings:get
```

**Current channels:**
```typescript
IPC_CHANNELS.PING                  // Test IPC (returns "pong")
// Future channels (Mission 3+):
// AUDIO_START: 'audio:start-recording'
// AUDIO_STOP: 'audio:stop-recording'
// WHISPER_TRANSCRIBE: 'whisper:transcribe'
// WHISPER_SET_MODE: 'whisper:set-mode'  // 'local' | 'api'
// SETTINGS_GET: 'settings:get'
// SETTINGS_SET: 'settings:set'
// ENRICHMENT_PROCESS: 'enrichment:process'
```

**Type safety:**
1. Define channel names in `shared/types.ts` as const
2. Define method signatures in `ElectronAPI` interface
3. Implement in `main/preload.ts` using contextBridge
4. Declare `window.electronAPI` in `renderer/types/electron.d.ts`
5. Register handlers in `main/background.ts` using ipcMain.handle()

All IPC uses `ipcRenderer.invoke()` for request/response pattern (no events/listeners).

## File Purposes

| File | Purpose |
|------|---------|
| main/background.ts | App entry, window management, IPC handler registration |
| main/preload.ts | Secure IPC bridge via contextBridge (SECURITY CRITICAL) |
| shared/types.ts | IPC channel names, ElectronAPI interface, shared domain types |
| renderer/types/electron.d.ts | Augments Window interface with electronAPI property |
| renderer/pages/index.tsx | Main recording/transcript UI |
| renderer/pages/_app.tsx | Next.js app wrapper (global styles, providers) |
| package.json | Main project config, scripts, Electron + Next.js dependencies |

Future files (Mission 3+):
- main/whisper-handler.ts - Routes transcription to local or API
- main/whisper-local.ts - Local whisper.cpp bindings
- main/whisper-api.ts - OpenAI Whisper API client
- main/enrichment.ts - LLM processing pipeline
- renderer/pages/settings.tsx - API keys, mode selection, hotkey config
- renderer/hooks/useAudioRecorder.ts - Microphone capture logic

## Development Tips

**Hot reload behavior:**
- Renderer changes (React, UI) → Hot reload instantly
- Main process changes (background.ts, preload.ts) → Full app restart required
- Type changes (shared/types.ts) → May need manual restart

**Common issues:**
- "electronAPI is not defined" → preload.ts not loading, check webPreferences.preload path
- TypeScript errors in renderer about window.electronAPI → Check renderer/types/electron.d.ts exists
- Audio not recording → Check microphone permissions in macOS System Settings
- Build fails with native modules → Check electron-builder asarUnpack config

**Debugging:**
- Development mode opens DevTools automatically (main/background.ts:49)
- Use `console.log` in main process → shows in terminal running `npm run dev`
- Use `console.log` in renderer → shows in DevTools console

## Session Notes

If context is getting heavy, dump progress to `docs/session-notes/[date].md` before `/clear`. Include completed items, current state, next steps, and blockers.
