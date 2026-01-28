# Mission 7: UI Polish Implementation Plan

## Goal

Create a clean, professional interface with polished visuals, copy functionality, loading states, and keyboard navigation.

---

## Proposed Changes

### Design System

#### [MODIFY] [globals.css](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/styles/globals.css)

Add design tokens:
- CSS custom properties for colors, spacing, border-radius
- Dark mode as default
- 8px grid spacing
- System font stack
- Smooth transitions

---

### Components

#### [NEW] [RecordButton.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/components/RecordButton.tsx)

Large, centered record button with:
- Pulsing animation when recording
- Smooth state transitions
- Disabled state styling

---

#### [NEW] [TranscriptDisplay.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/components/TranscriptDisplay.tsx)

Transcript output with:
- Clean text display
- Copy button with "Copied!" feedback
- Word count display
- Scrollable for long content

---

#### [NEW] [LoadingState.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/components/LoadingState.tsx)

Loading indicators:
- Spinner animation
- "Transcribing..." / "Enhancing..." text
- Elapsed time display

---

### Main Page

#### [MODIFY] [index.tsx](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/renderer/pages/index.tsx)

- Compose new components
- Add keyboard event handlers (Enter to toggle, Cmd+C to copy)
- Improve layout with glass-morphism effects

---

### Main Process

#### [MODIFY] [background.ts](file:///Users/nikolausschauersberger/Projects/claude/voice-intelligence-app/main/background.ts)

- Add window constraints: minWidth, minHeight, maxWidth, maxHeight

---

## File Summary

| Action | File | Description |
|--------|------|-------------|
| MODIFY | `renderer/styles/globals.css` | Design tokens |
| NEW | `renderer/components/RecordButton.tsx` | Record button component |
| NEW | `renderer/components/TranscriptDisplay.tsx` | Transcript with copy |
| NEW | `renderer/components/LoadingState.tsx` | Loading indicators |
| MODIFY | `renderer/pages/index.tsx` | Compose components |
| MODIFY | `main/background.ts` | Window constraints |

---

## Verification Plan

### TypeScript Check
```bash
npx tsc --noEmit
```

### Manual Testing

1. **Start app**: `npm run dev`
2. **Visual check**:
   - Design looks polished with dark mode
   - Record button is prominent and centered
3. **Record and transcribe**:
   - Loading states display correctly
   - Transcript displays with copy button
4. **Copy functionality**:
   - Click copy button → shows "Copied!" feedback
   - Verify text in clipboard
5. **Keyboard navigation**:
   - Press Enter → starts/stops recording
   - Press Cmd+C (with result) → copies to clipboard
6. **Window constraints**:
   - Try resizing window below min size → should be constrained
   - Try resizing above max → should be constrained

---

## Design Decisions

1. **Keep vanilla CSS**: No external CSS frameworks to minimize complexity.

2. **Component extraction**: Creating focused components for better organization, but keeping them simple.

3. **Glass-morphism for settings panel**: Subtle backdrop blur for modern look (already in current design, will enhance).
