/**
 * Local Whisper transcription using whisper.cpp via whisper-node-addon
 */

import path from 'path';
import { app } from 'electron';
import type { WhisperOptions } from '@kutalia/whisper-node-addon';

// Dynamic import for whisper-node-addon (native module)
let whisperModule: { transcribe: (options: WhisperOptions) => Promise<{ transcription: string[][] | string[] }> } | null = null;

/**
 * Get the path to the Whisper model file
 */
function getModelPath(): string {
    const isDev = !app.isPackaged;
    if (isDev) {
        return path.join(process.cwd(), 'resources', 'models', 'ggml-base.en.bin');
    }
    return path.join(process.resourcesPath, 'models', 'ggml-base.en.bin');
}

/**
 * Check if the local Whisper model exists
 */
export async function isModelAvailable(): Promise<boolean> {
    const fs = await import('fs');
    const modelPath = getModelPath();
    try {
        await fs.promises.access(modelPath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Convert WAV buffer to Float32Array PCM data
 * WAV format: 44-byte header, then 16-bit PCM samples
 */
function wavToFloat32(wavBuffer: Buffer): Float32Array {
    // Skip 44-byte WAV header
    const pcmData = wavBuffer.subarray(44);
    const samples = new Float32Array(pcmData.length / 2);

    for (let i = 0; i < samples.length; i++) {
        // Read 16-bit signed integer (little-endian)
        const int16 = pcmData.readInt16LE(i * 2);
        // Convert to float32 range [-1, 1]
        samples[i] = int16 / 32768;
    }

    return samples;
}

/**
 * Transcribe audio using local whisper.cpp
 * @param audioBuffer - WAV audio buffer (16kHz mono 16-bit PCM)
 * @returns Transcribed text
 */
export async function transcribeLocal(audioBuffer: Buffer): Promise<string> {
    // Lazy load the native module
    if (!whisperModule) {
        try {
            whisperModule = await import('@kutalia/whisper-node-addon');
        } catch (error) {
            throw new Error('Failed to load whisper-node-addon. Please ensure the package is installed correctly.');
        }
    }

    const modelPath = getModelPath();

    // Check if model exists
    if (!(await isModelAvailable())) {
        throw new Error(
            `Whisper model not found at ${modelPath}. ` +
            'Please download ggml-base.en.bin from https://huggingface.co/ggerganov/whisper.cpp'
        );
    }

    try {
        // Convert WAV buffer to Float32Array PCM
        const pcmf32 = wavToFloat32(audioBuffer);

        const result = await whisperModule.transcribe({
            model: modelPath,
            pcmf32,
            language: 'en',
            n_threads: 4,
            no_prints: true,
        });

        // Result is either string[] or string[][]
        // Flatten and join to get full transcription
        const transcription = result.transcription;
        if (Array.isArray(transcription)) {
            if (transcription.length === 0) return '';
            if (Array.isArray(transcription[0])) {
                // string[][] - each inner array is [timestamp, text]
                return (transcription as string[][]).map(seg => seg[1] || seg[0]).join(' ').trim();
            }
            // string[] - just text segments
            return (transcription as string[]).join(' ').trim();
        }

        return '';
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Local transcription failed: ${message}`);
    }
}
