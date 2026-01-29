import { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { RecordButton } from '../components/RecordButton';
import { TranscriptDisplay } from '../components/TranscriptDisplay';
import type { WhisperMode, TranscriptionResult, EnrichmentMode, LLMProvider } from '../../shared/types';

export default function Home(): JSX.Element {
    const { state, error: recordError, duration, startRecording, stopRecording } = useAudioRecorder();
    const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
    const [transcribing, setTranscribing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [whisperMode, setWhisperModeState] = useState<WhisperMode>('api');
    const [apiKey, setApiKeyState] = useState('');
    const [llmApiKey, setLlmApiKeyState] = useState('');
    const [llmProvider, setLlmProviderState] = useState<LLMProvider>('openai');
    const [enrichmentMode, setEnrichmentModeState] = useState<EnrichmentMode>('clean');
    const [showSettings, setShowSettings] = useState(false);
    const [hotkeyTriggered, setHotkeyTriggered] = useState(false);

    // Ref to track recording state for hotkey handler
    const stateRef = useRef(state);
    stateRef.current = state;

    // Load settings on mount
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getWhisperMode().then(setWhisperModeState).catch(() => { });
            window.electronAPI.getEnrichmentMode().then(setEnrichmentModeState).catch(() => { });
        }
    }, []);

    // Listen for global hotkey toggle
    useEffect(() => {
        if (!window.electronAPI) return;
        const cleanup = window.electronAPI.onRecordingToggle(() => setHotkeyTriggered(true));
        return cleanup;
    }, []);

    // Handle hotkey toggle
    useEffect(() => {
        if (hotkeyTriggered) {
            setHotkeyTriggered(false);
            if (stateRef.current === 'idle' || stateRef.current === 'error') {
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
                navigator.clipboard.writeText(displayText);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [transcription]);

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleModeChange = async (mode: WhisperMode) => {
        setWhisperModeState(mode);
        window.electronAPI?.setWhisperMode(mode);
    };

    const handleApiKeyChange = async (key: string) => {
        setApiKeyState(key);
        if (key.trim()) window.electronAPI?.setApiKey(key);
    };

    const handleEnrichmentModeChange = async (mode: EnrichmentMode) => {
        setEnrichmentModeState(mode);
        window.electronAPI?.setEnrichmentMode(mode);
    };

    const handleLlmProviderChange = async (provider: LLMProvider) => {
        setLlmProviderState(provider);
        if (llmApiKey.trim()) window.electronAPI?.setLLMProvider(provider, llmApiKey);
    };

    const handleLlmApiKeyChange = async (key: string) => {
        setLlmApiKeyState(key);
        if (key.trim()) window.electronAPI?.setLLMProvider(llmProvider, key);
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
            if (!window.electronAPI) {
                setError('Electron API not available');
                return;
            }

            setTranscribing(true);
            try {
                const result = await window.electronAPI.sendAudioForTranscription(audioData);
                setTranscription(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Transcription failed');
            } finally {
                setTranscribing(false);
            }
        }
    }, [stopRecording]);

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

                {/* Record Button */}
                <div style={styles.controlSection}>
                    <RecordButton
                        isRecording={isRecording}
                        isProcessing={isProcessing}
                        onClick={handleRecordClick}
                        processingText={transcribing ? '✨ Processing...' : 'Processing...'}
                    />
                    <span style={styles.hint}>Press Enter or ⌘+Shift+Space</span>
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
                                    onChange={(e) => handleModeChange(e.target.value as WhisperMode)}
                                >
                                    <option value="api">☁️ OpenAI Whisper API</option>
                                    <option value="local">💻 Local (whisper.cpp)</option>
                                </select>
                            </div>
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
                        </div>

                        <div style={styles.settingsSection}>
                            <h3 style={styles.sectionTitle}>✨ Enrichment</h3>
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
                            {enrichmentMode !== 'none' && (
                                <>
                                    <div style={styles.settingRow}>
                                        <label style={styles.label}>LLM:</label>
                                        <select
                                            style={styles.select}
                                            value={llmProvider}
                                            onChange={(e) => handleLlmProviderChange(e.target.value as LLMProvider)}
                                        >
                                            <option value="openai">OpenAI (gpt-4o-mini)</option>
                                            <option value="anthropic">Anthropic (claude-3-haiku)</option>
                                        </select>
                                    </div>
                                    <div style={styles.settingRow}>
                                        <label style={styles.label}>LLM Key:</label>
                                        <input
                                            type="password"
                                            style={styles.input}
                                            placeholder={llmProvider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                                            value={llmApiKey}
                                            onChange={(e) => handleLlmApiKeyChange(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <p style={styles.hotkeyHint}>⌘+Shift+Space to toggle recording from anywhere</p>
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
};
