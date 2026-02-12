import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

import logger from '@/lib/logger';

export async function GET() {
    try {
        const historyFile = path.join(process.cwd(), 'data', 'history.json');
        if (!fs.existsSync(historyFile)) {
            return NextResponse.json([]);
        }

        const fileContent = fs.readFileSync(historyFile, 'utf-8');
        const history = JSON.parse(fileContent);
        return NextResponse.json(history);
    } catch (error) {
        logger.error("Failed to read history", { error: (error as Error).message });

        return NextResponse.json([], { status: 500 }); // Return empty array on error gracefully
    }
}
