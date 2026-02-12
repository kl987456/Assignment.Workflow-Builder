import { z } from 'zod';
import logger from './logger';
import { WorkflowStep, WorkflowStepResult, WorkflowStepType } from './types';

const MOCK_DELAY = 1000;
const MAX_RETRIES = 2;

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Agent Personas ---
const AGENT_PERSONAS = {
    summarize: "You are the 'Executive Briefer Agent', an expert in distilling complex information into concise, high-impact executive summaries. Your goal is to provide clarity and focus.",
    extract_key_points: "You are the 'Strategic Analyst Agent', capable of identifying the most critical information and structural elements within a text. Your goal is to extract actionable insights.",
    analyze_sentiment: "You are the 'Empathy Engine Agent', a sophisticated psychologist AI designed to detect subtle emotional nuances, tone, and underlying sentiment. Your goal is to provide deep emotional intelligence analysis.",
    extract_action_items: "You are the 'Operations Manager Agent'. Your job is to identify concrete tasks, directives, and next steps from the text.",
    rewrite_polite: "You are the 'Communications Director Agent'. Your job is to rewrite the input text to be extremely professional, polished, and diplomatic.",
};

// Zod Schemas for Structured Output
const ActionItemsSchema = z.object({
    actions: z.array(z.string()).describe("List of concrete action items or tasks found in the text"),
});

const PolisherSchema = z.object({
    polished_text: z.string().describe("The professionally rewritten version of the input text"),
    tone_shift: z.string().describe("Brief description of how the tone was improved"),
});

// Zod Schemas for Structured Output
const KeyPointsSchema = z.object({
    points: z.array(z.string()).describe("List of key strategic points extracted from the text"),
});

const SentimentSchema = z.object({
    sentiment: z.enum(['Positive', 'Negative', 'Neutral']),
    explanation: z.string().describe("Detailed psychological analysis of the sentiment"),
    confidence: z.coerce.number().min(0).max(1).optional(),
});

const SummarySchema = z.object({
    summary: z.string().describe("Concise summary of the text"),
});

export async function executeWorkflowStep(
    step: WorkflowStep,
    input: string
): Promise<WorkflowStepResult> {
    const startTime = Date.now();
    let output = '';
    let status: 'success' | 'failed' = 'success';

    logger.info(`Starting execution for step: ${step.type}`, { stepId: step.id, inputLength: input.length });

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
            case 'extract_action_items':
                output = await extractActionItems(input);
                break;
            case 'rewrite_polite':
                output = await rewritePolite(input);
                break;
            default:
                throw new Error(`Unknown step type: ${step.type}`);
        }
        logger.info(`Step ${step.type} completed successfully`, { stepId: step.id, durationMs: Date.now() - startTime });
    } catch (error) {
        logger.error(`Step ${step.type} failed`, { stepId: step.id, error: (error as Error).message });
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
    // Basic cleaning, could be enhanced with Zod string validation if needed
    return input
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
}

/**
 * Robust LLM Caller with Retry Logic and Structured Validation
 */
async function callStructuredLLM<T>(
    input: string,
    prompt: string,
    schema: z.ZodSchema<T>,
    schemaName: string
): Promise<T> {
    let lastError: Error | null = null;
    let attempt = 0;
    let adaptivePrompt = prompt;

    while (attempt < MAX_RETRIES) {
        attempt++;
        try {
            const rawResponse = await callLLMInternal(input, adaptivePrompt, true);

            // Robust JSON extraction
            const jsonMatch = rawResponse.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (!jsonMatch) throw new Error("No JSON structure found in LLM response");

            const stringToParse = jsonMatch[0]
                .replace(/\\n/g, ' ') // Handle escaped newlines
                .trim();

            const parsed = JSON.parse(stringToParse);
            const validated = schema.parse(parsed);

            logger.info(`LLM Call successful for ${schemaName}`, { attempt, provider: process.env.GEMINI_API_KEY ? 'gemini' : 'mock' });
            return validated;
        } catch (error) {
            lastError = error as Error;
            logger.warn(`LLM Call attempt ${attempt} failed for ${schemaName}`, {
                error: lastError.message,
                attempt
            });

            // ADAPTIVE FEEDBACK: Tell the LLM exactly what it got wrong
            adaptivePrompt = `${prompt}\n\nCRITICAL FIX REQUIRED: Your previous response failed validation with error: "${lastError.message}". Please ensure your response is STRICTLY valid JSON and follows the schema exactly.`;

            await wait(1000 * attempt);
        }
    }

    // Fallback or throw after output validation failure
    throw new Error(`Failed to generate valid ${schemaName} after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`);
}

/**
 * Internal LLM caller (Hugging Face / Gemini / Mock)
 * Now accepts a 'jsonMode' flag to hint prompt engineering
 */
