/**
 * Local Whisper transcription using @huggingface/transformers
 * Runs in the renderer process (browser context) using WebAssembly
 */

import { pipeline, Pipeline } from '@huggingface/transformers';

let transcriber: Pipeline | null = null;
let isLoading = false;
let loadError: string | null = null;
let lastGlobalProgress = 0;
// Track download progress for multiple files
const progressTracker = new Map<string, { progress: number; weight: number }>();

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
    lastGlobalProgress = 0;
    progressTracker.clear();

    try {
        onProgress?.(0, 'Loading speech model...');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transcriber = await (pipeline as any)(
            'automatic-speech-recognition',
            'Xenova/whisper-small',  // Best accuracy, ~460MB, supports 99 languages
            {
                progress_callback: (data: { status: string; file?: string; progress?: number }) => {
                    // Track progress for each file to calculate a smooth global percentage
                    // Weights are approximate based on file size
                    const fileWeights: Record<string, number> = {
                        'onnx': 0.90, // The main model file (largest)
                        'json': 0.02, // Config files
                        'txt': 0.01   // Vocab/merges
                    };

                    if (data.status === 'progress' && data.file && data.progress !== undefined) {
                        const ext = data.file.split('.').pop() || 'other';
                        // Find matching weight or default
                        const weight = Object.entries(fileWeights).find(([key]) => ext.includes(key))?.[1] || 0.01;

                        // Store file progress (using closure variable if outside, but we need scope here)
                        // We attach a static map to the function to persist across callbacks if needed, 
                        // but actually the callback is created once per pipeline call.
                        // Let's use a module-level or closure-level map.
                        if (!progressTracker.has(data.file)) {
                            progressTracker.set(data.file, { progress: 0, weight });
                        }

                        const item = progressTracker.get(data.file)!;
                        item.progress = data.progress;

                        // Calculate total weighted progress
                        // We normalize by assuming the main model + some config files ~ 1.0 total weight
                        // It's heuristic but much smoother than jumping 0-100 for each file.
                        let totalWeightedProgress = 0;
                        let totalWeight = 0;

                        progressTracker.forEach((val) => {
                            totalWeightedProgress += (val.progress / 100) * val.weight;
                            totalWeight += val.weight;
                        });

                        // Normalize to 0-100 range, capping at 0.99 to let final 'ready' step hit 100
                        // (If we only have small files downloaded so far, we don't want to show 100%)
                        // We assume total weight will eventually be around ~0.95-1.0
                        const nominalTotalWeight = 1.0;
                        const currentGlobalProgress = Math.min(
                            Math.round((totalWeightedProgress / nominalTotalWeight) * 100),
                            99
                        );

                        // Ensure monotonicity
                        if (currentGlobalProgress > lastGlobalProgress) {
                            lastGlobalProgress = currentGlobalProgress;
                            onProgress?.(currentGlobalProgress, 'Loading Model...');
                        }
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
