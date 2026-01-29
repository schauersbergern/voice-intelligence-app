import { describe, it, expect } from 'vitest';
import { formatHotkey, buildAccelerator } from '../../renderer/components/HotkeyInput';

describe('HotkeyInput', () => {
    describe('formatHotkey', () => {
        it('should format simple key for Mac', () => {
            // Mock navigator
            Object.defineProperty(window, 'navigator', {
                value: { platform: 'MacIntel' },
                writable: true
            });
            expect(formatHotkey('Command+Space')).toBe('⌘ Space');
        });

        it('should format modifiers for Mac', () => {
            Object.defineProperty(window, 'navigator', {
                value: { platform: 'MacIntel' },
                writable: true
            });
            expect(formatHotkey('CommandOrControl+Shift+A')).toBe('⌘ ⇧ A');
        });

        it('should format for Windows/Linux', () => {
            Object.defineProperty(window, 'navigator', {
                value: { platform: 'Win32' },
                writable: true
            });
            expect(formatHotkey('CommandOrControl+Space')).toBe('Ctrl Space');
        });
    });

    describe('buildAccelerator', () => {
        it('should build accelerator from keyboard event', () => {
            const event = {
                key: 'k',
                ctrlKey: true,
                altKey: true,
                shiftKey: false,
                metaKey: false,
            } as KeyboardEvent;

            expect(buildAccelerator(event)).toBe('Control+Alt+K');
        });

        it('should handle special keys', () => {
            const event = {
                key: ' ',
                ctrlKey: false,
                altKey: true,
                shiftKey: false,
                metaKey: false,
            } as KeyboardEvent;
            expect(buildAccelerator(event)).toBe('Alt+Space');
        });

        it('should return null if no modifier pressed', () => {
            const event = {
                key: 'a',
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
            } as KeyboardEvent;
            expect(buildAccelerator(event)).toBe(null);
        });
    });
});
