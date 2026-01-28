/**
 * Audio utility functions for Voice Intelligence App
 * Handles WAV encoding for Whisper-compatible audio format
 */

const TARGET_SAMPLE_RATE = 16000;

/**
 * Downsample audio from source sample rate to target sample rate
 * Uses simple linear interpolation
 */
export function downsample(
    samples: Float32Array,
    sourceSampleRate: number,
    targetSampleRate: number
): Float32Array {
    if (sourceSampleRate === targetSampleRate) {
        return samples;
    }

    const ratio = sourceSampleRate / targetSampleRate;
    const newLength = Math.round(samples.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
        const srcIndex = i * ratio;
        const srcIndexFloor = Math.floor(srcIndex);
        const srcIndexCeil = Math.min(srcIndexFloor + 1, samples.length - 1);
        const fraction = srcIndex - srcIndexFloor;

        // Linear interpolation between samples
        result[i] = samples[srcIndexFloor] * (1 - fraction) + samples[srcIndexCeil] * fraction;
    }

    return result;
}

/**
 * Encode PCM audio data to WAV format
 * @param samples - Float32Array of audio samples (-1.0 to 1.0)
 * @param sampleRate - Source sample rate (will be downsampled to 16kHz)
 * @returns ArrayBuffer containing WAV file data
 */
export function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
    // Downsample to 16kHz if needed
    const resampled = downsample(samples, sampleRate, TARGET_SAMPLE_RATE);

    // Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
    const int16Samples = new Int16Array(resampled.length);
    for (let i = 0; i < resampled.length; i++) {
        // Clamp to -1.0 to 1.0 range
        const clamped = Math.max(-1, Math.min(1, resampled[i]));
        // Convert to 16-bit integer
        int16Samples[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
    }

    // WAV file parameters
    const numChannels = 1; // Mono
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = TARGET_SAMPLE_RATE * blockAlign;
    const dataSize = int16Samples.length * bytesPerSample;
    const headerSize = 44;
    const fileSize = headerSize + dataSize;

    // Create buffer for WAV file
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);

    // Write WAV header
    // "RIFF" chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, fileSize - 8, true); // File size - 8 bytes
    writeString(view, 8, 'WAVE');

    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
    view.setUint16(20, 1, true); // Audio format (1 = PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, TARGET_SAMPLE_RATE, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write audio data
    const dataView = new Int16Array(buffer, headerSize);
    dataView.set(int16Samples);

    return buffer;
}

/**
 * Helper to write ASCII string to DataView
 */
function writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
}

/**
 * Calculate recording duration from WAV buffer
 * @param wavBuffer - WAV file ArrayBuffer
 * @returns Duration in seconds
 */
export function getWAVDuration(wavBuffer: ArrayBuffer): number {
    const view = new DataView(wavBuffer);
    const dataSize = view.getUint32(40, true);
    const byteRate = view.getUint32(28, true);
    return dataSize / byteRate;
}
