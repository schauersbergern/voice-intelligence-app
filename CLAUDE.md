# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

macOS desktop app that captures voice input, transcribes it (local Whisper or OpenAI API), and enriches it through LLM processing. Built with Electron + Next.js using the Nextron framework.

## Quick Commands

```bash
npm run dev      # Start development mode (Electron + Next.js hot reload)
npm run build    # Package for distribution
npm run build:mac # Build macOS DMG
npx tsc --noEmit # Type check without emitting
```

## Architecture

```
main/           → Electron main process
renderer/       → Next.js frontend (runs in Chromium)
  ├─ pages/     → Next.js pages (index.tsx main UI)
  ├─ components/→ React components (RecordButton, TranscriptDisplay, LoadingState)
  ├─ hooks/     → useAudioRecorder (microphone capture)
  ├─ lib/       → whisper-local.ts (WASM transcription)
  └─ utils/     → audio-utils.ts (WAV encoding)
shared/         → TypeScript types shared between processes
```

### Data Flow

**Local mode (default):**
```
Renderer: Mic capture → WAV encoding → WASM Whisper transcription → IPC to main → LLM enrichment → IPC response → UI
```

**API mode:**
```
Renderer: Mic capture → WAV encoding → IPC to main → OpenAI Whisper API → LLM enrichment → IPC response → UI
```

**Key insight:** Local Whisper runs in the **renderer process** using `@huggingface/transformers` (WebAssembly), not the main process. This avoids native module packaging complexity. Only API transcription goes through main process.

## Critical Guardrails

- **NEVER modify main/preload.ts without explicit approval** - security-critical file
- **NEVER expose full ipcRenderer to renderer** - use contextBridge only
- Don't use Next.js API routes - use IPC handlers in main process
- Don't use SSR features - Electron requires static export (`output: 'export'`)
- Always read files before editing them

## Audio Requirements

Whisper requires specific format:
- **Sample rate:** 16kHz (critical)
- **Channels:** Mono
- **Format:** WAV (16-bit PCM)

Audio capture in `renderer/hooks/useAudioRecorder.ts`, WAV encoding in `renderer/utils/audio-utils.ts`.

## IPC Communication

**Channel definitions in `shared/types.ts`:**
```typescript
IPC_CHANNELS.SEND_AUDIO           // Send WAV for transcription (API mode)
IPC_CHANNELS.ENRICH_TRANSCRIPTION // LLM enrichment
IPC_CHANNELS.SET_WHISPER_MODE     // 'local' | 'api'
IPC_CHANNELS.GET_SETTINGS         // Retrieve all settings
IPC_CHANNELS.SAVE_SETTING         // Persist single setting
IPC_CHANNELS.COPY_TO_CLIPBOARD    // System clipboard
IPC_CHANNELS.TRIGGER_PASTE        // Cmd+V automation
```

**Type safety flow:**
1. Define channel names in `shared/types.ts` as const object
2. Define method signatures in `ElectronAPI` interface
3. Implement in `main/preload.ts` using contextBridge
4. Declare `window.electronAPI` in `renderer/types/electron.d.ts`
5. Register handlers in `main/background.ts` using `ipcMain.handle()`

## Key Files

| File | Purpose |
|------|---------|
| main/background.ts | App entry, window creation, IPC handler registration |
| main/preload.ts | contextBridge implementation (SECURITY CRITICAL) |
| main/whisper-handler.ts | Routes to whisper-api.ts (local handled in renderer) |
| main/whisper-api.ts | OpenAI Whisper API client |
| main/enrichment.ts | LLM processing (OpenAI/Anthropic) |
| main/enrichment-prompts.ts | System prompts per enrichment mode |
| main/store.ts | Settings persistence via electron-store |
| main/shortcuts.ts | Global hotkey registration (Cmd+Shift+Space) |
| main/window-manager.ts | Window visibility and focus management |
| renderer/lib/whisper-local.ts | WASM Whisper via @huggingface/transformers |
| renderer/hooks/useAudioRecorder.ts | Microphone capture with Web Audio API |
| renderer/pages/index.tsx | Main UI orchestrating record/transcribe/display |
| shared/types.ts | All IPC channels, ElectronAPI interface, domain types |

## Settings Persistence

Settings stored via `electron-store` in `main/store.ts`:
- `whisperMode`: 'local' | 'api'
- `whisperLanguage`: Language code for transcription
- `enrichmentMode`: 'none' | 'clean' | 'format' | 'summarize' | 'action' | 'email' | 'notes' | 'commit' | 'tweet' | 'slack'
- `apiKey`: OpenAI API key
- `llmProvider`: 'openai' | 'anthropic'

## Development Tips

**Hot reload:**
- Renderer changes → Hot reload instantly
- Main process changes → Full app restart required (`Cmd+R` or restart `npm run dev`)

**Common issues:**
- "electronAPI is not defined" → Check preload.ts is loading (webPreferences.preload path)
- Model loading slow on first run → WASM model (~460MB) downloads and caches automatically
- Audio not recording → Check macOS microphone permissions

**Debugging:**
- Main process logs → Terminal running `npm run dev`
- Renderer logs → DevTools console (opens automatically in dev)

## Development Workflow

Missions in `docs/specs/` define incremental feature development. Missions 1-4 are complete (foundation, IPC, audio capture, Whisper). See `docs/PROMPTS.md` for prompt playbook.

## Session Notes

If context is getting heavy, dump progress to `docs/session-notes/[date].md` before `/clear`.
