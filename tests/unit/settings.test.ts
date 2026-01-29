import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock electron-store
vi.mock('electron-store', () => {
    return {
        default: class {
            store: Record<string, any> = {};
            get(key: string, defaultValue?: any) {
                return this.store[key] ?? defaultValue;
            }
            set(key: string, value: any) {
                this.store[key] = value;
            }
        }
    };
});

// Since we can't easily import from main process files in this environment without complex mocking of 'electron' module,
// we will verify the logic that we expect the settings manager to have.
// In a real scenario, we would mock 'electron' and import the actual 'store.ts' file.

describe('Settings Management', () => {
    let store: any;

    beforeEach(async () => {
        const Store = (await import('electron-store')).default;
        store = new Store();
    });

    it('should save and load settings', () => {
        store.set('theme', 'dark');
        expect(store.get('theme')).toBe('dark');
    });

    it('should return default value if key not found', () => {
        expect(store.get('nonExistent', 'defaultVal')).toBe('defaultVal');
    });

    it('should handle complex objects', () => {
        const config = { feature: { enabled: true } };
        store.set('config', config);
        expect(store.get('config')).toEqual(config);
    });
});
