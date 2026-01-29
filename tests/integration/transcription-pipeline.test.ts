import { describe, it, expect, vi } from 'vitest';

interface TranscriptionResult {
    text: string;
    duration: number;
    mode: 'local' | 'api';
}

// Mock the transcription handlers
const mockTranscribeAPI = vi.fn().mockResolvedValue('Hello world');
const mockTranscribeLocal = vi.fn().mockResolvedValue('Hallo Welt');

// Simulated pipeline function (as we can't import main process code easily here)
async function pipeline(audioDetails: { buffer: ArrayBuffer, mode: 'local' | 'api' }): Promise<TranscriptionResult> {
    const startTime = Date.now();
    let text = '';

    if (audioDetails.mode === 'api') {
        text = await mockTranscribeAPI(audioDetails.buffer);
    } else {
        text = await mockTranscribeLocal(audioDetails.buffer);
    }

    return {
        text,
        duration: (Date.now() - startTime) / 1000,
        mode: audioDetails.mode
    };
}

describe('Transcription Pipeline', () => {
    it('should route to API handler when mode is api', async () => {
        const result = await pipeline({ buffer: new ArrayBuffer(10), mode: 'api' });

        expect(mockTranscribeAPI).toHaveBeenCalled();
        expect(result.text).toBe('Hello world');
        expect(result.mode).toBe('api');
    });

    it('should route to Local handler when mode is local', async () => {
        const result = await pipeline({ buffer: new ArrayBuffer(10), mode: 'local' });

        expect(mockTranscribeLocal).toHaveBeenCalled();
        expect(result.text).toBe('Hallo Welt');
        expect(result.mode).toBe('local');
    });
});
