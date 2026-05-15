import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MESHY_API_KEY = "msy_8I5DcgxE3YA1WoZllm9oBdScD4OtKLEWZ1dN";
const BASE_URL = "https://api.meshy.ai/openapi/v2/text-to-3d";

const prompts = {
    candle: "A highly realistic, elegant half-melted wax candle resting on a minimalist dark metallic sacred geometry base, photorealistic, volumetric, highly detailed.",
    crystal: "A beautiful, complex cluster of glowing translucent amethyst crystals, highly detailed, sacred geometry, photorealistic.",
    astrolabe: "An intricate, ancient brass and silver astrolabe gyroscope with orbital rings, highly detailed, clockwork, photorealistic."
};

async function fetchJson(url, options) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        if (options.body) req.write(options.body);
        req.end();
    });
}

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function generateModel(name, prompt) {
    console.log(`Starting generation for ${name}...`);
    
    const postOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${MESHY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mode: "preview",
            prompt: prompt,
            art_style: "realistic",
            negative_prompt: "low quality, bad, cartoon, low poly"
        })
    };

    const taskRes = await fetchJson(BASE_URL, postOptions);
    const taskId = taskRes.result;
    console.log(`[${name}] Task ID: ${taskId}. Waiting for completion...`);

    const getOptions = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${MESHY_API_KEY}` }
    };

    while (true) {
        await new Promise(r => setTimeout(r, 5000));
        const statusRes = await fetchJson(`${BASE_URL}/${taskId}`, getOptions);
        console.log(`[${name}] Status: ${statusRes.status} (${statusRes.progress || 0}%)`);
        
        if (statusRes.status === 'SUCCEEDED') {
            const glbUrl = statusRes.model_urls.glb;
            console.log(`[${name}] Complete! Downloading GLB...`);
            const outPath = path.join(__dirname, '..', 'public', `${name}.glb`);
            await downloadFile(glbUrl, outPath);
            console.log(`[${name}] Saved to ${outPath}`);
            break;
        } else if (statusRes.status === 'FAILED' || statusRes.status === 'EXPIRED') {
            console.error(`[${name}] Failed!`, statusRes.task_error);
            break;
        }
    }
}

async function run() {
    const pubDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

    const promises = Object.entries(prompts).map(([name, prompt]) => generateModel(name, prompt));
    await Promise.all(promises);
    console.log("All done!");
}

run().catch(console.error);
