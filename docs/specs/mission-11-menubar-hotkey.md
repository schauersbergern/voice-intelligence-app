# Mission 11: Menu Bar, Configurable Hotkey & Background Operation

## Objective
Add system menu bar integration, make the hotkey configurable, and ensure robust background operation.

---

## Requirements

### R-001: System Menu Bar Integration (macOS + Windows)

**macOS**: Add entry to the system menu bar (top right, near clock)
**Windows**: Add entry to the system tray (bottom right, near clock)

- **Menu Bar Icon**: Simple microphone icon (changes color when recording)
- **Click Action**: Opens dropdown menu with quick settings

**Menu Items**:
```
┌─────────────────────────────┐
│ 🎙 Voice Intelligence       │
├─────────────────────────────┤
│ Transcription Engine    ▶  │
│   ○ Local (Offline)         │
│   ○ OpenAI Whisper API      │
├─────────────────────────────┤
│ Language               ▶   │  ← Only visible when Local engine selected
│   ○ English                 │
│   ○ German                  │
│   ○ Spanish                 │
│   ○ French                  │
│   ○ Auto-detect             │
├─────────────────────────────┤
│ Enrichment             ▶   │
│   ○ Off                     │
│   ○ Clean                   │
│   ○ Format                  │
│   ○ Summarize               │
├─────────────────────────────┤
│ Show Window                 │
│ Quit                        │
└─────────────────────────────┘
```

**Acceptance Criteria**:
- [x] Menu bar icon visible on macOS (Tray class)
- [x] System tray icon visible on Windows
- [x] Transcription engine switchable from menu
- [x] Language selector only shows when Local engine is active
- [x] Enrichment mode switchable from menu
- [x] "Show Window" brings main window to front
- [x] "Quit" exits the app completely
- [x] Icon changes state when recording (e.g., red dot or different icon)

---

### R-002: Configurable Push-to-Talk Hotkey

**Current Problem**: 
- Cmd+Shift+Space is hardcoded
- "Press Enter" handling doesn't work
- Two hotkeys is confusing

**Solution**:
- Single configurable hotkey
- Default: `Option+Space` (macOS) / `Alt+Space` (Windows)
- Remove Enter key handling completely
- Hotkey configuration in Settings page (NOT in menu bar)

**Settings UI for Hotkey**:
```
┌─────────────────────────────────────────┐
│ 🎹 Push-to-Talk Hotkey                  │
│                                         │
│ Current: ⌥ Space                        │
│                                         │
│ [Click to change...]                    │
│                                         │
│ Press any key combination to set new    │
│ hotkey. Press Escape to cancel.         │
└─────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [x] Default hotkey is Option+Space (macOS) / Alt+Space (Windows)
- [x] Remove ALL Enter key handling for recording
- [x] Remove Cmd+Shift+Space hardcoded hotkey
- [x] Hotkey is configurable in Settings page
- [x] "Click to change" enters listening mode
- [x] Pressing keys during listening mode captures the combo
- [x] Escape cancels hotkey change
- [x] New hotkey is persisted and survives app restart
- [x] Hotkey displayed in human-readable format (e.g., "⌥ Space" not "Alt+32")
- [x] Conflict detection: warn if hotkey conflicts with system shortcuts

---

### R-003: Robust Background Operation

**Requirement**: App must work reliably when:
- Main window is closed/hidden
- App is not focused
- User is working in other applications
- System goes to sleep and wakes up

**Acceptance Criteria**:
- [x] Closing main window hides it (does not quit app)
- [x] App continues running via menu bar/tray
- [x] Global hotkey works when any app is focused
- [x] Recording works when window is hidden
- [x] Auto-paste works into other applications
- [x] App survives system sleep/wake cycle
- [ ] No memory leaks over extended background operation
- [x] Menu bar icon always accessible to reopen window

**Technical Implementation**:
- Set `app.on('window-all-closed', ...)` to NOT quit on macOS
- Use `mainWindow.hide()` instead of `mainWindow.close()`
- Keep Tray instance alive
- Re-register global shortcuts after wake if needed

---

## Implementation Order

1. **R-003** - Background operation (foundation)
2. **R-001** - Menu bar/tray integration
3. **R-002** - Configurable hotkey in settings

---

## Platform-Specific Notes

### macOS
- Use `Tray` class for menu bar
- Use `systemPreferences.isTrustedAccessibilityClient()` to check permissions
- Option key is `Alt` in Electron accelerator strings
- Default: `Alt+Space`

### Windows
- Use `Tray` class for system tray
- Tray appears in bottom-right notification area
- Alt+Space may conflict with window menu — consider `Ctrl+Space` as Windows default
- Default: `Alt+Space` (or `Ctrl+Space` if conflicts)

---

## Files to Create/Modify

- `main/tray.ts` - New file for Tray/menu bar logic
- `main/background.ts` - Update window lifecycle handling
- `main/shortcuts.ts` - Refactor for configurable hotkey
- `renderer/pages/settings.tsx` - Add hotkey configuration UI
- `renderer/components/HotkeyInput.tsx` - New component for capturing hotkey
- `shared/types.ts` - Add types for settings
- `main/preload.ts` - Expose hotkey configuration IPC

---

## Language Options for Local Whisper

When Local engine is selected, support these languages:
- English (en)
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)
- Portuguese (pt)
- Dutch (nl)
- Polish (pl)
- Auto-detect (auto)

Store language preference, persist across restarts.

---

## Testing Checklist

- [ ] Menu bar icon appears on app launch
- [ ] Menu shows correct options
- [ ] Switching transcription engine from menu works
- [ ] Language selector hidden when API mode selected
- [ ] Language selector visible when Local mode selected
- [ ] Enrichment mode switchable from menu
- [ ] "Show Window" works
- [ ] "Quit" fully exits app
- [ ] Close window → app stays in menu bar
- [ ] Hotkey works with window hidden
- [ ] Settings shows current hotkey
- [ ] Can change hotkey in settings
- [ ] New hotkey works immediately
- [ ] Hotkey persists after restart
- [ ] App works after system sleep/wake
- [ ] No errors after 30+ minutes of background operation

---

## Success Criteria

User can:
1. Launch app → appears in menu bar
2. Close window → app stays running
3. Change settings from menu bar dropdown
4. Configure custom hotkey in settings
5. Use push-to-talk from any application
6. App runs reliably for hours in background