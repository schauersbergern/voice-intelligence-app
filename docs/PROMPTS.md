# Claude Code Prompts Playbook

Use these prompts sequentially. Copy-paste into Claude Code.

---

## Mission 1: Foundation

### Prompt 1.1 - Explore & Plan
```
Read CLAUDE.md and docs/specs/mission-1-foundation.md completely.

Then explore how Nextron projects are typically structured. Don't write any code yet.

Think hard about the best approach to initialize this project given:
- We need Electron + Next.js
- TypeScript strict mode
- Minimal dependencies
- macOS as primary target

Write your implementation plan to docs/plans/mission-1-plan.md
```

### Prompt 1.2 - Implement (after reviewing plan)
```
Implement the Mission 1 plan from docs/plans/mission-1-plan.md

Work step by step:
1. Initialize the Nextron project structure
2. Configure TypeScript strict mode
3. Set up Next.js for static export
4. Configure basic window (400x600)
5. Verify with npm run dev

If you encounter issues, explain them rather than improvising solutions.
```

### Prompt 1.3 - Verify & Commit
```
Verify Mission 1 is complete:
1. Run npm run dev and confirm app launches
2. Check TypeScript has no errors
3. Confirm window appears at correct size

If all good, commit with message: "feat: Mission 1 - Foundation setup with Nextron"

Update docs/specs/mission-1-foundation.md to mark completed items.
```

---

## Mission 2: IPC Layer

### Prompt 2.1 - Explore & Plan
```
Read docs/specs/mission-2-ipc-layer.md completely.

Explore the current codebase structure from Mission 1.
Review Electron's contextBridge documentation.

Think hard about implementing secure IPC:
- Type safety between processes
- No direct ipcRenderer exposure
- Clean API surface

Write your implementation plan to docs/plans/mission-2-plan.md
```

### Prompt 2.2 - Implement
```
Implement the Mission 2 plan from docs/plans/mission-2-plan.md

Create the IPC layer step by step:
1. Define types in shared/types.ts
2. Implement preload.ts with contextBridge
3. Register IPC handlers in main
4. Add type declaration for window.electronAPI
5. Add test button in renderer

Verify IPC works before considering this complete.
```

### Prompt 2.3 - Verify & Commit
```
Verify Mission 2 is complete:
1. Click the ping button in UI
2. Confirm "pong" response is displayed
3. Check no TypeScript errors
4. Verify preload.ts uses contextBridge correctly

Commit with message: "feat: Mission 2 - Secure IPC layer with typed bridge"
```

---

## Mission 3: Audio Capture

### Prompt 3.1 - Explore & Plan
```
Read docs/specs/mission-3-audio-capture.md completely.

Research Web Audio API for recording with specific requirements:
- 16kHz sample rate
- Mono channel
- WAV format output

Think hard about:
- AudioContext configuration
- Recording state management
- WAV encoding implementation
- Data transfer to main process

Write your implementation plan to docs/plans/mission-3-plan.md
```

### Prompt 3.2 - Implement
```
Implement the Mission 3 plan from docs/plans/mission-3-plan.md

Build audio capture step by step:
1. Create useAudioRecorder hook
2. Implement WAV encoding utility
3. Add recording UI (button, indicator)
4. Extend IPC for audio transfer
5. Test recording produces valid WAV

Focus on getting correct audio format - this is critical for Whisper.
```

### Prompt 3.3 - Verify & Commit
```
Verify Mission 3 is complete:
1. Start recording, speak, stop recording
2. Verify audio data is captured
3. Confirm WAV format is correct (16kHz, mono)
4. Check recording state UI works

Commit with message: "feat: Mission 3 - Microphone capture with WAV encoding"
```

---

## Mission 4: Whisper Integration

### Prompt 4.1 - Explore & Plan
```
Read docs/specs/mission-4-whisper.md completely.

Research local Whisper options for Node.js/Electron:
- whisper-node
- whisper.cpp bindings
- Other alternatives

Also review OpenAI's Whisper API documentation.

Think hard about:
- Which local binding is most reliable for Electron
- How to run transcription without blocking main thread
- Error handling for both modes
- Model file management

Write your implementation plan to docs/plans/mission-4-plan.md
```

### Prompt 4.2 - Implement Local Whisper
```
Implement local Whisper from the Mission 4 plan.

Step by step:
1. Install chosen Whisper binding
2. Create whisper-local.ts handler
3. Set up model loading (use base.en)
4. Implement transcription function
5. Run in utilityProcess to avoid blocking

Note: Model download instructions should be documented, not automated.
```

### Prompt 4.3 - Implement API Whisper
```
Continue Mission 4 - implement OpenAI Whisper API.

Step by step:
1. Create whisper-api.ts handler
2. Implement API call with proper multipart/form-data
3. Handle API key from settings
4. Add error handling (invalid key, rate limit)

Then create unified whisper-handler.ts that routes to local or API.
```

### Prompt 4.4 - Integrate & Commit
```
Complete Mission 4 integration:
1. Connect audio capture to whisper handler
2. Display transcription result in UI
3. Add mode toggle (local/api) in UI
4. Test both modes work

Commit with message: "feat: Mission 4 - Dual-mode Whisper transcription"
```

---

## Mission 5: Global Hotkey

### Prompt 5.1 - Explore & Plan
```
Read docs/specs/mission-5-hotkey.md completely.

Research Electron globalShortcut API and macOS considerations:
- Accessibility permissions
- Shortcut conflicts
- Window management patterns

Think hard about:
- Toggle behavior (show/hide, start/stop)
- State synchronization between main and renderer
- Settings persistence for custom hotkeys

Write your implementation plan to docs/plans/mission-5-plan.md
```

