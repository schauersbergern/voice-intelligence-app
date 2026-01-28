# Mission 6: LLM Enrichment Implementation Plan

## Goal

Process transcribed text through LLM to produce formatted/structured output. Support multiple enrichment modes and both OpenAI and Anthropic APIs.

---

## Proposed Changes

### Main Process - Enrichment Prompts

#### [NEW] [enrichment-prompts.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/enrichment-prompts.ts)

System prompts for each enrichment mode:
- `clean` - Fix grammar, remove filler words
- `format` - Structure into paragraphs
- `summarize` - Extract key points as bullets
- `action` - Extract action items/todos
- `email` - Format as professional email
- `notes` - Format as structured notes

---

### Main Process - Enrichment Handler

#### [NEW] [enrichment.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/enrichment.ts)

LLM processing with provider support:
- `enrich(text, mode, provider, apiKey): Promise<string>`
- OpenAI: use gpt-4o-mini (fast, cheap)
- Anthropic: use claude-3-haiku (fast)
- Store current mode, provider, and API key in memory

---

### Shared Types

#### [MODIFY] [types.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/shared/types.ts)

Add enrichment types:
```typescript
type EnrichmentMode = 'clean' | 'format' | 'summarize' | 'action' | 'email' | 'notes' | 'none';
type LLMProvider = 'openai' | 'anthropic';

IPC_CHANNELS.SET_ENRICHMENT_MODE = 'enrichment:set-mode'
IPC_CHANNELS.GET_ENRICHMENT_MODE = 'enrichment:get-mode'
IPC_CHANNELS.SET_LLM_PROVIDER = 'enrichment:set-provider'

interface ElectronAPI {
  setEnrichmentMode: (mode: EnrichmentMode) => Promise<void>;
  getEnrichmentMode: () => Promise<EnrichmentMode>;
  setLLMProvider: (provider: LLMProvider, apiKey: string) => Promise<void>;
}
```

---

### Main Process - Background

#### [MODIFY] [background.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/background.ts)

- Import enrichment module
- Modify SEND_AUDIO handler to enrich after transcription
- Add IPC handlers for enrichment mode/provider

---

### Preload Script

#### [MODIFY] [preload.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/preload.ts)

Expose enrichment IPC methods.

---

### Renderer - UI

#### [MODIFY] [index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx)

- Add enrichment mode selector dropdown
- Add LLM provider selector (OpenAI/Anthropic)
- Display enriched output
- Show "Enhancing..." state during LLM processing

---

## File Summary

| Action | File | Description |
|--------|------|-------------|
| NEW | `main/enrichment-prompts.ts` | System prompts per mode |
| NEW | `main/enrichment.ts` | LLM API client |
| MODIFY | `shared/types.ts` | Enrichment types and IPC |
| MODIFY | `main/background.ts` | Pipeline integration |
| MODIFY | `main/preload.ts` | Expose enrichment IPC |
| MODIFY | `renderer/pages/index.tsx` | Mode selector, output display |

---

## Verification Plan

### TypeScript Check
```bash
npx tsc --noEmit
```

### Manual Testing

1. **Start app**: `npm run dev`
2. **Configure settings**:
   - Select Whisper mode (API recommended for testing)
   - Enter OpenAI API key
   - Select enrichment mode (e.g., "clean")
3. **Record speech** with intentional filler words ("um", "like")
4. **Stop recording**
5. **Verify**: Output should be cleaned/formatted based on mode
6. **Try different modes** and verify output changes

### Expected Output by Mode

| Mode | Input | Expected Output |
|------|-------|-----------------|
| clean | "Um so like I think we should, you know, do this" | "I think we should do this" |
| summarize | Long rambling transcript | 3-5 bullet points |
| action | "We need to call Bob and fix the bug" | "• Call Bob\n• Fix the bug" |

---

## Design Decisions

1. **No streaming for now**: LLM responses are typically fast enough (<3s). Streaming can be added if needed.

2. **Shared API key for Whisper and LLM**: For simplicity, using same OpenAI key for both Whisper API and LLM enrichment. Anthropic key is separate.

3. **Mode stored in main process**: Like Whisper mode, enrichment mode is stored server-side for consistency with hotkey usage.
