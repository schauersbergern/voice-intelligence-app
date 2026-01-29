# Mission 10: User Requirements Implementation

## Objective
Implement specific UX improvements and workflow optimizations based on user feedback.

---

## Requirements

### R-001: Disable Record Button During Model Loading
- **Description**: When local transcription is selected, the Whisper model must load first. Disable the Record button until model is ready.
- **Acceptance Criteria**:
  - [x] Record button shows disabled state while model loads
  - [x] Loading indicator shown (e.g., "Loading speech model...")
  - [x] Button becomes active only after model is ready
  - [x] If model fails to load, show error and keep button disabled

---

### R-002: Persist Transcription Engine Setting
- **Description**: Save the user's transcription engine choice. Default to "Local" on first launch. Remember last selection on subsequent launches.
- **Acceptance Criteria**:
  - [x] First launch defaults to "Local (Offline)"
  - [x] Selection is persisted to electron-store or similar
  - [x] On app restart, last used engine is pre-selected
  - [x] Works for both Local and API options

---

### R-003: Enrichment Default Off
- **Description**: Enrichment should be disabled by default. User must explicitly enable it.
- **Acceptance Criteria**:
  - [x] First launch has enrichment mode set to "None" or "Off"
  - [x] This setting is also persisted
  - [x] When off, transcription result goes directly to output (no LLM processing)

---

### R-004: Unified API Key
- **Description**: Use a single OpenAI API key for both transcription (Whisper API) and enrichment (GPT). Remove separate key fields.
- **Acceptance Criteria**:
  - [x] Single "OpenAI API Key" input field in settings
  - [x] Same key used for Whisper API calls and GPT enrichment calls
  - [x] Remove any separate/duplicate API key fields
  - [x] Clear labeling: "OpenAI API Key (for transcription & enrichment)"

---

### R-005: OpenAI-Only Enrichment Models
- **Description**: Simplify LLM dropdown to show only OpenAI models. Remove Anthropic/other options to reduce confusion.
- **Acceptance Criteria**:
  - [x] LLM dropdown shows only: gpt-4o-mini, gpt-4o, gpt-4-turbo
  - [x] Remove any Anthropic Claude options
  - [x] Remove "LLM Provider" selector if present
  - [x] Keep it simple: one dropdown for model selection

---

### R-006: Global Toggle-to-Talk Hotkey
- **Description**: Implement a global hotkey that toggles recording on and off (modified from push-to-talk for stability).
- **Acceptance Criteria**:
  - [x] Global hotkey (suggest: Cmd+Shift+Space or configurable)
  - [x] Key Press → Start recording
  - [x] Key Press (again) → Stop recording, trigger transcription
  - [x] Works even when app is not focused
  - [x] Visual feedback in app when hotkey is active
  - [x] "Toggle-to-Talk" behavior implementations

---

### R-007: Auto-Copy to Clipboard
- **Description**: When transcription (and optional enrichment) completes, automatically copy result to system clipboard.
- **Acceptance Criteria**:
  - [x] Result is copied to clipboard automatically after processing
  - [x] No manual "Copy" button click required
  - [x] Optional: Show brief "Copied to clipboard" toast
  - [x] Works for both local and API transcription

---

### R-008: Auto-Paste to Active Text Field
- **Description**: When the global hotkey is released and a text field in any application is focused, automatically paste the transcription result into that field.
- **Acceptance Criteria**:
  - [x] After hotkey release → transcription → clipboard
  - [x] Detect if a text input is focused in another app
  - [x] Automatically trigger paste (Cmd+V) into that field
  - [x] Should feel seamless: hold key, speak, release, text appears
  - [x] Optional: Add small delay to ensure clipboard is ready
  - [x] This is the "magic" feature — voice-to-text-field in one action

**Technical Notes for R-008**:
- Use Electron's `robot` or similar to simulate Cmd+V
- May need accessibility permissions on macOS
- Consider a short delay (~100ms) after clipboard write before paste
- If no text field focused, just leave in clipboard (no error)

---

## Implementation Order

1. **R-002** - Persist settings (foundation for others)
2. **R-003** - Enrichment default off
3. **R-004** - Unified API key
4. **R-005** - OpenAI-only models
5. **R-001** - Disable button during load
6. **R-006** - Push-to-talk hotkey
7. **R-007** - Auto-copy
8. **R-008** - Auto-paste (depends on R-006, R-007)

---

## Dependencies

- Mission 9 (Polish) should be complete or in progress
- Local Whisper (WebAssembly) should be working
- electron-store or similar for persistence

---

## Testing Checklist

- [ ] Fresh install: defaults to Local engine, Enrichment off
- [ ] Change to API engine, restart app → API still selected
- [ ] Single API key works for both Whisper API and GPT
- [ ] Record button disabled while "Loading model..."
- [ ] Hold hotkey → recording starts
- [ ] Release hotkey → transcription runs → result in clipboard
- [ ] If TextEdit/Notes/Slack focused → text auto-pastes
- [ ] Entire flow feels instant and magical

---

## Success Criteria

User can:
1. Open app (defaults to local, no enrichment)
2. Hold global hotkey
3. Speak
4. Release hotkey
5. Text appears in whatever text field was focused

Zero clicks. Pure voice-to-text workflow.
