# Deployment Guide

## 1. Local Development (Running `npm run dev`)

When you make code changes or update environment variables locally:

1.  **Code Changes:** Next.js automatically hot-reloads. You don't need to restart.
2.  **Environment Variables (`.env.local`):**
    *   **Stop the server:** Press `Ctrl + C` in your terminal.
    *   **Start the server again:** Run `npm run dev`.

### Setting up Environment Variables
To activate the Hugging Face model, create a file named `.env.local` in the root directory:

```env
# .env.local
HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx
HUGGING_FACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

---

## 2. Docker Deployment

When deploying with Docker, you must rebuild the image to include code changes.

1.  **Build the Image:**
    ```bash
    docker build -t workflow-builder-lite .
    ```

2.  **Run the Container:**
    Pass your API key using the `-e` flag:
    ```bash
    docker run -p 3000:3000 -e HUGGING_FACE_API_KEY=hf_xxxxxxxx workflow-builder-lite
    ```

---

## 3. Cloud Deployment (Vercel, Netlify, etc.)

Since this project is pushed to GitHub, redeployment is usually automatic.

1.  **Trigger:** Pushing updates to the `main` branch (which I just did) automatically triggers a new build.
2.  **Environment Variables:**
    *   Go to your dashboard (e.g., Vercel Project Settings).
    *   Add `HUGGING_FACE_API_KEY` and `HUGGING_FACE_MODEL` to the Environment Variables section.
    *   Redeploy if the variables were added *after* the build started.
