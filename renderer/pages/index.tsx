import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

export default function Home(): JSX.Element {
    const { state, error, duration, startRecording, stopRecording } = useAudioRecorder();
    const [lastAudioSize, setLastAudioSize] = useState<number | null>(null);

    // Format duration as MM:SS
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRecordClick = useCallback(async () => {
        if (state === 'recording') {
            const audioData = await stopRecording();
            if (audioData) {
                setLastAudioSize(audioData.byteLength);
                // Send to main process for transcription
                if (window.electronAPI) {
                    try {
                        await window.electronAPI.sendAudioForTranscription(audioData);
                    } catch (err) {
                        console.error('Failed to send audio:', err);
                    }
                }
            }
        } else if (state === 'idle' || state === 'error') {
            setLastAudioSize(null);
            await startRecording();
        }
    }, [state, startRecording, stopRecording]);

    // Determine button text and style based on state
    const getButtonConfig = () => {
        switch (state) {
            case 'recording':
                return { text: 'Stop', style: styles.stopButton };
            case 'processing':
                return { text: 'Processing...', style: styles.processingButton };
            default:
                return { text: 'Record', style: styles.recordButton };
        }
    };

    const buttonConfig = getButtonConfig();
    const isRecording = state === 'recording';
    const isDisabled = state === 'processing';

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
                    {isRecording ? 'Recording...' : 'Ready to capture your voice'}
                </p>

                {/* Status indicator */}
                <div style={styles.status}>
                    <span style={isRecording ? styles.recordingDot : styles.idleDot} />
                    <span>
                        {isRecording
                            ? formatDuration(duration)
                            : state === 'processing'
                                ? 'Processing'
                                : 'Idle'
                        }
                    </span>
                </div>

                {/* Record/Stop button */}
                <div style={styles.controlSection}>
                    <button
                        style={{ ...buttonConfig.style, ...(isDisabled ? styles.disabledButton : {}) }}
                        onClick={handleRecordClick}
                        disabled={isDisabled}
                    >
                        {buttonConfig.text}
                    </button>

                    {/* Error message */}
                    {error && (
                        <p style={styles.error}>{error}</p>
                    )}

                    {/* Success message with audio size */}
                    {lastAudioSize && state === 'idle' && !error && (
                        <p style={styles.success}>
                            Audio sent: {Math.round(lastAudioSize / 1024)} KB
                        </p>
                    )}
                </div>
            </main>
        </>
    );
}

const styles: Record<string, React.CSSProperties> = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
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
        marginBottom: '2rem',
    },
    status: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem',
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
        animation: 'pulse 1s ease-in-out infinite',
    },
    controlSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
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
        transition: 'transform 0.1s, box-shadow 0.1s',
        minWidth: '140px',
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
        transition: 'transform 0.1s, box-shadow 0.1s',
        minWidth: '140px',
    },
    processingButton: {
        padding: '1rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        background: '#6b7280',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'not-allowed',
        minWidth: '140px',
    },
    disabledButton: {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
    success: {
        color: '#4ade80',
        fontSize: '0.9rem',
    },
    error: {
        color: '#f87171',
        fontSize: '0.9rem',
        maxWidth: '300px',
        textAlign: 'center',
    },
};
