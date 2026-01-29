# Mission 3: Audio Capture

## Objective
Implement microphone recording that produces Whisper-compatible audio (16kHz mono WAV).

## Success Criteria
- [x] User can start/stop recording via UI button
- [x] Audio is captured from microphone
- [x] Output is 16kHz mono WAV format
- [x] Recording state is clearly indicated in UI
- [x] Audio data is passed to main process for processing

## Steps

### 3.1 Request Microphone Permission
In renderer, use navigator.mediaDevices.getUserMedia:
- Request audio only: `{ audio: true }`
- Handle permission denied gracefully

### 3.2 Implement AudioContext Recording
In renderer/hooks/useAudioRecorder.ts:
- Create AudioContext with 16kHz sample rate
- Connect MediaStreamSource to ScriptProcessor/AudioWorklet
- Collect audio chunks during recording

### 3.3 Convert to WAV Format
Create renderer/utils/audio-utils.ts:
- Function to encode PCM data to WAV
- Ensure 16kHz, mono, 16-bit format
- Return as ArrayBuffer or Blob

### 3.4 Add IPC for Audio Transfer
Extend shared/types.ts:
```typescript
interface ElectronAPI {
  ping: () => Promise<string>;
  sendAudioForTranscription: (audioData: ArrayBuffer) => Promise<void>;
}
```

### 3.5 Update UI
In renderer/pages/index.tsx:
- Add Record/Stop button
- Show recording indicator (red dot, timer)
- Display "Processing..." state after stop

## Files to Create/Modify
- renderer/hooks/useAudioRecorder.ts (recording logic)
- renderer/utils/audio-utils.ts (WAV encoding)
- shared/types.ts (audio IPC types)
- main/preload.ts (expose audio IPC)
- main/index.ts (audio IPC handler stub)
- renderer/pages/index.tsx (recording UI)

## Dependencies
- Mission 2 must be complete (IPC layer)

## Technical Notes
- AudioContext sample rate must be 16000
- Use ScriptProcessorNode (deprecated but simpler) or AudioWorkletNode
- Buffer size: 4096 samples is a good default
- Consider adding a simple waveform visualization later (optional)

## Testing
- Record 5 seconds of speech
- Verify WAV file is valid (can be played back)
- Verify format: 16kHz, mono, 16-bit PCM
