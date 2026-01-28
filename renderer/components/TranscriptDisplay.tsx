import { CSSProperties, useState, useCallback } from 'react';

interface TranscriptDisplayProps {
    text: string;
    wasEnriched?: boolean;
    enrichmentMode?: string;
    transcriptionMode?: 'local' | 'api';
    duration?: number;
}

export function TranscriptDisplay({
    text,
    wasEnriched = false,
    enrichmentMode = '',
    transcriptionMode = 'api',
    duration = 0,
}: TranscriptDisplayProps): JSX.Element {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [text]);

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.meta}>
                    {transcriptionMode === 'api' ? '☁️ API' : '💻 Local'}
                    {wasEnriched && ` • ✨ ${enrichmentMode}`}
                    {duration > 0 && ` • ${duration.toFixed(1)}s`}
                </span>
                <button
                    style={copied ? styles.copyButtonCopied : styles.copyButton}
                    onClick={handleCopy}
                >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
            </div>
            <div style={styles.textContainer}>
                <p style={styles.text}>{text}</p>
            </div>
            <div style={styles.footer}>
                <span style={styles.wordCount}>{wordCount} words</span>
            </div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    meta: {
        fontSize: '0.8rem',
        color: '#8a8a9a',
    },
    copyButton: {
        padding: '0.4rem 0.8rem',
        fontSize: '0.8rem',
        fontWeight: 500,
        color: '#eaeaea',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    copyButtonCopied: {
        padding: '0.4rem 0.8rem',
        fontSize: '0.8rem',
        fontWeight: 500,
        color: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.15)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    textContainer: {
        padding: '1rem',
        maxHeight: '200px',
        overflowY: 'auto',
    },
    text: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: '#eaeaea',
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
    footer: {
        padding: '0.5rem 1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    },
    wordCount: {
        fontSize: '0.75rem',
        color: '#6b7280',
    },
};
