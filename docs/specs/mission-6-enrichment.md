# Mission 6: LLM Enrichment

## Objective
Process transcribed text through LLM to produce immediately usable output (formatted, structured, or enhanced).

## Success Criteria
- [x] Raw transcription is processed by LLM
- [x] Output is formatted/structured appropriately
- [x] Multiple enrichment modes available
- [x] Works with user's API key (OpenAI or Anthropic)
- [x] Fast enough for real-time workflow

## Steps

### 6.1 Define Enrichment Modes
Create enum of processing modes:
```typescript
type EnrichmentMode = 
  | 'clean'      // Fix grammar, punctuation, filler words
  | 'format'     // Structure into paragraphs, add formatting
  | 'summarize'  // Condense to key points
  | 'action'     // Extract action items and todos
  | 'email'      // Format as professional email
  | 'notes'      // Format as structured notes
  | 'none';      // Pass through raw transcription
```

### 6.2 Create Enrichment Handler
Create main/enrichment.ts:
```typescript
async function enrich(
  text: string, 
  mode: EnrichmentMode,
  apiKey: string,
  provider: 'openai' | 'anthropic'
): Promise<string>
```

### 6.3 Design System Prompts
For each mode, create optimized prompts:
- clean: "Fix grammar and remove filler words. Keep meaning intact."
- format: "Structure this transcript into clear paragraphs."
- summarize: "Summarize the key points in 3-5 bullet points."
- etc.

Store prompts in main/enrichment-prompts.ts

### 6.4 Implement API Calls
Support both providers:
- OpenAI: gpt-4o-mini (fast, cheap) or gpt-4o (quality)
- Anthropic: claude-3-haiku (fast) or claude-3-sonnet (quality)

User selects provider and model in settings.

### 6.5 Add IPC Channels
Extend shared/types.ts:
```typescript
interface ElectronAPI {
  // ... existing
  enrichTranscription: (text: string, mode: EnrichmentMode) => Promise<string>;
  setEnrichmentMode: (mode: EnrichmentMode) => Promise<void>;
  setLLMProvider: (provider: 'openai' | 'anthropic', apiKey: string) => Promise<void>;
}
```

### 6.6 Pipeline Integration
Full flow:
1. Record audio
2. Transcribe with Whisper
3. Enrich with LLM
4. Display final result
5. Copy to clipboard automatically (optional)

## Files to Create/Modify
- main/enrichment.ts (LLM processing)
- main/enrichment-prompts.ts (system prompts per mode)
- shared/types.ts (enrichment types)
- main/preload.ts (expose enrichment IPC)
- main/index.ts (register handlers)
- renderer/pages/index.tsx (mode selector, display result)

## Dependencies
- Mission 4 must be complete (transcription)
- OpenAI or Anthropic API key from user

## Performance Budget
- Enrichment should complete in < 3 seconds for typical input
- Use streaming if > 5 seconds expected
- Show "Enhancing..." state during processing

## Token Limits
- Input: Most transcriptions < 1000 tokens
- Output: Depends on mode (summarize = short, format = similar to input)
- Use appropriate max_tokens per mode

## Fallback Behavior
- If no API key configured → skip enrichment, show raw transcription
- If API error → show raw transcription with error notice
- User can always switch to 'none' mode for raw output
