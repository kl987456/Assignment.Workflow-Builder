import { test, expect } from '@playwright/test';

test.describe('Workflow Builder E2E', () => {
    test('should create and run a workflow', async ({ page }) => {
        // 1. Load Home Page
        await page.goto('/');
        await expect(page.locator('h1')).toContainText('CORTEX PRIME');

        // 2. Add Steps
        const agents = ['Data Sanitizer', 'Executive Briefer', 'Empathy Engine'];
        for (const agent of agents) {
            await page.click(`button:has-text("${agent}")`);
        }

        // 3. Verify steps are in the pipeline
        await expect(page.locator('text=NEURAL PIPELINE')).toBeVisible();
        await expect(page.locator('text=3 NODES')).toBeVisible();

        // 4. Execute Workflow
        await page.click('button:has-text("EXECUTE")');

        // 5. Wait for results (using SUCCESS indicator)
        await expect(page.locator('text=SUCCESS')).toBeVisible({ timeout: 20000 });

        // 6. Navigate to Archive
        await page.goto('/history');
        await expect(page.locator('h1')).toContainText('MAIN ARCHIVE');
        await expect(page.locator('text=RID-').first()).toBeVisible();
    });

    test('should display diagnostics status', async ({ page }) => {
        await page.goto('/status');
        await expect(page.locator('h1')).toContainText('DIAGNOSTICS');
        await expect(page.locator('text=LIVE')).toBeVisible();
    });
});
