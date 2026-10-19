import { NextResponse } from 'next/server';
import { analyzeTranscript, fallbackAnalysis } from '@/lib/analyzeTranscript';

async function readTranscript(request: Request): Promise<string> {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || !('transcriptText' in body)) return '';
    const transcriptText = (body as { transcriptText: unknown }).transcriptText;
    return typeof transcriptText === 'string' ? transcriptText : '';
  } catch {
    return '';
  }
}

export async function POST(request: Request) {
  try {
    const transcriptText = await readTranscript(request);
    const analysis = await analyzeTranscript(transcriptText, process.env.OPENAI_API_KEY);
    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json(fallbackAnalysis(''));
  }
}
