# AI Orchestration Notes | CORTEX PRIME

## Strategic Architecture
The core philosophy of CORTEX PRIME is **Resilient Intelligence**. The application is designed to behave like a mission-critical terminal where downtime is not an option.

### 🧩 Agentic Personas
Every agent in the CORTEX ecosystem is defined by a specific "System Prompt" designed to force a specific professional perspective:
-   **Operations Manager:** Strict focus on imperative verbs and task lists.
-   **Empathy Engine:** Instructed to look for psychological subtext and tonal shifts.
-   **Strategic Analyst:** Forced to ignore fluff and find structural insight.

### 🛡️ Multi-Provider Robustness
The "Cortex" (workflow engine) implements a **Cascade Fallback Logic**:
1.  **Hugging Face (Mistral-7B):** Primary choice for structured open-source inference.
2.  **Google Gemini (2.5 Flash):** Secondary high-performance fallback.
3.  **Local Mock Kernel:** Final safety net. If APIs return 429s (Rate Limits) or 500s, the system instantly switches to a high-fidelity simulation mode to maintain the user's flow.

### 🔍 Structured Output Engineering
To ensure the UI remains consistent, I utilize **Zod-based Structured Outputs**. 
-   LLMs are instructed to strictly return JSON.
-   The kernel utilizes dynamic JSON slicing and regex-cleaning to extract valid objects even when LLMs wrap output in Markdown clutter (e.g., ` ```json ` blocks).
-   Zod schemas validate the presence of required fields before the UI renders them.
-   **Adaptive Self-Repair:** If a response fails Zod validation, the kernel automatically retries by feeding the specific Zod error back to the LLM as a "CRITICAL FIX" instruction. This allows the model to learn and correct its own structural mistakes in real-time.

### 🧪 Operational Rigor
To eliminate "Operational Blindness", the system includes:
-   **Unit Tests (Vitest):** Validating the core kernel's ability to handle all 6 agent personas and fallbacks.
-   **E2E Tests (Playwright):** Simulating real user behavior across the entire pipeline—from text input to history archival.
-   **Structured Correlation:** Winston logs now include unique `runId` markers for every execution, enabling precise tracing of complex multi-step workflows.

### 📈 Telemetry & Observability
Every execution is tracked with:
-   `durationMs`: Precise timing of LLM responses.
-   `retryCount`: Visibility into the self-healing attempts of the kernel.
-   `pathway`: Logging of which provider (HF/Gemini/Mock) successfully fulfilled the request.

---
*Optimized for professional inference workflows.*
