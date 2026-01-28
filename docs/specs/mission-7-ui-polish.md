# Mission 7: UI Polish

## Objective
Create a clean, professional interface that integrates seamlessly into workflow.

## Success Criteria
- [ ] UI is visually polished and minimal
- [ ] Recording state is immediately clear
- [ ] Transcript is easy to read and copy
- [ ] Settings are accessible but not intrusive
- [ ] App feels native to macOS

## Steps

### 7.1 Design System
Establish minimal design tokens:
- Colors: Dark mode preferred (easier on eyes, feels native)
- Font: System font (-apple-system, BlinkMacSystemFont)
- Spacing: 8px grid
- Border radius: 8px for cards, 4px for buttons

### 7.2 Main Recording View
Components:
- Large record button (centered, prominent)
- Recording indicator (pulsing red dot + timer)
- Waveform visualization (optional, nice-to-have)
- Mode selector (dropdown or segmented control)

### 7.3 Transcript Display
- Clean text area showing result
- Copy button (with "Copied!" feedback)
- Character/word count
- Scroll for long transcripts

### 7.4 Settings Page
Accessible via gear icon or Cmd+,
Sections:
- **Transcription**: Mode (local/API), API key input
- **Enrichment**: Mode selector, LLM provider, API key
- **Hotkey**: Current shortcut, change button
- **General**: Start at login, always on top

### 7.5 Loading States
- Recording: Pulsing indicator, elapsed time
- Transcribing: Spinner + "Transcribing..."
- Enriching: Spinner + "Enhancing..."
- Error: Red text, retry button

### 7.6 Keyboard Navigation
- Tab through interactive elements
- Enter to start/stop recording
- Cmd+C to copy result
- Esc to close settings

### 7.7 Responsive Layout
Window is resizable:
- Min: 300x400
- Default: 400x600
- Max: 600x800 (keep it compact)

## Files to Create/Modify
- renderer/styles/globals.css (design tokens, base styles)
- renderer/components/RecordButton.tsx
- renderer/components/TranscriptDisplay.tsx
- renderer/components/ModeSelector.tsx
- renderer/components/SettingsPanel.tsx
- renderer/components/LoadingState.tsx
- renderer/pages/index.tsx (compose components)
- renderer/pages/settings.tsx (settings UI)

## Dependencies
- Missions 1-6 must be complete (full functionality)

## Libraries (Optional)
- Tailwind CSS (if quick styling needed)
- Framer Motion (for subtle animations)
- Lucide React (for icons)

Keep dependencies minimal — vanilla CSS is fine for this scope.

## Visual Reference
Think: Raycast, CleanShot X, or Whisper Transcription
- Floating window aesthetic
- Dark mode
- Minimal chrome
- Focus on the content

## Polish Details
- Smooth transitions between states
- Subtle shadows for depth
- High contrast for accessibility
- No janky layouts during state changes
