# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-01-29

### 🚀 Initial Release

The first public release of **Voice Intelligence**, a desktop voice-to-text application for macOS.

#### Features
- **Push-to-Talk**: Global hotkey (`Alt+Space`) support to record from anywhere.
- **Local Transcription**: Private, offline speech-to-text using WebAssembly Whisper.
- **Cloud Transcription**: High-accuracy transcription using OpenAI Whisper API.
- **AI Enrichment**: Integration with OpenAI/Anthropic to clean, format, and summarize text.
- **Auto-Paste**: Automatically types transcription into the active application.
- **Menu Bar Integration**: Quick access to settings and modes from the system tray.
- **Configurable**:Customizable hotkeys and language settings.

#### Technical
- Built with Electron and Next.js (Nextron).
- TypeScript for type safety.
- Vitest for unit and integration testing.
