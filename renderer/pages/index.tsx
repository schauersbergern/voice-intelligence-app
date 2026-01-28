import { useState } from 'react';
import Head from 'next/head';

export default function Home(): JSX.Element {
    const [pingResult, setPingResult] = useState<string | null>(null);

    async function handlePing(): Promise<void> {
        // Check if API is available (catches misconfiguration)
        if (!window.electronAPI) {
            setPingResult('ERROR: Electron API not available');
            return;
        }

        try {
            const result = await window.electronAPI.ping();
            setPingResult(result);
        } catch (error) {
            setPingResult(`ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    return (
        <>
            <Head>
                <title>Voice Intelligence</title>
                <meta name="description" content="Voice capture, transcription, and LLM enrichment" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main style={styles.main}>
                <h1 style={styles.title}>Voice Intelligence</h1>
                <p style={styles.subtitle}>Ready to capture your voice</p>

                <div style={styles.status}>
                    <span style={styles.dot} />
                    <span>Idle</span>
                </div>

                <div style={styles.testSection}>
                    <button style={styles.button} onClick={handlePing}>
                        Test IPC
                    </button>
                    {pingResult && (
                        <p style={pingResult.startsWith('ERROR') ? styles.error : styles.success}>
                            {pingResult}
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
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#4ade80',
    },
    testSection: {
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    button: {
        padding: '0.75rem 1.5rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#fff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        transition: 'transform 0.1s, box-shadow 0.1s',
    },
    success: {
        color: '#4ade80',
        fontSize: '0.9rem',
    },
    error: {
        color: '#f87171',
        fontSize: '0.9rem',
    },
};