async function callLLMInternal(input: string, instruction: string, jsonMode: boolean = false): Promise<string> {
    const jsonInstruction = jsonMode ? " You MUST return a valid JSON object." : "";
    const fullInstruction = `${instruction}.${jsonInstruction}`;

    // 1. Try Hugging Face
    if (process.env.HUGGING_FACE_API_KEY) {
        try {
            return await callHuggingFace(input, fullInstruction);
        } catch (e) {
            logger.warn("Hugging Face failed, falling back.", { error: (e as Error).message });
        }
    }

    // 2. Try Gemini
    if (process.env.GEMINI_API_KEY) {
        try {
            return await callGemini(input, fullInstruction);
        } catch (e) {
            logger.warn("Gemini failed, falling back.", { error: (e as Error).message });
        }
    }

    // 3. Fallback to Mock
    await wait(MOCK_DELAY);

    // Return mock JSON if requested
    if (jsonMode) {
        const lowerInst = instruction.toLowerCase();
        if (lowerInst.includes("sentiment")) {
            return JSON.stringify({
                sentiment: "Neutral",
                explanation: "[MOCK] The Empathy Engine Agent has detected a neutral tone in the absence of a live neural link (API Key). The text appears balanced but requires deeper analysis.",
                confidence: 0.85
            });
        }
        if (lowerInst.includes("action items")) {
            return JSON.stringify({
                actions: ["[MOCK] Task 1: Verify API Key", "[MOCK] Task 2: Review system logs"]
            });
        }
        if (lowerInst.includes("key points") || lowerInst.includes("extract")) {
            return JSON.stringify({
                points: [
                    "[MOCK] Strategic Insight 1: The system is currently operating in simulation mode.",
                    "[MOCK] Strategic Insight 2: Connect a valid API key to unlock full neural processing capabilities."
                ]
            });
        }
        if (lowerInst.includes("rewrite")) {
            return JSON.stringify({
                polished_text: `[MOCK] This is a professionally polished version of your input text (length ${input.length}). The Communications Director Agent has refined the tone for maximum impact.`,
                tone_shift: "More formal and diplomatic"
            });
        }
    }

    return `[MOCK MODE] (No valid API Key found)\nFor: ${instruction}\nInput length: ${input.length} chars`;
}

async function callHuggingFace(input: string, instruction: string): Promise<string> {
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    const model = process.env.HUGGING_FACE_MODEL || "mistralai/Mistral-7B-Instruct-v0.2";

    const response = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            inputs: `<s>[INST] ${instruction}:\n\n"${input}" [/INST]`,
            parameters: { max_new_tokens: 500, return_full_text: false }
        }),
    });

    if (!response.ok) {
        throw new Error(`Hugging Face API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
        return result[0].generated_text.trim();
    } else if (typeof result === 'object' && result.generated_text) {
        return result.generated_text.trim();
    }
    return JSON.stringify(result);
}

async function callGemini(input: string, prompt: string): Promise<string> {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || "gemini-pro";
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(`${prompt}:\n\n${input}`);
    const response = await result.response;
    return response.text();
}

async function summarizeText(input: string): Promise<string> {
    try {
        const data = await callStructuredLLM(
            input,
            `${AGENT_PERSONAS.summarize} Summarize the following text concisely. Return JSON with a 'summary' field.`,
            SummarySchema,
            "Summary"
        );
        return data.summary;
    } catch (e) {
        logger.error("Failed to summarize structurally", { error: e });
        // Return raw text if we can't get structure, or just fail
        return `Failed to generate summary: ${(e as Error).message}`;
    }
}

async function extractKeyPoints(input: string): Promise<string> {
    try {
        const data = await callStructuredLLM(
            input,
            `${AGENT_PERSONAS.extract_key_points} Extract main key points. Return JSON with a 'points' array of strings.`,
            KeyPointsSchema,
            "KeyPoints"
        );
        return data.points.map(p => `• ${p}`).join('\n');
    } catch (e) {
        logger.error("Failed to extract key points", { error: e });
        return `Failed to extract points: ${(e as Error).message}`;
    }
}

async function analyzeSentiment(input: string): Promise<string> {
    try {
        const data = await callStructuredLLM(
            input,
            `${AGENT_PERSONAS.analyze_sentiment} Analyze sentiment. Return JSON with 'sentiment' (Positive/Negative/Neutral), 'explanation', and optional 'confidence'.`,
            SentimentSchema,
            "Sentiment"
        );
        return `**Sentiment:** ${data.sentiment}\n**Confidence:** ${data.confidence ?? 'N/A'}\n\n${data.explanation}`;
    } catch (e) {
        logger.error("Failed to analyze sentiment", { error: e });
        return `Failed to analyze sentiment: ${(e as Error).message}`;
    }
}

async function extractActionItems(input: string): Promise<string> {
    try {
        const data = await callStructuredLLM(
            input,
            `${AGENT_PERSONAS.extract_action_items} Extract action items. Return JSON with 'actions' array.`,
            ActionItemsSchema,
            "ActionItems"
        );
        if (data.actions.length === 0) return "No specific action items detected.";
        return data.actions.map((a, i) => `${i + 1}. [ ] ${a}`).join('\n');
    } catch (e) {
        logger.error("Failed to extract action items", { error: e });
        return `Failed to extract action items: ${(e as Error).message}`;
    }
}

async function rewritePolite(input: string): Promise<string> {
    try {
        const data = await callStructuredLLM(
            input,
            `${AGENT_PERSONAS.rewrite_polite} Rewrite text to be professional. Return JSON with 'polished_text' and 'tone_shift'.`,
            PolisherSchema,
            "Polisher"
        );
        return `**Tone Shift:** ${data.tone_shift}\n\n${data.polished_text}`;
    } catch (e) {
        logger.error("Failed to polish text", { error: e });
        return `Failed to polish text: ${(e as Error).message}`;
    }
}
