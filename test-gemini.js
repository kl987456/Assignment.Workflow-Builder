const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

// Initialize with provided key
const genAI = new GoogleGenerativeAI(API_KEY);

const models = [
    'gemini-pros', // Intentional typo to test error handling (or maybe not?) Let's use real names first.
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    // 'gemini-1.0-pro' // older alias
];

async function testModel(modelName) {
    console.log(`Checking: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello friend, reply with 'Confirmed' if you can read this.");
        const response = await result.response;
        const text = response.text();
        console.log(`  -> SUCCESS! Output: "${text.trim()}"`);
        return true;
    } catch (error) {
        console.log(`  -> FAILED: ${error.message.split('\n')[0]}`); // Print first line of error
        return false;
    }
}

(async () => {
    console.log('\n--- DIAGNOSING GEMINI API KEY ---');
    console.log(`Key: ${API_KEY.substring(0, 10)}... (Redacted)\n`);

    const working = [];
    for (const model of models) {
        const success = await testModel(model);
        if (success) working.push(model);
    }

    console.log('\n--- DIAGNOSIS SUMMARY ---');
    if (working.length > 0) {
        console.log('✅ The following models are FULLY FUNCTIONAL with your key:');
        working.forEach(m => console.log(`  - ${m}`));
        console.log(`\nRecommended Action: Use '${working[0]}' in your .env.local`);
    } else {
        console.log('❌ ALL MODELS FAILED. Your API key might be invalid, or billing disabled.');
    }
})();
