import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const healthStatus = {
    backend: 'healthy',
    database: 'unknown',
    llm: 'unknown',
    timestamp: new Date().toISOString(),
  };

  // Check Database (File System)
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      // It's okay if it doesn't exist yet, we can create it or just report it's not there
      healthStatus.database = 'init_required';
    } else {
      // Try to read/write access
      healthStatus.database = 'connected';
    }
  } catch (error) {
    console.error("Database check failed", error);
    healthStatus.database = 'error';
  }

  // Check LLM Configuration (Environment Variable)
  const hfKey = process.env.HUGGING_FACE_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (hfKey) {
    healthStatus.llm = 'configured_hugging_face';
  } else if (geminiKey) {
    healthStatus.llm = 'configured_gemini';
  } else {
    healthStatus.llm = 'missing_key_mock_mode';
  }

  return NextResponse.json(healthStatus);
}
