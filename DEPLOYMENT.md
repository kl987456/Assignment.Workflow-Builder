# Deployment Operations | CORTEX PRIME

## 1. Local Operation Kernel
The terminal supports hot-reloading for UI updates. However, for core engine changes:

1.  **Environment Sync:** If you update `.env.local` keys, you MUST hard-restart the process (`Ctrl + C` -> `npm run dev`).
2.  **Telemetry Check:** After boot, navigate to `/status` to verify that the kernel has successfully established a handshake with the Hugging Face or Gemini API gateways.

## 2. Containerized Deployment (Docker)
The system is fully containerized for high-availability deployments.

1.  **Build Sequence:**
    ```bash
    docker build -t cortex-prime-v3 .
    ```
2.  **Execution (Active Mode):**
    Pass neural keys as environment variables:
    ```bash
    docker run -p 3000:3000 \
      -e HUGGING_FACE_API_KEY=hf_xxxx \
      -e GEMINI_API_KEY=google_xxxx \
      cortex-prime-v3
    ```

## 3. High-Availability (Vercel/Cloud)
CORTEX PRIME is built for serverless environments.

1.  **Auto-CI:** Commits to the `main` branch trigger an automatic build and deployment pipeline.
2.  **Environment Orchestration:**
    -   Configure `HUGGING_FACE_API_KEY` in your Cloud provider's dashboard.
    -   Set `HUGGING_FACE_MODEL` to `mistralai/Mistral-7B-Instruct-v0.2` for optimal structured inference.
3.  **Data Persistence Note:** In cloud environments, the local `data/history.json` storage is ephemeral per build. For continuous history in production, it is recommended to connect a persistent volume or a KV store.

---
*Operational Status: Ready for Deployment.*
