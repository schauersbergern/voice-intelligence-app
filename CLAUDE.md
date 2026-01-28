# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

macOS desktop app that captures voice input, transcribes it (local Whisper or OpenAI API), and enriches it through LLM processing. Built with Electron + Next.js (Nextron).

## Development Workflow

This project is built incrementally via missions defined in [docs/specs/](docs/specs/). Each mission has its own spec file with objectives, success criteria, and implementation steps. Work through missions sequentially.

## Quick Commands

```bash
npm run dev      # Start development mode (launches Electron + Next.js)
npm run build    # Package for distribution
npm test         # Run test suite
```

## Architecture

```
main/           → Electron main process (IPC handlers, Whisper, settings)
renderer/       → Next.js frontend (UI, hooks, pages)
shared/         → TypeScript types shared between processes
resources/      → Whisper models (ggml-base.en.bin), assets
```

**Data flow:** Renderer captures audio → IPC to main → Whisper transcription → LLM enrichment → IPC response → UI display

**Heavy operations:** Use `utilityProcess` for model loading and transcription to avoid blocking the main thread.

## Audio Requirements

Whisper requires specific audio format:
- **Sample rate:** 16kHz
- **Channels:** Mono
- **Format:** WAV (16-bit PCM)

Audio capture happens in renderer via Web Audio API, then transfers to main process for transcription.

## Critical Guardrails

- NEVER modify main/preload.ts without explicit approval
- NEVER expose full ipcRenderer to renderer — use contextBridge only
- Don't use Next.js API routes — use IPC handlers in main process
- Don't use SSR features — Electron requires static export (`output: 'export'`)
- Keep dependencies minimal

## IPC Channels

```
audio:start-recording
audio:stop-recording
whisper:transcribe
whisper:set-mode          # 'local' | 'api'
settings:get
settings:set
enrichment:process
```

All IPC uses `ipcRenderer.invoke()` for request/response pattern. Types defined in shared/types.ts.

## File Purposes

| File | Purpose |
|------|---------|
| main/index.ts | App entry, window management, hotkey registration |
| main/preload.ts | Secure IPC bridge via contextBridge |
| main/whisper-handler.ts | Routes transcription to local or API |
| main/whisper-local.ts | Local whisper.cpp bindings |
| main/whisper-api.ts | OpenAI Whisper API client |
| main/enrichment.ts | LLM processing pipeline |
| renderer/pages/index.tsx | Main recording/transcript UI |
| renderer/pages/settings.tsx | API keys, mode selection, hotkey config |
| renderer/hooks/useAudioRecorder.ts | Microphone capture logic |
| shared/types.ts | IPC message types, shared interfaces |

## Session Notes

If context is getting heavy, dump progress to docs/session-notes/[date].md before /clear.
