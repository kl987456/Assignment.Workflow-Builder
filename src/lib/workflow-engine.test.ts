import { describe, it, expect, vi } from 'vitest';
import { executeWorkflowStep } from './workflow-engine';
import { WorkflowStep } from './types';

// Mock logger
vi.mock('./logger', () => ({
    default: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

describe('Workflow Engine', () => {

    it('should clean text correctly', async () => {
        const step: WorkflowStep = { id: '1', type: 'clean_text' };
        const result = await executeWorkflowStep(step, '  Hello World  ');
        expect(result.output).toBe('Hello World');
    });

    it('should return mock sentiment', async () => {
        const originalEnv = process.env;
        process.env = { ...originalEnv, GEMINI_API_KEY: '', HUGGING_FACE_API_KEY: '' };

        const step: WorkflowStep = { id: '2', type: 'analyze_sentiment' };
        const result = await executeWorkflowStep(step, 'Test');

        expect(result.output).toContain('[MOCK]');
        expect(result.output).toContain('Sentiment');

        process.env = originalEnv;
    });

    it('should return mock key points', async () => {
        const originalEnv = process.env;
        process.env = { ...originalEnv, GEMINI_API_KEY: '', HUGGING_FACE_API_KEY: '' };

        const step: WorkflowStep = { id: '3', type: 'extract_key_points' };
        const result = await executeWorkflowStep(step, 'Test');

        expect(result.output).toContain('[MOCK]');

        process.env = originalEnv;
    });

    it('should return mock action items', async () => {
        const originalEnv = process.env;
        process.env = { ...originalEnv, GEMINI_API_KEY: '', HUGGING_FACE_API_KEY: '' };

        const step: WorkflowStep = { id: '4', type: 'extract_action_items' };
        const result = await executeWorkflowStep(step, 'Test');

        expect(result.output).toContain('[MOCK]');

        process.env = originalEnv;
    });

    it('should return mock polished text', async () => {
        const originalEnv = process.env;
        process.env = { ...originalEnv, GEMINI_API_KEY: '', HUGGING_FACE_API_KEY: '' };

        const step: WorkflowStep = { id: '5', type: 'rewrite_polite' };
        const result = await executeWorkflowStep(step, 'Test');

        expect(result.output).toContain('[MOCK]');
        expect(result.output).toContain('Tone Shift');

        process.env = originalEnv;
    });

});
