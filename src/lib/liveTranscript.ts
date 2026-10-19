import { formatSec } from '@/lib/time';
import { nextLinearIssueKey } from '@/lib/tasks';
import { ActionItem, TranscriptSegment } from '@/types/meeting';

export const LIVE_SPEAKER = 'Danilo Diniz (Live)';

const ACTION_VERBS = /\b(?:ship|build|fix|should|create|deploy|test|need to)\b/i;

export function containsActionVerb(text: string): boolean {
  return ACTION_VERBS.test(text);
}

export function buildLiveSegment(input: {
  text: string;
  currentTimeSec: number;
  speaker?: string;
  now?: number;
  extractedTaskId?: string;
}): TranscriptSegment {
  const timestampSec = Math.max(0, Math.floor(input.currentTimeSec));
  const actionable = containsActionVerb(input.text);
  return {
    id: `live-${input.now ?? Date.now()}`,
    speaker: input.speaker?.trim() || LIVE_SPEAKER,
    initials: 'DD',
    role: 'Design Engineer',
    avatarColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    timestampSec,
    timestampFormatted: formatSec(timestampSec),
    text: input.text.trim(),
    sentiment: actionable ? 'action-required' : 'neutral',
    aiHighlight: actionable ? 'Live action item detected' : undefined,
    extractedTaskId: input.extractedTaskId
  };
}

export function buildLiveActionItem(input: {
  text: string;
  currentTimeSec: number;
  existingCount: number;
  now?: number;
}): ActionItem {
  const timestampSec = Math.max(0, Math.floor(input.currentTimeSec));
  return {
    id: `task-${input.now ?? Date.now()}`,
    title: input.text.trim(),
    assignee: 'Danilo Diniz',
    priority: 'High',
    status: 'detected',
    sourceTimestamp: formatSec(timestampSec),
    linearIssueKey: nextLinearIssueKey(input.existingCount),
    crmDealTag: 'Live Session',
    confidence: 92
  };
}