### Prompt 5.2 - Implement
```
Implement the Mission 5 plan.

Step by step:
1. Create window-manager.ts for visibility control
2. Register global shortcut in main
3. Implement toggle logic
4. Connect to recording state
5. Add IPC for renderer notification

Default hotkey: Cmd+Shift+Space (mac) / Ctrl+Shift+Space (win)
```

### Prompt 5.3 - Verify & Commit
```
Verify Mission 5 is complete:
1. Press hotkey with app not focused
2. Confirm window appears
3. Press hotkey again to start recording
4. Press again to stop and process
5. Verify entire flow works hands-free

Commit with message: "feat: Mission 5 - Global hotkey activation"
```

---

## Mission 6: LLM Enrichment

### Prompt 6.1 - Explore & Plan
```
Read docs/specs/mission-6-enrichment.md completely.

Review:
- OpenAI Chat Completions API
- Anthropic Messages API (if supporting)
- Prompt engineering for text processing

Think hard about:
- System prompts for each enrichment mode
- Token limits and cost optimization
- Streaming vs blocking responses
- Fallback behavior

Write your implementation plan to docs/plans/mission-6-plan.md
```

### Prompt 6.2 - Implement
```
Implement the Mission 6 plan.

Step by step:
1. Create enrichment-prompts.ts with mode prompts
2. Create enrichment.ts handler
3. Implement OpenAI API call
4. Add mode selector to UI
5. Integrate into transcription pipeline

Start with 'clean' and 'format' modes, add others after verifying these work.
```

### Prompt 6.3 - Verify & Commit
```
Verify Mission 6 is complete:
1. Record speech, get transcription
2. Verify enrichment processes result
3. Test 'clean' mode removes filler words
4. Test 'format' mode adds structure
5. Verify 'none' mode passes raw text

Commit with message: "feat: Mission 6 - LLM enrichment pipeline"
```

---

## Mission 7: UI Polish

### Prompt 7.1 - Plan
```
Read docs/specs/mission-7-ui-polish.md completely.

Review the current UI state and identify what needs polish.

Think hard about:
- Dark mode implementation
- Component structure
- State transitions
- Loading indicators
- Copy functionality

Write your implementation plan to docs/plans/mission-7-plan.md
```

### Prompt 7.2 - Implement Core UI
```
Implement Mission 7 core UI improvements.

Focus on:
1. Dark mode color scheme
2. Recording button (large, centered, clear states)
3. Recording indicator (pulsing, timer)
4. Transcript display (clean, scrollable)
5. Copy button with feedback

Keep it minimal and clean - think Raycast aesthetic.
```

### Prompt 7.3 - Implement Settings
```
Continue Mission 7 - implement settings page.

Create settings.tsx with sections:
1. Transcription mode (local/api toggle)
2. API keys (masked input fields)
3. Enrichment mode selector
4. Hotkey display/change
5. General preferences

Make it accessible via gear icon.
```

### Prompt 7.4 - Final Polish & Commit
```
Complete Mission 7 polish:
1. Add loading states for all async operations
2. Smooth transitions between states
3. Error states with retry options
4. Keyboard navigation
5. Test resize behavior

Commit with message: "feat: Mission 7 - Polished UI with dark mode"
```

---

## Mission 8: Packaging

### Prompt 8.1 - Plan
```
Read docs/specs/mission-8-packaging.md completely.

Research:
- electron-builder configuration for macOS
- Native module packaging (Whisper bindings)
- Entitlements for microphone access

Think hard about:
- Build configuration
- Asset bundling
- Model file inclusion
- Notarization process

Write your implementation plan to docs/plans/mission-8-plan.md
```

### Prompt 8.2 - Configure Build
```
Implement build configuration from Mission 8 plan.

Step by step:
1. Create electron-builder.yml
2. Create macOS entitlements
3. Update package.json scripts
4. Configure asarUnpack for native modules
5. Test build produces .dmg

Don't worry about code signing yet - just get unsigned build working.
```

### Prompt 8.3 - Write README
```
Create comprehensive README.md for the project.

Include:
1. Project overview and problem statement
2. Features list
3. Architecture overview
4. Setup instructions
5. Usage guide
6. Design decisions and rationale
7. Development instructions
8. Build instructions

Make it compelling - this is for the coding challenge judges.
```

### Prompt 8.4 - Final Verification
```
Final verification checklist:

1. Clean install from .dmg works
2. Microphone permission requested on first use
3. Global hotkey works when app not focused
4. Record → Transcribe → Enrich flow works
5. Both local and API transcription work
6. Settings persist after restart
7. README is complete and accurate
8. Code is clean, no console.logs

If all pass, commit: "chore: Mission 8 - Production build and documentation"
```

---

## Context Management Commands

### When context is getting heavy (>70%)
```
Dump your current progress, understanding, and remaining tasks to docs/session-notes/[YYYY-MM-DD].md

Include:
- What's completed
- Current state
- Next steps
- Any blockers or decisions needed
```

### After /clear, to resume
```
Read CLAUDE.md and docs/session-notes/[YYYY-MM-DD].md

Continue from where we left off. Summarize what you understand and confirm next steps before proceeding.
```

---

## Emergency Prompts

### If something is broken
```
Stop. Don't write any code.

Explain what you think is wrong and why. 
List 3 possible causes in order of likelihood.
Wait for my input before attempting fixes.
```

### If lost in complexity
```
/clear

Read CLAUDE.md fresh.
Read the current mission spec.
Start with a simple, minimal implementation.
We can iterate from there.
```
