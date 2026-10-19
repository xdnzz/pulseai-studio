export type SpeakerRole = 'Product Lead' | 'Staff Engineer' | 'Design Engineer' | 'Founder / CEO';

export type SentimentType = 'positive' | 'neutral' | 'action-required' | 'blocker';

export interface TranscriptSegment {
  id: string;
  speaker: string;
  initials: string;
  role: SpeakerRole;
  avatarColor: string;
  timestampSec: number;
  timestampFormatted: string;
  text: string;
  sentiment: SentimentType;
  aiHighlight?: string;
  extractedTaskId?: string;
}

export type TaskStatus = 'detected' | 'in_progress' | 'synced_linear';
export type TaskPriority = 'Urgent' | 'High' | 'Medium';

export interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
  sourceTimestamp: string;
  linearIssueKey: string;
  crmDealTag: string;
  confidence: number;
}

export interface PipelineNode {
  id: string;
  title: string;
  category: 'Ingest' | 'ASR Model' | 'LLM Agent' | 'Webhook Sync';
  status: 'active' | 'streaming' | 'idle';
  latencyMs: number;
  throughput: string;
  description: string;
  payloadSample: Record<string, unknown>;
}

export type MeetingMode = 'demo' | 'live_mic' | 'uploaded_audio';

export interface CaptureState {
  mode: MeetingMode;
  isRecordingMic: boolean;
  uploadedFileName: string | null;
}

export type StudioTab = 'workspace' | 'kanban' | 'canvas' | 'payload';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}
