import { WorkflowStep, WorkflowStepResult, WorkflowStepType } from './types';

const MOCK_DELAY = 1000;

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function executeWorkflowStep(
    step: WorkflowStep,
    input: string
): Promise<WorkflowStepResult> {
    const startTime = Date.now();
    let output = '';
    let status: 'success' | 'failed' = 'success';

    try {
        switch (step.type) {
            case 'clean_text':
                output = cleanText(input);
                await wait(500); // Simulate processing
                break;
            case 'summarize':
                output = await summarizeText(input);
                break;
            case 'extract_key_points':
                output = await extractKeyPoints(input);
                break;
            case 'analyze_sentiment':
                output = await analyzeSentiment(input);
                break;
            default:
                throw new Error(`Unknown step type: ${step.type}`);
        }
    } catch (error) {
        console.error(`Step ${step.type} failed:`, error);
        status = 'failed';
        output = `Error processing step: ${(error as Error).message}`;
    }

    return {
        stepId: step.id,
        stepType: step.type,
        input,
        output,
        status,
        durationMs: Date.now() - startTime,
    };
}

// --- Implementation of Steps ---

function cleanText(input: string): string {
    return input
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
}

// Mock/Real LLM Implementations
// In a real app, this would call the Gemini API
async function summarizeText(input: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        await wait(MOCK_DELAY);
        return `[MOCK SUMMARIZATION]\nThis is a simulated summary of the input text. The input was ${input.length} characters long. To get real summarization, please configure the GEMINI_API_KEY environment variable.`;
    }

    // TODO: Implement actual Gemini call
    return mockGeminiCall(input, "Summarize this text");
}

async function extractKeyPoints(input: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        await wait(MOCK_DELAY);
        return `[MOCK KEY POINTS]\n- Point 1: The input text discusses...\n- Point 2: Key theme appears to be...\n- Point 3: It mentions specific details about...`;
    }
    return mockGeminiCall(input, "Extract key points from this text");
}

async function analyzeSentiment(input: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        await wait(MOCK_DELAY);
        return `[MOCK SENTIMENT]\nSentiment: Positive\nConfidence: 85%\n\nThe text generally conveys a constructive tone.`;
    }
    return mockGeminiCall(input, "Analyze the sentiment of this text");
}

async function mockGeminiCall(input: string, prompt: string): Promise<string> {
    // Placeholder for actual API call logic if we were to implement it right here
    // For now, even with a key, we might need the library installed.
    // Since we can't guarantee 'npm install' is done, we'll keep this simple.

    // NOTE: If we want real LLM, we should use the Google Generative AI SDK
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    // For this prototype, we will stick to the mock or a simple fetch if needed.

    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelName = process.env.GEMINI_MODEL || "gemini-pro";
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${prompt}:\n\n${input}`);
        const response = await result.response;
        return response.text();
    } catch (e) {
        console.error("Gemini API call failed, falling back to mock", e);
        await wait(MOCK_DELAY);
        return `[FALLBACK MOCK] API Call Failed. ${prompt} -> Result for input length ${input.length}`;
    }
}
