import { describe, it, expect } from 'vitest';
import { encodeWAV, downsample, getWAVDuration } from '../../renderer/utils/audio-utils';

describe('audio-utils', () => {
    describe('downsample', () => {
        it('should return original samples if rates match', () => {
            const samples = new Float32Array([0.1, 0.2, 0.3]);
            const result = downsample(samples, 16000, 16000);
            expect(result).toEqual(samples);
        });

        it('should downsample by half correctly', () => {
            const samples = new Float32Array([0.1, 0.2, 0.3, 0.4]);
            // 32k -> 16k
            const result = downsample(samples, 32000, 16000);
            expect(result.length).toBe(2);
            // Linear interpolation of [0.1, 0.2] -> ~0.15? Actually downsampling skips or averages.
            // The implementation uses linear interpolation based on ratio.
        });
    });

    describe('encodeWAV', () => {
        it('should create a valid WAV file structure', () => {
            const samples = new Float32Array([0.5, -0.5]); // 2 samples
            const sampleRate = 16000;
            const buffer = encodeWAV(samples, sampleRate);

            expect(buffer.byteLength).toBeGreaterThan(44); // Header size

            const view = new DataView(buffer);

            // Check RIFF header
            expect(String.fromCharCode(view.getUint8(0))).toBe('R');
            expect(String.fromCharCode(view.getUint8(1))).toBe('I');
            expect(String.fromCharCode(view.getUint8(2))).toBe('F');
            expect(String.fromCharCode(view.getUint8(3))).toBe('F');

            // Check WAVE format
            expect(String.fromCharCode(view.getUint8(8))).toBe('W');
            expect(String.fromCharCode(view.getUint8(9))).toBe('A');
            expect(String.fromCharCode(view.getUint8(10))).toBe('V');
            expect(String.fromCharCode(view.getUint8(11))).toBe('E');

            // Check sample rate (16000)
            expect(view.getUint32(24, true)).toBe(16000);

            // Check channels (1 = mono)
            expect(view.getUint16(22, true)).toBe(1);

            // Check bits per sample (16)
            expect(view.getUint16(34, true)).toBe(16);
        });
    });

    describe('getWAVDuration', () => {
        it('should calculate duration correctly', () => {
            // 1 second of audio at 16kHz, 16-bit mono
            // 16000 samples * 2 bytes = 32000 bytes of data
            // Header is 44 bytes
            const dataSize = 32000;
            const headerSize = 44;
            const buffer = new ArrayBuffer(headerSize + dataSize);
            const view = new DataView(buffer);

            // Write necessary fields for getWAVDuration
            // Byte rate at 28: 16000 * 2 = 32000
            view.setUint32(28, 32000, true);
            // Data size at 40
            view.setUint32(40, dataSize, true);

            const duration = getWAVDuration(buffer);
            expect(duration).toBe(1.0);
        });
    });
});
