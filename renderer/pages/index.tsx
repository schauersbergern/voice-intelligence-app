import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import type { WhisperMode, TranscriptionResult } from '../../shared/types';

export default function Home(): JSX.Element {
    const { state, error: recordError, duration, startRecording, stopRecording } = useAudioRecorder();
    const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
    const [transcribing, setTranscribing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [whisperMode, setWhisperModeState] = useState<WhisperMode>('api');
    const [apiKey, setApiKeyState] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    // Load current mode on mount
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getWhisperMode().then(setWhisperModeState).catch(() => { });
        }
    }, []);

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

    const handleRecordClick = useCallback(async () => {
        if (state === 'recording') {
            setError(null);
            const audioData = await stopRecording();
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
        } else if (state === 'idle' || state === 'error') {
            setTranscription(null);
            setError(null);
            await startRecording();
        }
    }, [state, startRecording, stopRecording]);

    const isRecording = state === 'recording';
    const isProcessing = state === 'processing' || transcribing;

    const getButtonConfig = () => {
        if (isRecording) return { text: 'Stop', style: styles.stopButton };
        if (isProcessing) return { text: 'Transcribing...', style: styles.processingButton };
        return { text: 'Record', style: styles.recordButton };
    };

    const buttonConfig = getButtonConfig();

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
                    {isRecording ? 'Recording...' : isProcessing ? 'Transcribing...' : 'Ready to capture your voice'}
                </p>

                {/* Status indicator */}
                <div style={styles.status}>
                    <span style={isRecording ? styles.recordingDot : styles.idleDot} />
                    <span>
                        {isRecording
                            ? formatDuration(duration)
                            : isProcessing
                                ? 'Processing'
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

                {/* Transcription result */}
                {transcription && !error && (
                    <div style={styles.transcriptionBox}>
                        <p style={styles.transcriptionText}>{transcription.text}</p>
                        <p style={styles.transcriptionMeta}>
                            {transcription.mode === 'api' ? '☁️ API' : '💻 Local'} • {transcription.duration.toFixed(1)}s
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
                        <div style={styles.settingRow}>
                            <label style={styles.settingLabel}>Mode:</label>
                            <select
                                style={styles.select}
                                value={whisperMode}
                                onChange={(e) => handleModeChange(e.target.value as WhisperMode)}
                            >
                                <option value="api">☁️ OpenAI API</option>
                                <option value="local">💻 Local (whisper.cpp)</option>
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

                        {whisperMode === 'local' && (
                            <p style={styles.hint}>
                                Requires ggml-base.en.bin in resources/models/
                            </p>
                        )}
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
        maxWidth: '350px',
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
        maxWidth: '350px',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '0.5rem',
        marginTop: '0.5rem',
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
    },
};
