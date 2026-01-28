/**
 * OpenAI Whisper API transcription client
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

/**
 * Transcribe audio using OpenAI Whisper API
 * @param audioBuffer - WAV audio buffer (16kHz mono 16-bit PCM)
 * @param apiKey - OpenAI API key
 * @returns Transcribed text
 */
export async function transcribeWithAPI(audioBuffer: Buffer, apiKey: string): Promise<string> {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('OpenAI API key is required for API mode');
    }

    // Create form data with the audio file
    const formData = new FormData();

    // Create a Blob from the buffer
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = (errorData as { error?: { message?: string } }).error?.message || response.statusText;

            if (response.status === 401) {
                throw new Error('Invalid OpenAI API key');
            } else if (response.status === 429) {
                throw new Error('OpenAI API rate limit exceeded');
            } else {
                throw new Error(`OpenAI API error: ${errorMessage}`);
            }
        }

        const data = await response.json() as { text: string };
        return data.text || '';
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to connect to OpenAI API');
    }
}
