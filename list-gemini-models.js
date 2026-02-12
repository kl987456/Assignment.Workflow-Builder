const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

function listModels() {
    return new Promise((resolve, reject) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

        https.get(url, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`Failed to list models. Status: ${res.statusCode}`);
                    console.error('Body:', body);
                    resolve([]);
                    return;
                }
                try {
                    const data = JSON.parse(body);
                    resolve(data.models || []);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    resolve([]);
                }
            });
        }).on('error', (e) => {
            console.error('Network error:', e);
            resolve([]);
        });
    });
}

(async () => {
    console.log('--- Listing Available Gemini Models ---');
    const models = await listModels();

    if (models.length === 0) {
        console.log('❌ No models found or API key invalid.');
        return;
    }

    console.log(`Found ${models.length} models. Filtering for 'generateContent' support...`);

    const contentModels = models.filter(m =>
        m.supportedGenerationMethods &&
        m.supportedGenerationMethods.includes('generateContent')
    );

    if (contentModels.length > 0) {
        console.log('\n✅ AVAILABLE MODELS FOR CONTENT GENERATION:');
        contentModels.forEach(m => {
            console.log(`  - ${m.name.replace('models/', '')} (${m.displayName})`);
        });

        const recommended = contentModels.find(m => m.name.includes('gemini-1.5-flash')) || contentModels[0];
        const modelName = recommended.name.replace('models/', '');

        console.log(`\nRecommended Action: Set GEMINI_MODEL=${modelName}`);
    } else {
        console.log('❌ No models support content generation.');
    }
})();
