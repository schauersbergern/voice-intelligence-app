# Mission 3: Audio Capture Implementation Plan

## Goal

Implement microphone recording that produces Whisper-compatible audio (16kHz mono WAV) with UI controls and IPC transfer to main process.

---

## Proposed Changes

### Shared Types

#### [MODIFY] [types.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/shared/types.ts)

Add new IPC channel and method:
```typescript
IPC_CHANNELS.SEND_AUDIO = 'audio:send-for-transcription'

interface ElectronAPI {
  sendAudioForTranscription: (audioData: ArrayBuffer) => Promise<void>;
}
```

---

### Renderer - Audio Utilities

#### [NEW] [audio-utils.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/utils/audio-utils.ts)

WAV encoding utility:
- `encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer`
- Creates 16-bit PCM WAV header + data
- Mono output, 16kHz sample rate

---

### Renderer - Recording Hook

#### [NEW] [useAudioRecorder.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/hooks/useAudioRecorder.ts)

React hook for microphone recording:
- `startRecording()` - Request mic permission, start capture
- `stopRecording()` - Stop capture, return WAV ArrayBuffer
- Uses `AudioContext` with target sample rate 16kHz
- Fallback: resample from device rate to 16kHz
- State: `idle` | `recording` | `processing` | `error`
- Returns: `{ isRecording, error, startRecording, stopRecording }`

**Technical approach:**
- Use `ScriptProcessorNode` (deprecated but widely supported) for audio chunks
- Collect Float32Array chunks during recording
- On stop: concatenate, downsample if needed, encode to WAV

---

### Main Process - IPC Handler

#### [MODIFY] [background.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/background.ts)

Add stub handler for audio:
```typescript
ipcMain.handle(IPC_CHANNELS.SEND_AUDIO, async (_, audioData: ArrayBuffer) => {
  console.log(`Received audio: ${audioData.byteLength} bytes`);
  // Mission 4 will add transcription here
});
```

---

### Preload Script

#### [MODIFY] [preload.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/preload.ts)

Expose new IPC method:
```typescript
sendAudioForTranscription: (audioData: ArrayBuffer) => 
  ipcRenderer.invoke(IPC_CHANNELS.SEND_AUDIO, audioData)
```

---

### Renderer - UI

#### [MODIFY] [index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx)

Update UI:
- Replace test button with Record/Stop button
- Show recording indicator (pulsing red dot)
- Show recording duration timer
- Display processing state after stop
- Handle errors (permission denied, etc.)

---

## File Summary

| Action | File | Description |
|--------|------|-------------|
| MODIFY | `shared/types.ts` | Add `SEND_AUDIO` channel, `sendAudioForTranscription` method |
| NEW | `renderer/utils/audio-utils.ts` | WAV encoding function |
| NEW | `renderer/hooks/useAudioRecorder.ts` | Microphone capture hook |
| MODIFY | `main/background.ts` | Audio IPC handler stub |
| MODIFY | `main/preload.ts` | Expose audio IPC |
| MODIFY | `renderer/pages/index.tsx` | Recording UI |

---

## Verification Plan

### Automated (TypeScript)
```bash
npx tsc --noEmit
```
Should pass with 0 errors.

### Manual Testing (in Electron Window)

1. **Start app**: `npm run dev`
2. **Grant microphone permission** when prompted
3. **Click Record button** → Should see:
   - Button changes to "Stop"
   - Red pulsing dot appears
   - Timer counts up
4. **Speak for 3-5 seconds**
5. **Click Stop button** → Should see:
   - Button shows "Processing..."
   - Then returns to "Record"
6. **Check terminal** → Should show: `Received audio: XXXX bytes`
7. **Verify audio size**: ~5 seconds of 16kHz mono 16-bit = ~160KB

### Error Case Testing

1. **Deny microphone permission** → Should show error message in UI
2. **Test in regular browser** (localhost:8888) → Should show "Electron API not available" error

---

## Design Decisions

1. **ScriptProcessorNode vs AudioWorklet**: Using ScriptProcessorNode for simplicity. It's deprecated but still works in Electron's Chromium. AudioWorklet is more complex and overkill for this use case.

2. **Resampling strategy**: Most microphones capture at 44.1kHz or 48kHz. We'll capture at device rate and downsample to 16kHz in JavaScript before encoding. This is simpler than trying to force the AudioContext sample rate which has browser compatibility issues.

3. **IPC data transfer**: ArrayBuffer is cloned during IPC transfer. For longer recordings, consider streaming chunks, but for typical voice memos (<30s), single transfer is fine.
