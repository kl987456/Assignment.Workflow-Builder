# Prompts Used

The following is a log of the key prompts I used to guide the AI agent in building the **Workflow Builder Lite** application. I structured my requests to ensure high code quality, a premium user interface, and clear documentation.

## 1. Project Initialization & Architecture
> **Prompt:**
> "Act as a senior full-stack developer. I need you to build a 'Workflow Builder Lite' web application using Next.js 14 (App Router), TypeScript, and Tailwind CSS.
>
> **Core Requirements:**
> 1.  **Workflow Engine:** Create an interface to define linear text processing steps (Clean Text, Summarize, Extract Key Points, Analyze Sentiment).
> 2.  **Execution:** The app must be able to run these steps purely on the frontend or via API routes.
> 3.  **Persistence:** Implement a local JSON-based storage system to save the history of workflow runs.
> 4.  **Status Monitoring:** Add a health check page for backend and file system status.
>
> Please start by creating a comprehensive implementation plan and initializing the project structure."

## 2. Core Implementation
> **Prompt:**
> "Proceed with the implementation plan. Create the following core components:
> -   **`src/lib/workflow-engine.ts`**: Implement the logic to process text. Include a 'This is a mock' fallback mode if the OpenAI/Gemini API key is missing so the app works out-of-the-box.
> -   **`src/app/page.tsx`**: The main builder interface. Use shadcn/ui-style components for a clean look.
> -   **`src/app/history/page.tsx`**: A view to list past runs, expandable to show details.
>
> Ensure robust error handling for the API routes."

## 3. Visual Polish & Premium UI
> **Prompt:**
> "The current UI is functional but lacks the 'wow' factor. I want you to elevate the design to a **Premium Dark Mode** aesthetic.
>
> **Specific Design Directives:**
> 1.  **Theme:** Implement a deep slate/indigo dark theme (`slate-950` background).
> 2.  **Glassmorphism:** Use translucent backgrounds with backdrop blur for cards and headers.
> 3.  **Typography:** Use the `Inter` font with tight tracking for a professional look. Ensure high contrast text for readability.
> 4.  **Motion:** Integrate **Framer Motion**. Add smooth layout transitions when adding/removing steps and fade-in effects for results. The app should feel 'alive'."

## 4. Docker & Deployment
> **Prompt:**
> "To ensure this application is easy to review, I need a containerized setup.
>
> 1.  Create a `Dockerfile` optimized for Next.js standalone output.
> 2.  Update the `next.config.ts` to support standalone builds.
> 3.  Verify that the app builds correctly with `docker build`."

## 5. Documentation & Finalization
> **Prompt:**
> "Prepare the project for final submission. Generate the following documentation files:
> -   **`README.md`**: detailed instructions on how to install and run the app (both Local and Docker methods), and a feature list.
> -   **`AI_NOTES.md`**: An explanation of the AI models (Gemini) used and the rationale behind architectural decisions.
> -   **`ABOUTME.md`**: A brief profile of the agentic workflow.
>
> Ensure the code is clean, unused imports are removed, and the repository is ready for handoff."
