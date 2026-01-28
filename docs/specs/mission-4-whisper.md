# Mission 4: Whisper Integration

## Objective
Implement dual-mode transcription: local Whisper (offline) and OpenAI Whisper API (cloud).

## Success Criteria
- [ ] Local Whisper transcribes audio without internet
- [ ] OpenAI API transcribes audio with user-provided key
- [ ] User can switch between modes in settings
- [ ] Transcription runs in utilityProcess (non-blocking)
- [ ] Progress/status feedback during transcription

## Steps

### 4.1 Choose Local Whisper Binding
Options (research and pick one):
- `whisper-node` - Node.js bindings for whisper.cpp
- `@anthropic/whisper-node-addon` - Cross-platform bindings
- Direct whisper.cpp with child_process

Recommendation: Start with whisper-node for simplicity.

### 4.2 Set Up Local Whisper
- Install chosen package
- Download base.en model (~150MB) to resources/models/
- Create main/whisper-local.ts with transcribe function

### 4.3 Implement OpenAI Whisper API
Create main/whisper-api.ts:
```typescript
async function transcribeWithAPI(audioBuffer: Buffer, apiKey: string): Promise<string>
```
- Use OpenAI's /v1/audio/transcriptions endpoint
- Send as multipart/form-data
- Handle errors gracefully

### 4.4 Create Unified Whisper Handler
Create main/whisper-handler.ts:
```typescript
type WhisperMode = 'local' | 'api';

async function transcribe(
  audioBuffer: Buffer, 
  mode: WhisperMode, 
  apiKey?: string
): Promise<string>
```
- Routes to local or API based on mode
- Runs in utilityProcess to avoid blocking main thread

### 4.5 Add IPC Channels
Extend shared/types.ts:
```typescript
interface ElectronAPI {
  // ... existing
  transcribe: (audioData: ArrayBuffer) => Promise<string>;
  setWhisperMode: (mode: 'local' | 'api') => Promise<void>;
  setApiKey: (key: string) => Promise<void>;
}
```

### 4.6 Integrate with Audio Pipeline
- When recording stops, audio is sent to whisper-handler
- Transcription result is returned to renderer
- Display result in UI

## Files to Create/Modify
- main/whisper-local.ts (local Whisper wrapper)
- main/whisper-api.ts (OpenAI API client)
- main/whisper-handler.ts (unified handler)
- shared/types.ts (transcription types)
- main/preload.ts (expose transcription IPC)
- main/index.ts (register handlers)
- renderer/pages/index.tsx (display transcription)

## Dependencies
- Mission 3 must be complete (audio capture)
- For local: whisper-node or equivalent package
- For API: node-fetch or built-in fetch

## Model Files
Store in resources/models/:
- ggml-base.en.bin (~150MB) - recommended for balance
- ggml-tiny.en.bin (~75MB) - faster, less accurate

## Error Handling
- Local: Model not found, transcription failed
- API: Invalid key, rate limit, network error
- Both: Audio too short, invalid format

## Performance Notes
- Local base model: ~5-10 seconds for 30 seconds of audio
- API: ~2-3 seconds for same (network dependent)
- Always show loading state during transcription
