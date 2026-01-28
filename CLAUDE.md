# Voice Intelligence App

## Project Overview
macOS desktop app that captures voice input, transcribes it (local Whisper or OpenAI API), and enriches it through LLM processing. Built with Electron + Next.js (Nextron).

## Quick Commands
- `npm run dev` - Start development mode
- `npm run build` - Package for distribution
- `npm test` - Run test suite

## Architecture
```
main/           → Electron main process (audio capture, Whisper, IPC handlers)
renderer/       → Next.js frontend (UI, settings, transcript display)
shared/         → TypeScript types shared between processes
resources/      → Whisper models, assets
```

## Code Standards
- TypeScript strict mode required
- Use `ipcRenderer.invoke()` for request/response IPC
- NEVER expose full ipcRenderer to renderer — use contextBridge only
- Audio must be 16kHz mono WAV before Whisper processing
- Use utilityProcess for heavy operations (model loading, transcription)

## Critical Guardrails
- NEVER modify main/preload.ts without explicit approval
- Don't use Next.js API routes — use IPC handlers in main process
- Don't use SSR features — Electron requires static export
- Keep dependencies minimal — lean is the goal

## IPC Channel Naming
- `audio:start-recording`
- `audio:stop-recording`
- `whisper:transcribe`
- `whisper:set-mode` (local/api)
- `settings:get`
- `settings:set`
- `enrichment:process`

## File Purposes
- main/index.ts → App entry, window management, hotkey registration
- main/preload.ts → Secure IPC bridge via contextBridge
- main/audio-capture.ts → Microphone recording logic
- main/whisper-handler.ts → Transcription (local + API)
- main/enrichment.ts → LLM processing pipeline
- renderer/pages/index.tsx → Main recording/transcript UI
- renderer/pages/settings.tsx → API key, model selection, hotkey config
- shared/types.ts → IPC message types, shared interfaces

## Testing
- Run single test: `npm test -- path/to/test.ts`
- Test audio pipeline with: `npm run test:audio`

## Current Mission
Check /docs/specs/ for active mission specification.

## Session Notes
If context is getting heavy, dump progress to /docs/session-notes/[date].md before /clear.
