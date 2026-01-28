import { CSSProperties } from 'react';

interface LoadingStateProps {
    message?: string;
    elapsed?: number;
}

export function LoadingState({
    message = 'Processing...',
    elapsed = 0
}: LoadingStateProps): JSX.Element {
    return (
        <div style={styles.container}>
            <div style={styles.spinner} />
            <span style={styles.message}>{message}</span>
            {elapsed > 0 && (
                <span style={styles.elapsed}>{elapsed.toFixed(1)}s</span>
            )}
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '2rem',
    },
    spinner: {
        width: '32px',
        height: '32px',
        border: '3px solid rgba(102, 126, 234, 0.2)',
        borderTopColor: '#667eea',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    message: {
        fontSize: '0.9rem',
        color: '#8a8a9a',
    },
    elapsed: {
        fontSize: '0.75rem',
        color: '#6b7280',
    },
};

// Note: Animation keyframes should be added to a global CSS file
// @keyframes spin { to { transform: rotate(360deg); } }
