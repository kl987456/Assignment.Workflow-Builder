# AI Notes

## Usage of AI Tools
This project leverages advanced AI coding assistance to accelerate development while maintaining strict control over architecture and design.

### 🤖 Role & Responsibilities
-   **Architectural Planning:** I used AI to brainstorm implementation strategies, specifically choosing a local JSON file for persistence to balance functionality with simplicity.
-   **Code Generation:** AI was utilized to generate boilerplate code for Next.js components, Tailwind utility classes, and complex Framer Motion animations.
-   **Problem Solving:** AI tools assisted in debugging UI visibility issues, suggesting high-contrast color palettes for the dark theme.

### 🧠 LLM & Providers

#### 1. Hugging Face Inference API (Primary)
-   **Model:** Defaults to `mistralai/Mistral-7B-Instruct-v0.2`, but configurable via `HUGGING_FACE_MODEL`.
-   **Integration:** implemented using the standard `fetch` API to call the Hugging Face Inference endpoints.
-   **Reasoning:** Provides access to a wide range of open-source models (Llama 3, Mistral, etc.) with a simple API key.

#### 2. Google Gemini (Secondary/Fallback)
-   **Model:** `gemini-pro` (configurable via `GEMINI_MODEL`).
-   **Integration:** Uses the `@google/generative-ai` SDK.
-   **Role:** Acts as a robust fallback if the Hugging Face API key is missing or the service is down.

### ✅ Verification
-   **Mock Mode:** I implemented a fallback "Mock Mode" for the workflow engine. This ensures the app works immediately for reviewers even without any live API keys.
-   **Type Safety:** Standard `npm run build` checks were run to ensure TypeScript compliance.
-   **Visuals:** The UI was iteratively improved based on visual feedback to ensure a professional and accessible user experience.
