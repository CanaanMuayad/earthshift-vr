/**
 * Meshy.ai API Utility
 * Generates 3D models from text prompts using Meshy.ai
 */

const MESHY_API_KEY = import.meta.env.VITE_MESHY_API_KEY || '';
const MESHY_API_BASE = 'https://api.meshy.ai/openapi/v2';

interface MeshyTaskResponse {
    result: string; // The task ID
}

interface MeshyTaskStatus {
    id: string;
    model_urls?: {
        glb: string;
        fbx?: string;
        obj?: string;
        usdz?: string;
    };
    status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'EXPIRED';
    progress: number;
    task_error?: { message: string };
}

/**
 * Initiates a text-to-3d generation task (preview mode).
 * @param prompt Text description of the 3D object to generate
 * @returns Task ID
 */
export async function createTextTo3DTask(prompt: string): Promise<string> {
    if (!MESHY_API_KEY) {
        throw new Error('Missing VITE_MESHY_API_KEY in environment');
    }

    const response = await fetch(`${MESHY_API_BASE}/text-to-3d`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${MESHY_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mode: 'preview',
            prompt: prompt,
            art_style: 'realistic',
            negative_prompt: 'low quality, low resolution',
        }),
    });

    if (!response.ok) {
        throw new Error(`Meshy API error: ${response.statusText}`);
    }

    const data: MeshyTaskResponse = await response.json();
    return data.result;
}

/**
 * Polls the status of a text-to-3d task until it succeeds or fails.
 * @param taskId The task ID
 * @param onProgress Optional callback for progress updates (0-100)
 * @returns The GLB URL of the generated model
 */
export async function waitForTaskCompletion(
    taskId: string, 
    onProgress?: (progress: number) => void
): Promise<string> {
    if (!MESHY_API_KEY) {
        throw new Error('Missing VITE_MESHY_API_KEY in environment');
    }

    const maxAttempts = 120; // 10 minutes max at 5s intervals
    const delayMs = 5000;

    for (let i = 0; i < maxAttempts; i++) {
        const response = await fetch(`${MESHY_API_BASE}/text-to-3d/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${MESHY_API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Meshy API error: ${response.statusText}`);
        }

        const data: MeshyTaskStatus = await response.json();

        if (onProgress && data.progress !== undefined) {
            onProgress(data.progress);
        }

        if (data.status === 'SUCCEEDED' && data.model_urls?.glb) {
            return data.model_urls.glb;
        }

        if (data.status === 'FAILED' || data.status === 'EXPIRED') {
            throw new Error(`Task failed: ${data.task_error?.message || 'Unknown error'}`);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    throw new Error('Task timed out');
}

/**
 * High-level function: Submits a prompt and returns the GLB URL once complete.
 * @param prompt Text description
 * @param onProgress Optional callback
 */
export async function generate3DModel(prompt: string, onProgress?: (progress: number) => void): Promise<string> {
    const taskId = await createTextTo3DTask(prompt);
    return await waitForTaskCompletion(taskId, onProgress);
}
