/**
 * System prompts for LLM enrichment modes
 */

import type { EnrichmentMode } from '../shared/types';

export const ENRICHMENT_PROMPTS: Record<Exclude<EnrichmentMode, 'none'>, string> = {
    clean: `You are a transcription cleaner. Fix grammar, punctuation, and remove filler words (um, uh, like, you know, etc.) from the following transcript. Keep the meaning and tone intact. Output only the cleaned text, nothing else.`,

    format: `You are a text formatter. Structure the following transcript into clear, readable paragraphs. Add appropriate punctuation and capitalization. Output only the formatted text, nothing else.`,

    summarize: `You are a summarizer. Extract the key points from the following transcript and present them as 3-5 concise bullet points. Output only the bullet points, nothing else.`,

    action: `You are a task extractor. Identify any action items, todos, or tasks mentioned in the following transcript. Present them as a clear checklist with checkboxes (using - [ ]). If no action items are found, say "No action items found." Output only the list, nothing else.`,

    email: `You are an email composer. Transform the following transcript into a professional email. Include appropriate greeting and sign-off. Keep the core message intact but make it suitable for professional communication. Output only the email, nothing else.`,

    notes: `You are a note-taker. Structure the following transcript into organized notes with:
- A brief title based on the main topic
- Key points as bullet items
- Any important details or context

Output only the structured notes, nothing else.`,
};

/**
 * Get the system prompt for an enrichment mode
 */
export function getSystemPrompt(mode: EnrichmentMode): string | null {
    if (mode === 'none') return null;
    return ENRICHMENT_PROMPTS[mode];
}

/**
 * Get max tokens recommendation for each mode
 */
export function getMaxTokens(mode: EnrichmentMode): number {
    switch (mode) {
        case 'summarize':
            return 300;
        case 'action':
            return 200;
        case 'clean':
        case 'format':
        case 'email':
        case 'notes':
            return 1000;
        default:
            return 500;
    }
}
