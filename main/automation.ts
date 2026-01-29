
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Simulates Cmd+V to paste the clipboard content into the current active application.
 * Uses native macOS 'osascript' to avoid external dependencies.
 */
export async function triggerPaste(): Promise<void> {
    try {
        // Simple AppleScript to send Cmd+V
        const script = `tell application "System Events" to keystroke "v" using command down`;
        await execAsync(`osascript -e '${script}'`);
    } catch (error) {
        console.error('Failed to trigger paste:', error);
    }
}
