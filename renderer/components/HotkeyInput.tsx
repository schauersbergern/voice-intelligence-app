/**
 * HotkeyInput Component
 * Allows users to capture and set a custom global hotkey
 */

import React, { useState, useCallback, useEffect } from 'react';

interface HotkeyInputProps {
    currentHotkey: string;
    onHotkeyChange: (accelerator: string) => Promise<boolean>;
}

/**
 * Convert Electron accelerator to human-readable format
 */
function formatHotkey(accelerator: string): string {
    if (!accelerator) return '';

    const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');

    return accelerator
        .replace(/CommandOrControl/gi, isMac ? '⌘' : 'Ctrl')
        .replace(/Command/gi, '⌘')
        .replace(/Control/gi, isMac ? '⌃' : 'Ctrl')
        .replace(/Alt/gi, isMac ? '⌥' : 'Alt')
        .replace(/Shift/gi, isMac ? '⇧' : 'Shift')
        .replace(/\+/g, ' ');
}

/**
 * Build Electron accelerator from keyboard event
 */
function buildAccelerator(e: KeyboardEvent): string | null {
    const parts: string[] = [];

    // Modifiers
    if (e.ctrlKey) parts.push('Control');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Command');

    // Main key
    const key = e.key;

    // Ignore if only modifiers pressed
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
        return null;
    }

    // Special key mappings
    const keyMap: Record<string, string> = {
        ' ': 'Space',
        'ArrowUp': 'Up',
        'ArrowDown': 'Down',
        'ArrowLeft': 'Left',
        'ArrowRight': 'Right',
    };

    const mappedKey = keyMap[key] || (key.length === 1 ? key.toUpperCase() : key);
    parts.push(mappedKey);

    // Need at least one modifier for a valid global shortcut
    if (parts.length < 2) {
        return null;
    }

    return parts.join('+');
}

export function HotkeyInput({ currentHotkey, onHotkeyChange }: HotkeyInputProps): JSX.Element {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayHotkey, setDisplayHotkey] = useState(currentHotkey);

    useEffect(() => {
        setDisplayHotkey(currentHotkey);
    }, [currentHotkey]);

    const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Escape cancels
        if (e.key === 'Escape') {
            setIsListening(false);
            setError(null);
            return;
        }

        const accelerator = buildAccelerator(e);
        if (!accelerator) return;

        // Try to set the new hotkey
        const success = await onHotkeyChange(accelerator);

        if (success) {
            setDisplayHotkey(accelerator);
            setIsListening(false);
            setError(null);
        } else {
            setError('This hotkey conflicts with system shortcuts. Try another.');
        }
    }, [onHotkeyChange]);

    useEffect(() => {
        if (isListening) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
        return undefined;
    }, [isListening, handleKeyDown]);

    return (
        <div className="hotkey-input">
            <div className="hotkey-label">🎹 Push-to-Talk Hotkey</div>

            <div className="hotkey-display">
                {isListening ? (
                    <span className="hotkey-listening">Press keys...</span>
                ) : (
                    <span className="hotkey-current">{formatHotkey(displayHotkey)}</span>
                )}
            </div>

            <button
                className={`hotkey-button ${isListening ? 'listening' : ''}`}
                onClick={() => {
                    setIsListening(!isListening);
                    setError(null);
                }}
            >
                {isListening ? 'Press Escape to cancel' : 'Click to change...'}
            </button>

            {error && <div className="hotkey-error">{error}</div>}

            <style jsx>{`
                .hotkey-input {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    margin-bottom: 16px;
                }
                
                .hotkey-label {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: rgba(255, 255, 255, 0.9);
                }
                
                .hotkey-display {
                    font-size: 24px;
                    font-weight: 700;
                    text-align: center;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    margin-bottom: 12px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
                }
                
                .hotkey-current {
                    color: #00d4ff;
                }
                
                .hotkey-listening {
                    color: #ff6b6b;
                    animation: pulse 1s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .hotkey-button {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .hotkey-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .hotkey-button.listening {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
                }
                
                .hotkey-error {
                    margin-top: 12px;
                    padding: 8px 12px;
                    background: rgba(255, 107, 107, 0.2);
                    border-radius: 6px;
                    color: #ff6b6b;
                    font-size: 13px;
                }
            `}</style>
        </div>
    );
}
