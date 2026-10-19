const DEFAULT_REPLY =
  'Based on the transcript, Danilo Diniz is leading the Virtualized Transcript UI, Cmd+K shortcuts, and the Agentic Dataflow Canvas (PUL-104, PUL-107).';

const BLOCKER_REPLY =
  'At 00:46, Marcus Vance flagged a Redis Pub/Sub spike when 500+ concurrent rooms stream audio chunks. Action item PUL-105 tracks connection pooling and webhook batching.';

const CRM_REPLY =
  'At 01:08, Sarah Lin requested automatic HubSpot & Salesforce deal-stage tagging with AI confidence badges (tracked under PUL-106).';

function mentions(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

export function replyForQuestion(question: string): string | null {
  if (!question.trim()) return null;

  const normalized = question.toLowerCase();
  if (mentions(normalized, ['blocker', 'redis', 'backend'])) return BLOCKER_REPLY;
  if (mentions(normalized, ['crm', 'hubspot', 'sarah'])) return CRM_REPLY;
  return DEFAULT_REPLY;
}
