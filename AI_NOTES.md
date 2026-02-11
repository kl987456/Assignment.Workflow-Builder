# AI Notes

## Usage of AI Tools
This project leverages advanced AI coding assistance to accelerate development while maintaining strict control over architecture and design.

### 🤖 Role & Responsibilities
-   **Architectural Planning:** I used AI to brainstorm implementation strategies, specifically choosing a local JSON file for persistence to balance functionality with simplicity.
-   **Code Generation:** AI was utilized to generate boilerplate code for Next.js components, Tailwind utility classes, and complex Framer Motion animations.
-   **Problem Solving:** AI tools assisted in debugging UI visibility issues, suggesting high-contrast color palettes for the dark theme.

### 🧠 LLM & Provider
-   **Model:** **Google Gemini** (accessed via internal tooling/API).
-   **Why Gemini?**
    -   **Context Window:** The large context window allowed the AI to understand the full project scope, ensuring consistent variable usage and type safety across files.
    -   **Reasoning:** Gemini correctly interpreted high-level requirements like "Premium Design" into concrete implementation details (Glassmorphism, Animations) without needing overly verbose instructions.

### ✅ Verification
-   **Mock Mode:** I implemented a fallback "Mock Mode" (with AI assistance) for the workflow engine. This ensures the app works immediately for reviewers even without an live API key.
-   **Type Safety:** Standard `npm run build` checks were run to ensure TypeScript compliance.
-   **Visuals:** The UI was iteratively improved based on visual feedback to ensure a professional and accessible user experience.
