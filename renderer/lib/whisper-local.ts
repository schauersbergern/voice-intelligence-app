/**
 * Local Whisper transcription using @huggingface/transformers
 * Runs in the renderer process (browser context) using WebAssembly
 */

import { pipeline, Pipeline } from '@huggingface/transformers';

let transcriber: Pipeline | null = null;
let isLoading = false;
let loadError: string | null = null;

/**
 * Initialize the Whisper model (lazy load on first use)
 * Uses whisper-tiny.en for fast loading and reliable transcription
 */
export async function initializeWhisper(
    onProgress?: (progress: number, status: string) => void
): Promise<void> {
    if (transcriber) return;
    if (isLoading) {
        // Wait for existing load to complete
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (loadError) throw new Error(loadError);
        return;
    }

    isLoading = true;
    loadError = null;

    try {
        onProgress?.(0, 'Loading speech model...');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transcriber = await (pipeline as any)(
            'automatic-speech-recognition',
            'Xenova/whisper-small',  // Best accuracy, ~460MB, supports 99 languages
            {
                progress_callback: (progress: { progress?: number; status?: string }) => {
                    if (progress.progress !== undefined) {
                        onProgress?.(progress.progress, progress.status || 'Loading...');
                    }
                },
            }
        );

        onProgress?.(100, 'Model ready');
    } catch (error) {
        loadError = error instanceof Error ? error.message : 'Failed to load model';
        throw error;
    } finally {
        isLoading = false;
    }
}

/**
 * Transcribe audio using local Whisper model
 * @param audioBuffer - WAV audio buffer or Float32Array of audio samples
 * @returns Transcribed text
 */
export async function transcribeLocal(
    audioData: Float32Array | ArrayBuffer,
    onProgress?: (progress: number, status: string) => void,
    language?: string
): Promise<string> {
    // Ensure model is loaded
    if (!transcriber) {
        await initializeWhisper(onProgress);
    }

    if (!transcriber) {
        throw new Error('Failed to initialize Whisper model');
    }

    try {
        // Convert ArrayBuffer to Float32Array if needed
        let samples: Float32Array;
        if (audioData instanceof ArrayBuffer) {
            // Assume WAV format - skip 44-byte header, convert 16-bit PCM to float
            const view = new DataView(audioData);
            const pcmLength = (audioData.byteLength - 44) / 2;
            samples = new Float32Array(pcmLength);
            for (let i = 0; i < pcmLength; i++) {
                const int16 = view.getInt16(44 + i * 2, true);
                samples[i] = int16 / 32768;
            }
        } else {
            samples = audioData;
        }

        // Transcribe - set task to 'transcribe' to keep original language (not translate)
        const options: any = {
            sampling_rate: 16000,
            task: 'transcribe',
        };

        // Only add language if it's specified and not 'auto'
        if (language && language !== 'auto') {
            options.language = language;
        }

        const result = await transcriber(samples, options);

        // Extract text from result
        if (typeof result === 'string') {
            return result.trim();
        }
        if (result && typeof result === 'object' && 'text' in result) {
            return (result as { text: string }).text.trim();
        }
        if (Array.isArray(result) && result.length > 0) {
            return result.map((r: { text?: string }) => r.text || '').join(' ').trim();
        }

        return '';
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Local transcription failed: ${message}`);
    }
}

/**
 * Check if model is ready
 */
export function isModelReady(): boolean {
    return transcriber !== null;
}

/**
 * Check if model is currently loading
 */
export function isModelLoading(): boolean {
    return isLoading;
}
