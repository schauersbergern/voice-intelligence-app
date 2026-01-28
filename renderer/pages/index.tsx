import { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
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

    // Load current modes on mount
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getWhisperMode().then(setWhisperModeState).catch(() => { });
            window.electronAPI.getEnrichmentMode().then(setEnrichmentModeState).catch(() => { });
        }
    }, []);

    // Listen for global hotkey toggle
    useEffect(() => {
        if (!window.electronAPI) return;

        const cleanup = window.electronAPI.onRecordingToggle(() => {
            setHotkeyTriggered(true);
        });

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

    // Format duration as MM:SS
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleModeChange = async (mode: WhisperMode) => {
        setWhisperModeState(mode);
        if (window.electronAPI) {
            await window.electronAPI.setWhisperMode(mode);
        }
    };

    const handleApiKeyChange = async (key: string) => {
        setApiKeyState(key);
        if (window.electronAPI && key.trim()) {
            await window.electronAPI.setApiKey(key);
        }
    };

    const handleEnrichmentModeChange = async (mode: EnrichmentMode) => {
        setEnrichmentModeState(mode);
        if (window.electronAPI) {
            await window.electronAPI.setEnrichmentMode(mode);
        }
    };

    const handleLlmProviderChange = async (provider: LLMProvider) => {
        setLlmProviderState(provider);
        if (window.electronAPI && llmApiKey.trim()) {
            await window.electronAPI.setLLMProvider(provider, llmApiKey);
        }
    };

    const handleLlmApiKeyChange = async (key: string) => {
        setLlmApiKeyState(key);
        if (window.electronAPI && key.trim()) {
            await window.electronAPI.setLLMProvider(llmProvider, key);
        }
    };

    const handleStartRecording = useCallback(async () => {
        setTranscription(null);
        setError(null);
        await startRecording();
        if (window.electronAPI) {
            window.electronAPI.setRecordingState(true).catch(() => { });
        }
    }, [startRecording]);

    const handleStopRecording = useCallback(async () => {
        setError(null);
        const audioData = await stopRecording();

        if (window.electronAPI) {
            window.electronAPI.setRecordingState(false).catch(() => { });
        }

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

    const getButtonConfig = () => {
        if (isRecording) return { text: 'Stop', style: styles.stopButton };
        if (isProcessing) return { text: 'Processing...', style: styles.processingButton };
        return { text: 'Record', style: styles.recordButton };
    };

    const buttonConfig = getButtonConfig();

    // Determine which text to display: enriched or raw
    const displayText = transcription?.wasEnriched ? transcription.enrichedText : transcription?.text;

    return (
        <>
            <Head>
                <title>Voice Intelligence</title>
                <meta name="description" content="Voice capture, transcription, and LLM enrichment" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main style={styles.main}>
                <h1 style={styles.title}>Voice Intelligence</h1>
                <p style={styles.subtitle}>
                    {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Ready to capture your voice'}
                </p>

                {/* Status indicator */}
                <div style={styles.status}>
                    <span style={isRecording ? styles.recordingDot : styles.idleDot} />
                    <span>
                        {isRecording
                            ? formatDuration(duration)
                            : isProcessing
                                ? 'Transcribing & Enhancing'
                                : 'Idle'
                        }
                    </span>
                </div>

                {/* Record/Stop button */}
                <div style={styles.controlSection}>
                    <button
                        style={{ ...buttonConfig.style, ...(isProcessing ? styles.disabledButton : {}) }}
                        onClick={handleRecordClick}
                        disabled={isProcessing}
                    >
                        {buttonConfig.text}
                    </button>
                </div>

                {/* Result display */}
                {transcription && !error && (
                    <div style={styles.transcriptionBox}>
                        <p style={styles.transcriptionText}>{displayText}</p>
                        <p style={styles.transcriptionMeta}>
                            {transcription.mode === 'api' ? '☁️ API' : '💻 Local'}
                            {transcription.wasEnriched && ` • ✨ ${enrichmentMode}`}
                            {' • '}{transcription.duration.toFixed(1)}s
                        </p>
                    </div>
                )}

                {/* Error messages */}
                {(error || recordError) && (
                    <p style={styles.error}>{error || recordError}</p>
                )}

                {/* Settings toggle */}
                <button
                    style={styles.settingsToggle}
                    onClick={() => setShowSettings(!showSettings)}
                >
                    {showSettings ? '▲ Hide Settings' : '▼ Settings'}
                </button>

                {/* Settings panel */}
                {showSettings && (
                    <div style={styles.settingsPanel}>
                        <h3 style={styles.settingsHeader}>Transcription</h3>
                        <div style={styles.settingRow}>
                            <label style={styles.settingLabel}>Whisper:</label>
                            <select
                                style={styles.select}
                                value={whisperMode}
                                onChange={(e) => handleModeChange(e.target.value as WhisperMode)}
                            >
                                <option value="api">☁️ OpenAI API</option>
                                <option value="local">💻 Local</option>
                            </select>
                        </div>

                        {whisperMode === 'api' && (
                            <div style={styles.settingRow}>
                                <label style={styles.settingLabel}>API Key:</label>
                                <input
                                    type="password"
                                    style={styles.input}
                                    placeholder="sk-..."
                                    value={apiKey}
                                    onChange={(e) => handleApiKeyChange(e.target.value)}
                                />
                            </div>
                        )}

                        <h3 style={styles.settingsHeader}>Enrichment</h3>
                        <div style={styles.settingRow}>
                            <label style={styles.settingLabel}>Mode:</label>
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
                            </select>
                        </div>

                        {enrichmentMode !== 'none' && (
                            <>
                                <div style={styles.settingRow}>
                                    <label style={styles.settingLabel}>LLM:</label>
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
                                    <label style={styles.settingLabel}>LLM Key:</label>
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

                        <p style={styles.hint}>
                            ⌘+Shift+Space to toggle recording from anywhere
                        </p>
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
        justifyContent: 'flex-start',
        minHeight: '100vh',
        padding: '2rem 1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#1a1a2e',
        color: '#eaeaea',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#8a8a9a',
        marginBottom: '1.5rem',
    },
    status: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1.5rem',
    },
    idleDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#4ade80',
    },
    recordingDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#ef4444',
    },
    controlSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    recordButton: {
        padding: '1rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        minWidth: '160px',
    },
    stopButton: {
        padding: '1rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        minWidth: '160px',
    },
    processingButton: {
        padding: '1rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        background: '#6b7280',
        border: 'none',
        borderRadius: '0.5rem',
        minWidth: '160px',
    },
    disabledButton: {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
    transcriptionBox: {
        width: '100%',
        maxWidth: '380px',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1rem',
    },
    transcriptionText: {
        fontSize: '1rem',
        lineHeight: 1.5,
        color: '#eaeaea',
        margin: 0,
        marginBottom: '0.5rem',
        whiteSpace: 'pre-wrap',
    },
    transcriptionMeta: {
        fontSize: '0.8rem',
        color: '#8a8a9a',
        margin: 0,
    },
    error: {
        color: '#f87171',
        fontSize: '0.9rem',
        maxWidth: '300px',
        textAlign: 'center',
        marginBottom: '1rem',
    },
    settingsToggle: {
        background: 'none',
        border: 'none',
        color: '#8a8a9a',
        cursor: 'pointer',
        fontSize: '0.85rem',
        marginTop: '1rem',
    },
    settingsPanel: {
        width: '100%',
        maxWidth: '380px',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '0.5rem',
        marginTop: '0.5rem',
    },
    settingsHeader: {
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#8a8a9a',
        margin: '0.5rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.25rem',
    },
    settingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
    },
    settingLabel: {
        fontSize: '0.9rem',
        color: '#8a8a9a',
        minWidth: '70px',
    },
    select: {
        flex: 1,
        padding: '0.5rem',
        backgroundColor: '#2a2a3e',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.25rem',
        color: '#eaeaea',
        fontSize: '0.9rem',
    },
    input: {
        flex: 1,
        padding: '0.5rem',
        backgroundColor: '#2a2a3e',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.25rem',
        color: '#eaeaea',
        fontSize: '0.9rem',
    },
    hint: {
        fontSize: '0.8rem',
        color: '#6b7280',
        fontStyle: 'italic',
        margin: 0,
        marginTop: '0.5rem',
    },
};
