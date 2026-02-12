import { NextRequest, NextResponse } from 'next/server';
import { executeWorkflowStep } from '@/lib/workflow-engine';
import { WorkflowStep, WorkflowRunResult, WorkflowStepResult } from '@/lib/types';
import logger from '@/lib/logger';
import fs from 'fs';
import path from 'path';

// Helper to save run to history check
async function saveRunToHistory(run: WorkflowRunResult) {
    try {
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        const historyFile = path.join(dataDir, 'history.json');
        let history: WorkflowRunResult[] = [];

        if (fs.existsSync(historyFile)) {
            const fileContent = fs.readFileSync(historyFile, 'utf-8');
            try {
                history = JSON.parse(fileContent);
            } catch (e) {
                logger.error("Failed to parse history file", { error: (e as Error).message });
                history = [];
            }
        }

        // Add new run to the beginning
        history.unshift(run);

        // Keep only last 50 runs or so to avoid file growing too large
        if (history.length > 50) {
            history = history.slice(0, 50);
        }

        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    } catch (error) {
        logger.error("Failed to save history", { error: (error as Error).message });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { steps, inputText } = body;

        if (!steps || !Array.isArray(steps) || steps.length === 0) {
            return NextResponse.json({ error: 'Invalid steps' }, { status: 400 });
        }

        if (!inputText) {
            return NextResponse.json({ error: 'Missing input text' }, { status: 400 });
        }

        const runId = crypto.randomUUID();
        const stepResults: WorkflowStepResult[] = [];
        let currentInput = inputText;
        let workflowStatus: 'success' | 'failed' | 'augment_failed' = 'success';

        logger.info(`Initialized workflow execution`, { runId, stepsCount: steps.length });

        // Execute steps sequentially
        for (const step of steps) {
            const stepStart = Date.now();
            const result = await executeWorkflowStep(step, currentInput);
            stepResults.push(result);

            logger.info(`Step execution result`, {
                runId,
                stepType: step.type,
                status: result.status,
                durationMs: Date.now() - stepStart
            });

            if (result.status === 'failed') {
                workflowStatus = 'failed';
                logger.error(`Workflow execution halted`, { runId, stepType: step.type });
                break;
            }

            currentInput = result.output;
        }

        const runResult: WorkflowRunResult = {
            id: runId,
            timestamp: new Date().toISOString(),
            steps: stepResults,
            status: workflowStatus,
            originalInput: inputText,
            durationMs: stepResults.reduce((acc, s) => acc + s.durationMs, 0)
        };

        // Save to history asynchronously
        await saveRunToHistory(runResult);

        return NextResponse.json(runResult);
    } catch (error) {
        logger.error("Workflow execution error", { error: (error as Error).message });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
