import { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { RecordButton } from '../components/RecordButton';
import { TranscriptDisplay } from '../components/TranscriptDisplay';
import { HotkeyInput } from '../components/HotkeyInput';
import { transcribeLocal, isModelReady, initializeWhisper } from '../lib/whisper-local';
import type { TranscriptionResult, EnrichmentMode, WhisperMode } from '../../shared/types';

export default function Home(): JSX.Element {
    const { state, error: recordError, duration, startRecording, stopRecording } = useAudioRecorder();
    const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
    const [transcribing, setTranscribing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [whisperMode, setWhisperModeState] = useState<WhisperMode>('api');
    const [whisperLanguage, setWhisperLanguage] = useState<string>('english');
    const [apiKey, setApiKeyState] = useState('');
    const [enrichmentMode, setEnrichmentModeState] = useState<EnrichmentMode>('clean');
    const [showSettings, setShowSettings] = useState(false);
    const [hotkeyTriggered, setHotkeyTriggered] = useState(false);
    const [modelLoadingStatus, setModelLoadingStatus] = useState<string | null>(null);
    const [hotkey, setHotkey] = useState<string>('Alt+Space');

    // Ref to track recording state for hotkey handler
    const stateRef = useRef(state);
    stateRef.current = state;

    // Ref to track transcribing state
    const transcribingRef = useRef(transcribing);
    transcribingRef.current = transcribing;

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getSettings().then((settings) => {
                setWhisperModeState(settings.whisperMode);
                setWhisperLanguage(settings.whisperLanguage);
                setEnrichmentModeState(settings.enrichmentMode);
                setApiKeyState(settings.apiKey);
                if (settings.hotkey) setHotkey(settings.hotkey);
            }).catch(() => { });
        }
    }, []);

    // Listen for settings changes from menu bar
    useEffect(() => {
        if (!window.electronAPI) return;
        const cleanup = window.electronAPI.onSettingsChanged((changed) => {
            if (changed.whisperMode !== undefined) setWhisperModeState(changed.whisperMode);
            if (changed.whisperLanguage !== undefined) setWhisperLanguage(changed.whisperLanguage);
            if (changed.enrichmentMode !== undefined) setEnrichmentModeState(changed.enrichmentMode);
            if (changed.apiKey !== undefined) setApiKeyState(changed.apiKey);
            if (changed.hotkey !== undefined) setHotkey(changed.hotkey);
        });
        return cleanup;
    }, []);

    // Listen for global hotkey toggle
    useEffect(() => {
        if (!window.electronAPI) return;
        const cleanup = window.electronAPI.onRecordingToggle(() => setHotkeyTriggered(true));
        return cleanup;
    }, []);

    // Debounce ref to prevent rapid double-toggle
    const lastToggleTimeRef = useRef<number>(0);
    const DEBOUNCE_MS = 500; // Ignore toggles within 500ms

    // Handle hotkey toggle
    useEffect(() => {
        if (hotkeyTriggered) {
            setHotkeyTriggered(false);

            // Debounce: ignore if last toggle was too recent
            const now = Date.now();
            if (now - lastToggleTimeRef.current < DEBOUNCE_MS) {
                return;
            }
            lastToggleTimeRef.current = now;

            if (stateRef.current === 'idle' || stateRef.current === 'error') {
                // Don't start recording if we're still transcribing
                if (transcribingRef.current) {
                    return;
                }
                handleStartRecording();
            } else if (stateRef.current === 'recording') {
                handleStopRecording();
            }
        }
    }, [hotkeyTriggered]);

    // Keyboard shortcut: Cmd+C to copy result
    useEffect(() => {
        const displayText = transcription?.wasEnriched ? transcription.enrichedText : transcription?.text;
        if (!displayText) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !window.getSelection()?.toString()) {
                window.electronAPI?.copyToClipboard(displayText);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [transcription]);

    // Detect platform on client side only to avoid hydration mismatch
    const [isMac, setIsMac] = useState(false);
    useEffect(() => {
        setIsMac(typeof navigator !== 'undefined' && navigator.platform.includes('Mac'));
    }, []);

    const formatHotkeyDisplay = (accelerator: string): string => {
        if (!accelerator) return '';
        return accelerator
            .replace(/CommandOrControl/gi, isMac ? '⌘' : 'Ctrl')
            .replace(/Command/gi, '⌘')
            .replace(/Control/gi, isMac ? '⌃' : 'Ctrl')
            .replace(/Alt/gi, isMac ? '⌥' : 'Alt')
            .replace(/Shift/gi, isMac ? '⇧' : 'Shift')
            .replace(/\+/g, ' + ');
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleModeChange = async (mode: WhisperMode) => {
        setWhisperModeState(mode);
        window.electronAPI?.setWhisperMode(mode);
        window.electronAPI?.saveSetting('whisperMode', mode);

        // Pre-load model if switching to local mode
        if (mode === 'local' && !isModelReady()) {
            setModelLoadingStatus('Loading Model... 0%');
            try {
                await initializeWhisper((progress) => {
                    setModelLoadingStatus(`Loading Model... ${Math.round(progress)}%`);
                });
                setModelLoadingStatus(null);
            } catch {
                setModelLoadingStatus(null);
            }
        }
    };

    const handleLanguageChange = async (language: string) => {
        setWhisperLanguage(language);
        window.electronAPI?.saveSetting('whisperLanguage', language);
    };

    const handleApiKeyChange = async (key: string) => {
        setApiKeyState(key);
        // Unified key for everything
        if (key.trim()) {
            window.electronAPI?.setApiKey(key);
            window.electronAPI?.setLLMProvider('openai', key);
            window.electronAPI?.saveSetting('apiKey', key);
        }
    };

    const handleEnrichmentModeChange = async (mode: EnrichmentMode) => {
        setEnrichmentModeState(mode);
        window.electronAPI?.setEnrichmentMode(mode);
        window.electronAPI?.saveSetting('enrichmentMode', mode);
    };

    const handleStartRecording = useCallback(async () => {
        setTranscription(null);
        setError(null);
        await startRecording();
        window.electronAPI?.setRecordingState(true).catch(() => { });
    }, [startRecording]);

    const handleStopRecording = useCallback(async () => {
        setError(null);
        const audioData = await stopRecording();
        window.electronAPI?.setRecordingState(false).catch(() => { });

        if (audioData) {
            setTranscribing(true);
            try {
                let rawText: string;

                // Branch based on whisper mode
                if (whisperMode === 'local') {
                    // Local mode: transcribe in renderer using WASM
                    rawText = await transcribeLocal(audioData, (progress, status) => {
                        // Only show download/loading status, not transcription status
                        if (status.toLowerCase().includes('load') || status.toLowerCase().includes('download') || progress < 100) {
                            setModelLoadingStatus(`Loading Model... ${Math.round(progress)}%`);
                        }
                    }, whisperLanguage === 'auto' ? undefined : whisperLanguage);
                    setModelLoadingStatus(null);
                } else {
                    // API mode: send to main process
                    if (!window.electronAPI) {
                        throw new Error('Electron API not available');
                    }
                    const result = await window.electronAPI.sendAudioForTranscription(audioData);
                    setTranscription(result);

                    // Auto-Paste for API mode (Main process handles enrichment if needed)
                    // The result is already enriched if configured.
                    const finalText = result.wasEnriched ? result.enrichedText : result.text;
                    if (finalText && finalText.trim()) {
                        await window.electronAPI.copyToClipboard(finalText);
                        await window.electronAPI.triggerPaste().catch(() => { });
                    }
                    return;
                }

                // For LOCAL mode, we have rawText.
                let finalResult: TranscriptionResult;

                if (window.electronAPI && enrichmentMode !== 'none' && rawText.trim()) {
                    const enrichedResult = await window.electronAPI.enrichTranscription(rawText);
                    finalResult = enrichedResult;
                } else {
                    finalResult = {
                        text: rawText,
                        enrichedText: rawText,
                        wasEnriched: false,
                        duration: 0,
                        mode: 'local',
                    };
                }

                setTranscription(finalResult);

                // Auto-Paste for Local mode
                const finalText = finalResult.wasEnriched ? finalResult.enrichedText : finalResult.text;
                if (finalText && finalText.trim()) {
                    await window.electronAPI?.copyToClipboard(finalText);
                    if (window.electronAPI) {
                        await window.electronAPI.triggerPaste().catch(() => { });
                    }
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Transcription failed');
                setModelLoadingStatus(null);
            } finally {
                setTranscribing(false);
            }
        }
    }, [stopRecording, whisperMode, enrichmentMode, whisperLanguage]);

    const handleRecordClick = useCallback(async () => {
        if (state === 'recording') {
            await handleStopRecording();
        } else if (state === 'idle' || state === 'error') {
            await handleStartRecording();
        }
    }, [state, handleStartRecording, handleStopRecording]);

    const isRecording = state === 'recording';
    const isProcessing = state === 'processing' || transcribing;
    const displayText = transcription?.wasEnriched ? transcription.enrichedText : transcription?.text;

    return (
        <>
            <Head>
                <title>Voice Intelligence</title>
                <meta name="description" content="Voice capture, transcription, and LLM enrichment" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* Title bar drag region for window dragging */}
            <div className="drag-region" />
            <main style={styles.main}>
                <h1 style={styles.title}>Voice Intelligence</h1>
                <p style={styles.subtitle}>
                    {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Ready to capture your voice'}
                </p>

                {/* Status indicator */}
                <div style={styles.status}>
                    <span style={isRecording ? styles.recordingDot : styles.idleDot} />
                    <span>
                        {isRecording ? formatDuration(duration) : isProcessing ? 'Transcribing & Enhancing' : 'Idle'}
                    </span>
                </div>

                {/* Model download progress indicator */}
                {modelLoadingStatus && (
                    <div style={styles.downloadProgress}>
                        <div style={styles.downloadHeader}>
                            <span>🔄 {modelLoadingStatus}</span>
                        </div>
                        <div style={styles.progressBarContainer}>
                            <div
                                style={{
                                    ...styles.progressBar,
                                    width: modelLoadingStatus.includes('%')
                                        ? modelLoadingStatus.match(/(\d+)%/)?.[1] + '%'
                                        : '100%'
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Record Button */}
                <div style={styles.controlSection}>
                    <RecordButton
                        isRecording={isRecording}
                        isProcessing={isProcessing}
                        onClick={handleRecordClick}
                        processingText={transcribing ? '✨ Processing...' : 'Processing...'}
                    />
                    <span style={styles.hint}>Press {formatHotkeyDisplay(hotkey)} to toggle</span>
                </div>

                {/* Transcript Result */}
                {displayText && !error && (
                    <TranscriptDisplay
                        text={displayText}
                        wasEnriched={transcription?.wasEnriched}
                        enrichmentMode={enrichmentMode}
                        transcriptionMode={transcription?.mode}
                        duration={transcription?.duration}
                    />
                )}

                {/* Error */}
                {(error || recordError) && (
                    <p style={styles.error}>{error || recordError}</p>
                )}

                {/* Settings Toggle */}
                <button style={styles.settingsToggle} onClick={() => setShowSettings(!showSettings)}>
                    {showSettings ? '▲ Hide Settings' : '⚙️ Settings'}
                </button>

                {/* Settings Panel */}
                {showSettings && (
                    <div style={styles.settingsPanel}>
                        <div style={styles.settingsSection}>
                            <h3 style={styles.sectionTitle}>🎙 Transcription</h3>
                            <div style={styles.settingRow}>
                                <label style={styles.label}>Engine:</label>
                                <select
                                    style={styles.select}
                                    value={whisperMode}
                                    onChange={(e) => handleModeChange(e.target.value as 'local' | 'api')}
                                >
                                    <option value="local">🔒 Local (Offline)</option>
                                    <option value="api">☁️ OpenAI Whisper API</option>
                                </select>
                            </div>
                            {whisperMode === 'local' && (
                                <div style={styles.settingRow}>
                                    <label style={styles.label}>Language:</label>
                                    <select
                                        style={styles.select}
                                        value={whisperLanguage}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                    >
                                        <option value="english">🇺🇸 English</option>
                                        <option value="german">🇩🇪 German</option>
                                        <option value="spanish">🇪🇸 Spanish</option>
                                        <option value="french">🇫🇷 French</option>
                                        <option value="italian">🇮🇹 Italian</option>
                                        <option value="portuguese">🇵🇹 Portuguese</option>
                                        <option value="russian">🇷🇺 Russian</option>
                                        <option value="chinese">🇨🇳 Chinese</option>
                                        <option value="japanese">🇯🇵 Japanese</option>
                                    </select>
                                </div>
                            )}

                            {modelLoadingStatus && (
                                <div style={{ ...styles.settingRow, color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                                    {modelLoadingStatus}
                                </div>
                            )}


                            {whisperMode === 'api' && (
                                <div style={styles.settingRow}>
                                    <label style={styles.label}>API Key:</label>
                                    <input
                                        type="password"
                                        style={styles.input}
                                        placeholder="sk-..."
                                        value={apiKey}
                                        onChange={(e) => handleApiKeyChange(e.target.value)}
                                    />
                                </div>
                            )}
                            {whisperMode === 'api' && !apiKey && (
                                <div style={{ ...styles.settingRow, color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                    API Key required for Cloud Mode
                                </div>
                            )}
                        </div>

                        <div style={styles.settingsSection}>
                            <h3 style={styles.sectionTitle}>✨ Enrichment</h3>
                            {whisperMode === 'api' ? (
                                <>
                                    <div style={styles.settingRow}>
                                        <label style={styles.label}>Mode:</label>
                                        <select
                                            style={styles.select}
                                            value={enrichmentMode}
                                            onChange={(e) => handleEnrichmentModeChange(e.target.value as EnrichmentMode)}
                                        >
                                            <option value="none">🔇 None (raw)</option>
                                            <option value="clean">🧹 Clean</option>
                                            <option value="format">📝 Format</option>
                                            <option value="summarize">📋 Summarize</option>
                                            <option value="action">✅ Action Items</option>
                                            <option value="email">✉️ Email</option>
                                            <option value="notes">📒 Notes</option>
                                            <option value="commit">💻 Git Commit</option>
                                            <option value="tweet">🐦 Tweet Thread</option>
                                            <option value="slack">💬 Slack Message</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <div style={{ ...styles.settingRow, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                    Enrichment requires Cloud Mode
                                </div>
                            )}
                        </div>

                        <div style={styles.settingsSection}>
                            <HotkeyInput
                                currentHotkey={hotkey}
                                onHotkeyChange={async (accelerator) => {
                                    if (!window.electronAPI) return false;
                                    const success = await window.electronAPI.setHotkey(accelerator);
                                    if (success) {
                                        setHotkey(accelerator);
                                    }
                                    return success;
                                }}
                            />
                        </div>

                        <p style={styles.hotkeyHint}>{formatHotkeyDisplay(hotkey)} to toggle recording from anywhere</p>
                    </div>
                )}
            </main>
        </>
    );
}

const styles: Record<string, React.CSSProperties> = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem 1.5rem',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: 700,
        marginBottom: '0.25rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: '0.95rem',
        color: 'var(--color-text-secondary)',
        marginBottom: '1.5rem',
    },
    status: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1.25rem',
        backgroundColor: 'var(--color-bg-glass)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--color-border)',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
    },
    idleDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-success)',
    },
    recordingDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-error)',
        animation: 'recordingDot 1s ease-in-out infinite',
    },
    controlSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
    },
    hint: {
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
    },
    error: {
        color: 'var(--color-error)',
        fontSize: '0.9rem',
        maxWidth: '340px',
        textAlign: 'center',
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    settingsToggle: {
        background: 'none',
        border: 'none',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        transition: 'var(--transition-fast)',
    },
    settingsPanel: {
        width: '100%',
        maxWidth: '400px',
        padding: '1rem',
        backgroundColor: 'var(--color-bg-glass)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        marginTop: '0.5rem',
    },
    settingsSection: {
        marginBottom: '1rem',
    },
    sectionTitle: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--color-border)',
    },
    settingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.75rem',
    },
    label: {
        fontSize: '0.85rem',
        color: 'var(--color-text-secondary)',
        minWidth: '65px',
    },
    select: {
        flex: 1,
        padding: '0.5rem 0.75rem',
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--color-text-primary)',
        fontSize: '0.85rem',
    },
    input: {
        flex: 1,
        padding: '0.5rem 0.75rem',
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--color-text-primary)',
        fontSize: '0.85rem',
    },
    hotkeyHint: {
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        fontStyle: 'italic',
        margin: 0,
        marginTop: '0.5rem',
        textAlign: 'center',
    },
    downloadProgress: {
        width: '100%',
        maxWidth: '300px',
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--color-bg-glass)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-primary)',
        marginBottom: '1rem',
    },
    downloadHeader: {
        fontSize: '0.85rem',
        color: 'var(--color-primary)',
        marginBottom: '0.5rem',
        textAlign: 'center',
    },
    progressBarContainer: {
        width: '100%',
        height: '6px',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: '3px',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'var(--color-primary)',
        borderRadius: '3px',
        transition: 'width 0.3s ease',
    },
};
