# Voice Intelligence

**Voice-to-text that just works.** Speak anywhere, paste everywhere.

*Desktop voice capture and AI-powered transcription for macOS and Windows.*

![Voice Intelligence Demo](/docs/assets/demo.gif)


**Design:**

![Voice Intelligence Screenshot](/docs/assets/app-screenshot.png)

## ✨ Features

- 🎙️ **Global Hotkey**: Press `Alt+Space` (default) to toggle recording from any app. (Press & release to start, press & release again to stop).
- 🎤 **Microphone Chooser**: Select your preferred input device from the menu bar or settings.
- 🔒 **Local Privacy**: Transcribe offline using WebAssembly-powered Whisper (zero data leaves your device).
- ☁️ **Cloud Accuracy**: Optional OpenAI Whisper API integration for highest accuracy.
- 🧠 **AI Enrichment**: Use OpenAI to clean, format, summarize, or extract action items.
- 📋 **Auto-Paste**: Transcription is automatically pasted into your active text field.
- ⚙️ **Customizable**: Change hotkeys, language, and enrichment settings via the menu bar widget or app settings.
- 🖥️ **Menu Bar**: Unobtrusive menu bar widget for quick mode switching.

![Menu Bar Widget](/docs/assets/menubar-complete.jpg)

## 🚀 Quick Start

1. **Install the Application**:
   - If you have just built the app (see [Building](#building) below), navigate to the `dist` folder.
   - **Apple Silicon (M1/M2/M3)**: Open `Voice Intelligence-1.0.0-arm64.dmg`.
   - **Intel Mac**: Open `Voice Intelligence-1.0.0.dmg`.
   - Drag the app to your `Applications` folder.
2. **Launch** the app from Applications.
3. **IMPORTANT: Enable Accessibility Permission**
   - The app uses accessibility features to paste text directly into your active application.
   - Go to **System Settings > Privacy & Security > Accessibility**.
   - Toggle **Voice Intelligence** to ON.
   - *Without this, Auto-Paste will not work and you will need to manually copy text.*
   
   ![Accessibility Permission](/docs/assets/accessibility-voice-intelligence.jpg)

4. **Toggle Recording**:
   - Press and **release** `Alt+Space` (default) to **START** recording.
   - Speak your thought.
   - Press and **release** `Alt+Space` again to **STOP** recording.
   - *Note: This is a toggle, not a hold-to-talk action. You must release the keys to activate.*
5. **Done!** The text will appear wherever your cursor is!

## 🏗️ Architecture

Voice Intelligence combines the native capabilities of Electron with the flexibility of Next.js and the power of local AI.

```mermaid
flowchart LR
    User[👤 User] -->|Alt+Space| GlobalShortcut[⌨️ Global Hotkey]
    GlobalShortcut -->|Start/Stop| Recorder[🎙️ Audio Recorder]
    Recorder -->|16kHz WAV| Pipeline{Transcription Pipeline}
    
    Pipeline -->|Local Mode| WASM[🔒 Whisper WASM]
    Pipeline -->|Cloud Mode| API[☁️ OpenAI API]
    
    WASM --> RawText[📄 Raw Text]
    API --> RawText
    
    RawText --> Enrichment{✨ AI Enrichment}
    Enrichment -->|Clean/Format| LLM[🧠 LLM Processor]
    Enrichment -->|None| FinalText
    
    LLM --> FinalText[📝 Final Text]
    
    FinalText --> Clipboard[📋 System Clipboard]
    Clipboard -->|Auto-Paste| ActiveApp[🖥️ Active Application]
```

## 🛠️ Tech Stack

- **Electron**: For cross-platform desktop integration and global shortcuts.
- **Next.js (Nextron)**: React-based renderer for a modern, responsive UI.
- **TypeScript**: Strict type safety across main and renderer processes.
- **Whisper**: State-of-the-art speech recognition (Local via Transformers.js, Cloud via OpenAI).
- **LLMs**: GPT-4o-mini for intelligent text enrichment.
- **Vitest**: Unit and integration testing.

## 💡 Design Decisions

### Why Local Whisper?
Privacy is paramount. Using WebAssembly-based Whisper means your voice data never has to leave your machine. It works completely offline and has zero latency overhead from network requests.

### Why Toggle Recording?
We use a global hotkey toggle (Press & Release) instead of hold-to-talk. This ensures reliability across different operating systems and preventing issues with key-up events getting swallowed by other applications. It also allows for longer dictations without finger fatigue.

### Why Auto-Paste?
The goal is to reduce friction. Manually copying and pasting breaks flow. Auto-paste makes the app feel like a native extension of your keyboard. THIS REQUIRES ACCESSIBILITY PERMISSION.

## 💻 Development

### Prerequisites
- Node.js 18+
- macOS (for global hotkeys and automation features)

### Setup

```bash
# Clone repository
git clone https://github.com/schauersbergern/voice-intelligence-app.git
cd voice-intelligence-app

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Testing

```bash
# Run unit and integration tests
npm test
```

### Building

**macOS:**
```bash
# Build for macOS (Universal DMG)
npm run build:mac
```

**Windows:**
```bash
# Build for Windows (NSIS Installer)
npm run build:win
```

## 📂 Project Structure

```
voice-intelligence-app/
├── main/                   # Electron Main Process
│   ├── background.ts       # Entry point
│   ├── whisper-handler.ts  # Transcription logic
│   └── tray.ts             # Menu bar integration
├── renderer/               # Next.js Renderer Process
│   ├── pages/              # UI Pages
│   ├── components/         # React Components
│   └── hooks/              # Custom Hooks (useAudioRecorder)
├── shared/                 # Shared Types & constants
└── tests/                  # Vitest Test Suite
```

## 📄 License

MIT © Voice Intelligence Team
