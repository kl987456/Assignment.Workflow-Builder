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

  // Check LLM (Environment Variable)
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    healthStatus.llm = 'configured';
  } else {
    healthStatus.llm = 'missing_key';
  }

  return NextResponse.json(healthStatus);
}
