import { describe, it, expect } from 'vitest';
import { IPC_CHANNELS } from '../../shared/types';

describe('IPC Channels', () => {
    it('should have unique values for all channels', () => {
        const values = Object.values(IPC_CHANNELS);
        const uniqueValues = new Set(values);
        expect(values.length).toBe(uniqueValues.size);
    });

    it('should follow channel naming convention namespace:action', () => {
        const values = Object.values(IPC_CHANNELS);
        values.forEach(value => {
            expect(value).toMatch(/^[a-z]+:[a-z-]+$/);
        });
    });

    it('should contain essential channels', () => {
        const keys = Object.keys(IPC_CHANNELS);
        expect(keys).toContain('SEND_AUDIO');
        expect(keys).toContain('SET_WHISPER_MODE');
        expect(keys).toContain('SET_API_KEY');
        expect(keys).toContain('TOGGLE_RECORDING');
    });
});
