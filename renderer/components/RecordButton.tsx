import { CSSProperties } from 'react';

interface RecordButtonProps {
    isRecording: boolean;
    isProcessing: boolean;
    onClick: () => void;
    processingText?: string;
}

export function RecordButton({
    isRecording,
    isProcessing,
    onClick,
    processingText = 'Processing...'
}: RecordButtonProps): JSX.Element {
    const getConfig = () => {
        if (isRecording) return { text: '⏹ Stop', style: styles.stopButton };
        if (isProcessing) return { text: processingText, style: styles.processingButton };
        return { text: '🎙 Record', style: styles.recordButton };
    };

    const config = getConfig();
    const buttonStyle = {
        ...config.style,
        ...(isProcessing ? styles.disabledButton : {}),
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            disabled={isProcessing}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !isProcessing) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {config.text}
        </button>
    );
}

const styles: Record<string, CSSProperties> = {
    recordButton: {
        padding: '1.25rem 3rem',
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '3rem',
        cursor: 'pointer',
        minWidth: '180px',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.2s ease',
    },
    stopButton: {
        padding: '1.25rem 3rem',
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        border: 'none',
        borderRadius: '3rem',
        cursor: 'pointer',
        minWidth: '180px',
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
        transition: 'all 0.2s ease',
        animation: 'pulse 2s infinite',
    },
    processingButton: {
        padding: '1.25rem 3rem',
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        background: '#6b7280',
        border: 'none',
        borderRadius: '3rem',
        minWidth: '180px',
        transition: 'all 0.2s ease',
    },
    disabledButton: {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
};
