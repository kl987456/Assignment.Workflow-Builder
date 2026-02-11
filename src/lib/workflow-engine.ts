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
// Hugging Face Inference API Implementation
async function callHuggingFace(input: string, instruction: string): Promise<string> {
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    const model = process.env.HUGGING_FACE_MODEL || "mistralai/Mistral-7B-Instruct-v0.2";

    if (!apiKey) {
        console.warn("No Hugging Face API key found.");
        throw new Error("Missing HUGGING_FACE_API_KEY");
    }

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                inputs: `<s>[INST] ${instruction}:\n\n"${input}" [/INST]`,
                parameters: {
                    max_new_tokens: 500,
                    return_full_text: false,
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        // Hugging Face usually returns an array of objects with 'generated_text'
        if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
            return result[0].generated_text.trim();
        } else if (typeof result === 'object' && result.generated_text) {
            return result.generated_text.trim();
        }

        return JSON.stringify(result);

    } catch (error) {
        console.error("Hugging Face API call failed:", error);
        throw error;
    }
}

// Unified LLM Caller (Prioritizes Hugging Face, falls back to Mock)
async function callLLM(input: string, prompt: string): Promise<string> {
    // 1. Try Hugging Face
    if (process.env.HUGGING_FACE_API_KEY) {
        try {
            return await callHuggingFace(input, prompt);
        } catch (e) {
            console.error("Hugging Face failed, falling back to mock.", e);
        }
    }

    // 2. Try Gemini (Legacy/Alternative)
    if (process.env.GEMINI_API_KEY) {
        try {
            return await mockGeminiCall(input, prompt);
        } catch (e) {
            console.error("Gemini failed, falling back to mock.", e);
        }
    }

    // 3. Fallback to Mock
    await wait(MOCK_DELAY);
    return `[MOCK MODE] (No valid API Key found)\nFor: ${prompt}\nInput length: ${input.length} chars`;
}

async function summarizeText(input: string): Promise<string> {
    return callLLM(input, "Please summarize the following text concisely");
}

async function extractKeyPoints(input: string): Promise<string> {
    return callLLM(input, "Extract the main key points from the following text as a bulleted list");
}

async function analyzeSentiment(input: string): Promise<string> {
    return callLLM(input, "Analyze the sentiment of the following text (Positive, Negative, or Neutral) and explain why");
}

// Deprecated direct Gemini call - kept for backward compatibility if needed internally
async function mockGeminiCall(input: string, prompt: string): Promise<string> {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelName = process.env.GEMINI_MODEL || "gemini-pro";
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${prompt}:\n\n${input}`);
        const response = await result.response;
        return response.text();
    } catch (e) {
        throw e;
    }
}
