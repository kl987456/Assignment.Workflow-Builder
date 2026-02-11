# Workflow Builder Lite

A premium, AI-powered tool to build and run simple text processing workflows. Built with Next.js 14, Tailwind CSS, Framer Motion, and Google Gemini.

## 🚀 Features

### Core Functionality
-   **Visual Workflow Builder:** Drag-and-drop style interface (click to add) for creating linear text processing pipelines.
-   **Available Steps:**
    -   ✂️ **Clean Text:** Removes formatting and extra whitespace.
    -   📝 **Summarize:** Generates concise summaries (AI-powered).
    -   📋 **Key Points:** Extracts main bullet points (AI-powered).
    -   ✨ **Analyze Sentiment:** Determines tone and sentiment (AI-powered).
-   **Run History:** persistent local history of all workflow runs.
-   **System Status:** Real-time health check of backend APIs and storage.

### Premium UI/UX
-   **Dark Mode Glassmorphism:** A modern, high-contrast dark theme with translucent glass cards.
-   **Smooth Animations:** Powered by **Framer Motion** for fluid transitions and list reordering.
-   **Interactive Elements:** Glowing borders, hover effects, and responsive feedback.
-   **Responsive Design:** Fully optimized for all screen sizes.

## 🛠️ Tech Stack
-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Language:** TypeScript
-   **AI:** Google Generative AI SDK (Gemini)

## 📦 Installation & Running

### Option 1: Run Locally (Recommended for Development)
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/workflow-builder-lite.git
    cd workflow-builder-lite
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment (Optional):**
    Create a `.env.local` file to use real AI (otherwise runs in Mock Mode):
    ```env
    GEMINI_API_KEY=your_google_ai_key
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Run with Docker
1.  **Build the image:**
    ```bash
    docker build -t workflow-builder-lite .
    ```
2.  **Run the container:**
    ```bash
    docker run -p 3000:3000 -e GEMINI_API_KEY=your_key workflow-builder-lite
    ```

## 📂 Project Structure
-   `src/app/`: Next.js App Router pages (`page.tsx`, `history/`, `status/`).
-   `src/lib/`:
    -   `workflow-engine.ts`: Core logic for executing steps (Mock & Real AI).
    -   `types.ts`: TypeScript definitions.
-   `data/`: Stores `history.json` for persistence (created automatically).

## 🤖 AI Logic & Mock Mode
The application includes a robust **Mock Mode**. If no `GEMINI_API_KEY` is provided, the system simulates AI processing delays and returns realistic placeholder data, allowing users to test the full UI flow without an API key.
