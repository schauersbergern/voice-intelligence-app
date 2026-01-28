# Voice Intelligence

> Desktop voice capture and AI-powered transcription for macOS

## Problem

Voice notes are a fast way to capture ideas, but getting them into usable text is friction-heavy. Existing solutions require cloud uploads, don't work offline, or lack customization.

**Voice Intelligence** solves this by providing:
- One-key capture (global hotkey)
- Instant transcription (local or cloud)
- AI-powered text enhancement (formatting, summarization, action items)
- Everything runs locally with optional cloud features (BYOK)

## Features

### 🎙 Voice Capture
- One-click or hotkey-triggered recording
- Real-time duration display
- 16kHz mono WAV optimized for speech

### 📝 Transcription
- **Local mode**: whisper.cpp for offline, private transcription
- **API mode**: OpenAI Whisper for high-accuracy cloud processing

### ✨ LLM Enrichment
Choose how AI processes your transcription:
- **Clean**: Fix grammar and remove filler words
- **Format**: Structure into readable paragraphs
- **Summarize**: Extract key points as bullet items
- **Action Items**: Pull out todos and tasks
- **Email**: Transform into professional email
- **Notes**: Format as structured notes
- **None**: Keep raw transcription

### ⌨️ Keyboard Controls
- `⌘+Shift+Space`: Global hotkey to toggle recording
- `Enter`: Start/stop recording when focused
- `⌘+C`: Copy result to clipboard

## Architecture

```
┌─────────────────────────────────────────┐
│           Renderer (Next.js)            │
│  ┌─────────────────────────────────┐    │
│  │     React UI Components         │    │
│  │  (RecordButton, TranscriptDisplay)   │
│  └───────────────┬─────────────────┘    │
│                  │ IPC                   │
└──────────────────┼──────────────────────┘
                   │
┌──────────────────┼──────────────────────┐
│                  │                       │
│           Main (Electron)               │
│  ┌───────────────┴─────────────────┐    │
│  │       Whisper Handler           │    │
│  │  (Local via whisper.cpp or API) │    │
│  └───────────────┬─────────────────┘    │
│                  │                       │
│  ┌───────────────┴─────────────────┐    │
│  │       Enrichment Handler        │    │
│  │  (OpenAI / Anthropic LLM)       │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │  Window Manager | Shortcuts     │    │
│  └─────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

## Setup

### Prerequisites
- macOS 12+
- Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/schauersbergern/voice-intelligence-app.git
cd voice-intelligence-app

# Install dependencies
npm install

# Run in development
npm run dev
```

### Configuration

1. **For API transcription**: Enter your OpenAI API key in Settings
2. **For LLM enrichment**: Enter your OpenAI or Anthropic API key in Settings
3. **For local transcription**: Download `ggml-base.en.bin` model to `resources/models/`

## Usage

1. Press the **Record** button or use `⌘+Shift+Space`
2. Speak your message
3. Press **Stop** or ⌘+Shift+Space again
4. View your transcription (with optional AI enhancement)
5. Click **Copy** or use `⌘+C` to copy to clipboard

## Design Decisions

### Electron over Tauri
- Native audio handling via Web Audio API
- Easier integration with Node.js native modules (whisper.cpp bindings)
- Mature ecosystem for desktop apps

### Local Whisper
- Privacy: Audio never leaves user's machine
- Offline capable: Works without internet
- Speed: No network latency for transcription

### BYOK (Bring Your Own Key)
- No subscription fees from us
- Users control their API costs
- Flexible provider choice (OpenAI or Anthropic)

### Separate Transcription and Enrichment
- Modular pipeline: Users can disable enrichment for raw transcripts
- Choice: Different LLM providers can be used for each step
- Fallback: If enrichment fails, raw transcription is still shown

## Development

```bash
# Run in development mode
npm run dev

# Type check
npx tsc --noEmit

# Build for macOS
npm run build:mac
```

## Building

```bash
# Build macOS DMG
npm run build:mac

# Output will be in dist/ folder
```

## Project Structure

```
voice-intelligence-app/
├── main/                   # Electron main process
│   ├── background.ts       # App entry point
│   ├── preload.ts          # IPC bridge
│   ├── whisper-handler.ts  # Transcription routing
│   ├── whisper-local.ts    # Local whisper.cpp
│   ├── whisper-api.ts      # OpenAI Whisper API
│   ├── enrichment.ts       # LLM enrichment
│   ├── enrichment-prompts.ts
│   ├── window-manager.ts
│   └── shortcuts.ts
├── renderer/               # Next.js renderer process
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── styles/
├── shared/                 # Shared types
│   └── types.ts
├── resources/
│   └── models/             # Whisper model files
└── docs/
    └── specs/              # Mission specifications
```

## License

MIT

---

Built with ❤️ for voice-first productivity
