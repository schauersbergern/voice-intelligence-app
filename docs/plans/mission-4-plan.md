# Mission 4: Whisper Integration Implementation Plan

## Goal

Implement dual-mode transcription: local Whisper (offline via whisper.cpp) and OpenAI Whisper API (cloud).

---

## Package Selection

Using **`@kutalia/whisper-node-addon`**:
- Pre-built binaries (no native compilation)
- Zero-config Electron support
- GPU acceleration (Metal on macOS)
- Active maintenance

---

## Proposed Changes

### Dependencies

```bash
npm install @kutalia/whisper-node-addon
```

---

### Shared Types

#### [MODIFY] [types.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/shared/types.ts)

Add transcription types and IPC channels:
```typescript
IPC_CHANNELS.TRANSCRIBE = 'whisper:transcribe'
IPC_CHANNELS.SET_WHISPER_MODE = 'whisper:set-mode'
IPC_CHANNELS.SET_API_KEY = 'settings:set-api-key'

type WhisperMode = 'local' | 'api';

interface TranscriptionResult {
  text: string;
  duration: number;
}

interface ElectronAPI {
  // ... existing
  transcribe: (audioData: ArrayBuffer) => Promise<TranscriptionResult>;
  setWhisperMode: (mode: WhisperMode) => Promise<void>;
  setApiKey: (key: string) => Promise<void>;
  getWhisperMode: () => Promise<WhisperMode>;
}
```

---

### Main Process - Local Whisper

#### [NEW] [whisper-local.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/whisper-local.ts)

Local whisper.cpp transcription:
- Load model from `resources/models/ggml-base.en.bin`
- Function: `transcribeLocal(audioBuffer: Buffer): Promise<string>`
- Handle model not found error gracefully

---

### Main Process - OpenAI API

#### [NEW] [whisper-api.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/whisper-api.ts)

OpenAI Whisper API client:
- Function: `transcribeWithAPI(audioBuffer: Buffer, apiKey: string): Promise<string>`
- POST to `https://api.openai.com/v1/audio/transcriptions`
- Send as multipart/form-data with model "whisper-1"
- Handle API errors (invalid key, rate limit)

---

### Main Process - Unified Handler

#### [NEW] [whisper-handler.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/whisper-handler.ts)

Routes transcription based on mode:
- Store current mode and API key in memory
- Function: `transcribe(audioBuffer: Buffer): Promise<TranscriptionResult>`
- Routes to local or API based on mode
- Returns unified result format

---

### Main Process - IPC Handlers

#### [MODIFY] [background.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/background.ts)

Update SEND_AUDIO handler to call whisper-handler and return result:
```typescript
ipcMain.handle(IPC_CHANNELS.SEND_AUDIO, async (_, audioData: ArrayBuffer) => {
  return await transcribe(Buffer.from(audioData));
});

ipcMain.handle(IPC_CHANNELS.SET_WHISPER_MODE, async (_, mode) => {
  setWhisperMode(mode);
});

ipcMain.handle(IPC_CHANNELS.SET_API_KEY, async (_, key) => {
  setApiKey(key);
});
```

---

### Preload Script

#### [MODIFY] [preload.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/preload.ts)

Expose new IPC methods for mode switching.

---

### Renderer - UI

#### [MODIFY] [index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx)

- Display transcription result after recording
- Show loading state during transcription
- Add simple mode toggle (local/API)
- Show API key input when API mode selected

---

## File Summary

| Action | File | Description |
|--------|------|-------------|
| MODIFY | `shared/types.ts` | Add transcription types and IPC channels |
| NEW | `main/whisper-local.ts` | Local whisper.cpp wrapper |
| NEW | `main/whisper-api.ts` | OpenAI API client |
| NEW | `main/whisper-handler.ts` | Unified transcription handler |
| MODIFY | `main/background.ts` | Update IPC handlers |
| MODIFY | `main/preload.ts` | Expose transcription IPC |
| MODIFY | `renderer/pages/index.tsx` | Display transcription, mode toggle |

---

## Model Download

User needs to manually download the Whisper model:
```bash
mkdir -p resources/models
curl -L https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin -o resources/models/ggml-base.en.bin
```

For testing without local model, API mode can be used.

---

## Verification Plan

### TypeScript Check
```bash
npx tsc --noEmit
```
Should pass with 0 errors.

### Manual Testing (in Electron Window)

1. **API Mode Test** (easier to test first):
   - Start app with `npm run dev`
   - Click mode toggle to "API" 
   - Enter valid OpenAI API key
   - Record 3-5 seconds of speech
   - Click Stop → Should show transcription text

2. **Local Mode Test** (requires model download):
   - Download model to `resources/models/ggml-base.en.bin`
   - Click mode toggle to "Local"
   - Record 3-5 seconds of speech
   - Click Stop → Should show transcription text

3. **Error Handling**:
   - Test with invalid API key → Should show error
   - Test local mode without model → Should show "Model not found" error

---

## Design Decisions

1. **No utilityProcess for now**: The spec mentions utilityProcess, but for simplicity we'll run transcription in the main process initially. If blocking becomes an issue, we can refactor later.

2. **In-memory settings**: Mode and API key stored in memory (not persisted). Settings persistence can be added in a future mission.

3. **Package choice**: `@kutalia/whisper-node-addon` chosen for Electron compatibility and pre-built binaries.
