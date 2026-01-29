/**
 * LLM enrichment handler
 * Processes transcribed text through OpenAI or Anthropic
 */

import type { EnrichmentMode, LLMProvider } from '../shared/types';
import { getSystemPrompt, getMaxTokens } from './enrichment-prompts';

// In-memory settings
let currentMode: EnrichmentMode = 'clean';
let currentProvider: LLMProvider = 'openai';
let llmApiKey: string = '';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Set the enrichment mode
 */
export function setEnrichmentMode(mode: EnrichmentMode): void {
    currentMode = mode;
}

/**
 * Get the current enrichment mode
 */
export function getEnrichmentMode(): EnrichmentMode {
    return currentMode;
}

/**
 * Set the LLM provider and API key
 */
export function setLLMProvider(provider: LLMProvider, apiKey: string): void {
    currentProvider = provider;
    llmApiKey = apiKey;
}

/**
 * Get the current LLM provider
 */
export function getLLMProvider(): LLMProvider {
    return currentProvider;
}

/**
 * Enrich text using OpenAI API
 */
async function enrichWithOpenAI(text: string, systemPrompt: string, maxTokens: number): Promise<string> {
    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${llmApiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
            ],
            max_tokens: maxTokens,
            temperature: 0.3,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = (errorData as { error?: { message?: string } }).error?.message || response.statusText;
        throw new Error(`OpenAI API error: ${errorMessage}`);
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message?.content || '';
}

/**
 * Enrich text using Anthropic API
 */
async function enrichWithAnthropic(text: string, systemPrompt: string, maxTokens: number): Promise<string> {
    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': llmApiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            system: systemPrompt,
            messages: [
                { role: 'user', content: text },
            ],
            max_tokens: maxTokens,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = (errorData as { error?: { message?: string } }).error?.message || response.statusText;
        throw new Error(`Anthropic API error: ${errorMessage}`);
    }

    const data = await response.json() as { content: Array<{ text: string }> };
    return data.content[0]?.text || '';
}

/**
 * Enrich transcribed text using current mode and provider
 * @param text - Raw transcription text
 * @returns Enriched text, or original text if mode is 'none' or no API key
 */
export async function enrich(text: string): Promise<{ enrichedText: string; wasEnriched: boolean }> {
    // Skip enrichment if mode is 'none'
    if (currentMode === 'none') {
        return { enrichedText: text, wasEnriched: false };
    }

    if (!llmApiKey || llmApiKey.trim() === '') {
        return { enrichedText: text, wasEnriched: false };
    }

    const systemPrompt = getSystemPrompt(currentMode);
    if (!systemPrompt) {
        return { enrichedText: text, wasEnriched: false };
    }

    const maxTokens = getMaxTokens(currentMode);

    try {
        let enrichedText: string;

        if (currentProvider === 'openai') {
            enrichedText = await enrichWithOpenAI(text, systemPrompt, maxTokens);
        } else {
            enrichedText = await enrichWithAnthropic(text, systemPrompt, maxTokens);
        }

        return { enrichedText, wasEnriched: true };
    } catch (error) {
        // Return original text on error
        return { enrichedText: text, wasEnriched: false };
    }
}
