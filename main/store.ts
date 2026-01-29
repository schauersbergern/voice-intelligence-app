import { AppSettings } from '../shared/types';

// Schema definition
const schema = {
    whisperMode: { type: 'string', enum: ['local', 'api'], default: 'local' },
    whisperLanguage: { type: 'string', default: 'english' },
    enrichmentMode: { type: 'string', enum: ['none', 'clean', 'format', 'summarize', 'action', 'email', 'notes', 'commit', 'tweet', 'slack'], default: 'none' },
    apiKey: { type: 'string', default: '' },
    llmProvider: { type: 'string', enum: ['openai', 'anthropic'], default: 'openai' },
    hotkey: { type: 'string', default: 'Alt+Space' }
} as const;

// Store instance (lazy loaded)
let store: any;

export async function initStore() {
    if (!store) {
        // Use new Function to bypass Webpack's build time resolution and force native Node import
        // This fixes the ERR_REQUIRE_ESM error with electron-store
        const dynamicImport = new Function('specifier', 'return import(specifier)');
        const { default: Store } = await dynamicImport('electron-store');
        store = new Store({ schema: schema as any });
    }
    return store;
}

// Helper accessors that ensure store is initialized or return defaults if not yet ready (though init should be called first)
// Since this is called from IPC handler which is async, we can await initStore().

export async function getAllSettings(): Promise<AppSettings> {
    const s = await initStore();
    return {
        whisperMode: s.get('whisperMode'),
        whisperLanguage: s.get('whisperLanguage'),
        enrichmentMode: s.get('enrichmentMode'),
        apiKey: s.get('apiKey'),
        llmProvider: s.get('llmProvider'),
        hotkey: s.get('hotkey')
    };
}

export async function saveSetting(key: string, value: any) {
    const s = await initStore();
    s.set(key, value);
}

