import robot from '@jitsi/robotjs';

/**
 * Simulates Cmd+V to paste the clipboard content into the current active application.
 * Uses robotjs which directly calls CGEvent APIs from within the Electron process.
 *
 * REQUIRES: Accessibility permission in System Settings > Privacy & Security > Accessibility
 * NOTE: If not working, remove and re-add the app from the Accessibility list
 *
 * @returns Object with success status
 */
export async function triggerPaste(): Promise<{ success: boolean; error?: string }> {
    try {
        // Small delay to ensure clipboard is synced
        await new Promise(resolve => setTimeout(resolve, 50));

        // Use robotjs to simulate Cmd+V
        robot.keyTap('v', 'command');

        return { success: true };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('[AutoPaste] Failed:', error);
        return { success: false, error: errorMsg };
    }
}
