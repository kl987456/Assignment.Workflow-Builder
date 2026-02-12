const https = require('https');

const API_KEY = process.env.HUGGING_FACE_API_KEY;
if (!API_KEY) {
    console.error('Error: HUGGING_FACE_API_KEY is missing.');
    process.exit(1);
}

const TEST_INPUT = 'Describe the sun in 5 words.';

const models = [
    'Qwen/Qwen2.5-Coder-32B-Instruct',
    'mistralai/Mistral-7B-Instruct-v0.3',
    'mistralai/Mistral-7B-Instruct-v0.2',
    'openai-community/gpt2',
    'openai-community/gpt2-large',
    'google/flan-t5-base',
    'google/flan-t5-large',
    'Google/gemma-2b-it', // Updated to correct Google Gemma if google/flan deprecated
    'meta-llama/Meta-Llama-3-8B-Instruct'
];

async function testModel(model) {
    console.log(`Testing: ${model}...`);
    return new Promise((resolve) => {
        const data = JSON.stringify({
            inputs: TEST_INPUT,
            parameters: { max_new_tokens: 10 }
        });

        const options = {
            hostname: 'router.huggingface.co',
            path: `/hf-inference/models/${model}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                const success = res.statusCode === 200;
                console.log(`  -> Status: ${res.statusCode} ${res.statusMessage}`);
                if (!success) {
                    console.log(`  -> Error Body: ${body.substring(0, 100)}...`);
                } else {
                    console.log(`  -> Success! Response received.`);
                }
                resolve({ model, success, status: res.statusCode });
            });
        });

        req.on('error', (error) => {
            console.error(`  -> Network Error: ${error.message}`);
            resolve({ model, success: false, status: 'Network Error' });
        });

        req.write(data);
        req.end();
    });
}

(async () => {
    console.log('--- Starting Model Connectivity Test ---');
    console.log(`API Key: ${API_KEY.substring(0, 8)}...`);

    const results = [];
    for (const model of models) {
        results.push(await testModel(model));
    }

    console.log('\n--- Summary ---');
    const working = results.filter(r => r.success).map(r => r.model);

    if (working.length > 0) {
        console.log('✅ WORKING MODELS:');
        working.forEach(m => console.log(`  - ${m}`));
        console.log(`\nRecommended Action: Set HUGGING_FACE_MODEL=${working[0]} in your .env.local`);
    } else {
        console.log('❌ NO MODELS WORKED. Please check your API Key permissions separately.');
    }
})();
