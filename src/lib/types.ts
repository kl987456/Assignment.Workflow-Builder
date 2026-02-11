export type WorkflowStepType = 'clean_text' | 'summarize' | 'extract_key_points' | 'analyze_sentiment';

export interface WorkflowStep {
    id: string;
    type: WorkflowStepType;
    params?: Record<string, any>;
}

export interface WorkflowRunResult {
    id: string;
    timestamp: string;
    steps: WorkflowStepResult[];
    status: 'success' | 'augment_failed' | 'failed';
    originalInput: string;
}

export interface WorkflowStepResult {
    stepId: string;
    stepType: WorkflowStepType;
    input: string;
    output: string;
    status: 'success' | 'failed';
    durationMs: number;
}
