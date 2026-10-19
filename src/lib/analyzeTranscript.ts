import { containsActionVerb } from '@/lib/liveTranscript';

export interface ExtractedAction {
  title: string;
  assignee: string;
  priority: string;
}

export interface MeetingAnalysis {
  actionItems: ExtractedAction[];
  summary: string;
  blockers: string[];
}

export type AnalyzeFetcher = (input: string, init: RequestInit) => Promise<Response>;

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const RESPONSE_FORMAT = {
  type: 'json_schema',
  json_schema: {
    name: 'meeting_analysis',
    strict: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        actionItems: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              assignee: { type: 'string' },
              priority: { type: 'string' }
            },
            required: ['title', 'assignee', 'priority']
          }
        },
        summary: { type: 'string' },
        blockers: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['actionItems', 'summary', 'blockers']
    }
  }
};

export function fallbackAnalysis(transcriptText: string): MeetingAnalysis {
  const sentences = transcriptText
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  return {
    actionItems: sentences.filter(containsActionVerb).map((sentence) => ({
      title: sentence,
      assignee: 'Danilo Diniz',
      priority: 'High'
    })),
    summary: transcriptText.trim().slice(0, 280) || 'No transcript provided.',
    blockers: sentences.filter((sentence) => /\b(?:blocker|redis|spike|fail)\b/i.test(sentence))
  };
}

function isMeetingAnalysis(value: unknown): value is MeetingAnalysis {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if (typeof record.summary !== 'string' || !Array.isArray(record.blockers) || !Array.isArray(record.actionItems)) {
    return false;
  }
  if (!record.blockers.every((item) => typeof item === 'string')) return false;
  return record.actionItems.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const task = item as Record<string, unknown>;
    return typeof task.title === 'string' && typeof task.assignee === 'string' && typeof task.priority === 'string';
  });
}

function readModelContent(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0];
  if (!first || typeof first !== 'object') return null;
  const message = (first as { message?: unknown }).message;
  if (!message || typeof message !== 'object') return null;
  const content = (message as { content?: unknown }).content;
  return typeof content === 'string' ? content : null;
}

export async function analyzeTranscript(
  transcriptText: string,
  apiKey: string | undefined,
  fetcher: AnalyzeFetcher = (input, init) => fetch(input, init)
): Promise<MeetingAnalysis> {
  if (!apiKey) return fallbackAnalysis(transcriptText);

  try {
    const response = await fetcher(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: RESPONSE_FORMAT,
        messages: [
          {
            role: 'system',
            content:
              'Extract action items, a short summary, and blockers from a meeting transcript. Reply only with the requested JSON.'
          },
          { role: 'user', content: transcriptText }
        ]
      })
    });

    if (!response.ok) return fallbackAnalysis(transcriptText);
    const content = readModelContent(await response.json());
    if (!content) return fallbackAnalysis(transcriptText);
    const parsed: unknown = JSON.parse(content);
    return isMeetingAnalysis(parsed) ? parsed : fallbackAnalysis(transcriptText);
  } catch {
    return fallbackAnalysis(transcriptText);
  }
}
