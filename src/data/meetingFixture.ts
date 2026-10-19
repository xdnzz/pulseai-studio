import { ActionItem, ChatMessage, PipelineNode, TranscriptSegment } from '@/types/meeting';

export const INITIAL_CHAT: ChatMessage[] = [
  {
    role: 'assistant',
    text: 'Hi Danilo! I analyzed this 2-minute architecture sync. There is 1 infrastructure blocker (Redis Pub/Sub at 500+ rooms) and 4 action items ready for Linear.',
    time: 'Just now'
  }
];

export const INITIAL_SEGMENTS: TranscriptSegment[] = [
  {
    id: 'seg-1',
    speaker: 'Elena Rostova',
    initials: 'ER',
    role: 'Founder / CEO',
    avatarColor: 'bg-pulse-500/20 text-pulse-300 border-pulse-500/40',
    timestampSec: 8,
    timestampFormatted: '00:08',
    text: 'Welcome everyone. Our main goal for Q4 is shipping the real-time WebSocket transcription engine with sub-200ms latency and zero UI jank during live calls.',
    sentiment: 'positive',
    aiHighlight: 'Q4 Goal: Sub-200ms real-time WebSocket transcription engine'
  },
  {
    id: 'seg-2',
    speaker: 'Danilo Diniz',
    initials: 'DD',
    role: 'Design Engineer',
    avatarColor: 'bg-brass-500/20 text-brass-300 border-brass-500/40',
    timestampSec: 24,
    timestampFormatted: '00:24',
    text: 'I already prototyped the virtualized transcript stream and 60fps acoustic waveform in React and Tailwind. We can also bind Cmd+K shortcuts so users push tasks straight to Linear without leaving the call.',
    sentiment: 'action-required',
    aiHighlight: 'Shipped prototype: Virtualized stream + Cmd+K Linear sync',
    extractedTaskId: 'task-1'
  },
  {
    id: 'seg-3',
    speaker: 'Marcus Vance',
    initials: 'MV',
    role: 'Staff Engineer',
    avatarColor: 'bg-sage-500/20 text-sage-300 border-sage-500/40',
    timestampSec: 46,
    timestampFormatted: '00:46',
    text: 'On the backend, we noticed Redis pub/sub spikes when 500+ concurrent meeting rooms stream audio chunks simultaneously. We need to implement connection pooling and batch CRM webhooks.',
    sentiment: 'blocker',
    aiHighlight: 'Blocker: Redis pub/sub spikes at 500+ concurrent rooms',
    extractedTaskId: 'task-2'
  },
  {
    id: 'seg-4',
    speaker: 'Sarah Lin',
    initials: 'SL',
    role: 'Product Lead',
    avatarColor: 'bg-clay-500/20 text-clay-300 border-clay-500/40',
    timestampSec: 68,
    timestampFormatted: '01:08',
    text: 'Enterprise customers on HubSpot and Salesforce asked for automatic deal-stage tagging right after a call finishes. Let us add an AI confidence badge on every extracted action item.',
    sentiment: 'action-required',
    aiHighlight: 'Feature Request: Auto HubSpot deal-stage tagging + AI confidence score',
    extractedTaskId: 'task-3'
  },
  {
    id: 'seg-5',
    speaker: 'Danilo Diniz',
    initials: 'DD',
    role: 'Design Engineer',
    avatarColor: 'bg-brass-500/20 text-brass-300 border-brass-500/40',
    timestampSec: 92,
    timestampFormatted: '01:32',
    text: 'Makes total sense. I will build the interactive Agentic Canvas view today so engineering and product teams can inspect every webhook payload and latency metric live.',
    sentiment: 'positive',
    aiHighlight: 'Commitment: Deliver interactive Agentic Canvas & payload inspector',
    extractedTaskId: 'task-4'
  }
];

export const INITIAL_TASKS: ActionItem[] = [
  {
    id: 'task-1',
    title: 'Ship virtualized transcript list & Cmd+K Linear keyboard shortcuts',
    assignee: 'Danilo Diniz',
    priority: 'Urgent',
    status: 'synced_linear',
    sourceTimestamp: '00:24',
    linearIssueKey: 'PUL-104',
    crmDealTag: 'Enterprise Tier',
    confidence: 99
  },
  {
    id: 'task-2',
    title: 'Optimize Redis Pub/Sub connection pooling for 500+ concurrent streams',
    assignee: 'Marcus Vance',
    priority: 'Urgent',
    status: 'in_progress',
    sourceTimestamp: '00:46',
    linearIssueKey: 'PUL-105',
    crmDealTag: 'Infra Scale',
    confidence: 96
  },
  {
    id: 'task-3',
    title: 'Add AI confidence score badges & automatic HubSpot CRM deal sync',
    assignee: 'Sarah Lin',
    priority: 'High',
    status: 'detected',
    sourceTimestamp: '01:08',
    linearIssueKey: 'PUL-106',
    crmDealTag: 'HubSpot Sync',
    confidence: 94
  },
  {
    id: 'task-4',
    title: 'Design & implement Agentic Dataflow Canvas with live JSON payload diff',
    assignee: 'Danilo Diniz',
    priority: 'High',
    status: 'in_progress',
    sourceTimestamp: '01:32',
    linearIssueKey: 'PUL-107',
    crmDealTag: 'Design System',
    confidence: 98
  }
];

export const INITIAL_NODES: PipelineNode[] = [
  {
    id: 'node-ingest',
    title: 'WebRTC Audio Stream',
    category: 'Ingest',
    status: 'streaming',
    latencyMs: 18,
    throughput: '48 kHz · Opus PCM',
    description:
      'Captures low-latency browser & desktop audio channels with noise suppression and VAD (Voice Activity Detection).',
    payloadSample: {
      protocol: 'WebRTC / UDP',
      sampleRate: 48000,
      channels: 2,
      vadActive: true,
      jitterBufferMs: 12
    }
  },
  {
    id: 'node-asr',
    title: 'Whisper Large-v3 Turbo ASR',
    category: 'ASR Model',
    status: 'streaming',
    latencyMs: 112,
    throughput: '142 words/sec',
    description: 'Performs real-time speaker diarization and streaming word-level timestamp alignment.',
    payloadSample: {
      model: 'whisper-large-v3-turbo',
      diarization: true,
      language: 'en-US',
      wordConfidenceP95: 0.984
    }
  },
  {
    id: 'node-llm',
    title: 'OpenAI GPT-4o Context Agent',
    category: 'LLM Agent',
    status: 'active',
    latencyMs: 164,
    throughput: '380 tokens/sec',
    description:
      'Extracts structured action items, blockers, sentiment telemetry, and executive summaries using JSON Schema.',
    payloadSample: {
      model: 'gpt-4o-2026-08',
      responseFormat: 'json_schema',
      extractedTasksCount: 4,
      detectedBlockers: 1
    }
  },
  {
    id: 'node-webhook',
    title: 'Linear & HubSpot Dispatcher',
    category: 'Webhook Sync',
    status: 'active',
    latencyMs: 42,
    throughput: '99.99% delivery',
    description:
      'Dispatches idempotent GraphQL mutations to Linear and REST webhooks to HubSpot CRM with retry backoff.',
    payloadSample: {
      destination: ['api.linear.app/graphql', 'api.hubapi.com/crm/v3'],
      idempotencyKey: 'evt_pulse_99281a',
      status: '200 OK',
      syncedIssues: ['PUL-104', 'PUL-105', 'PUL-106', 'PUL-107']
    }
  }
];

export function cloneMeetingData() {
  return {
    segments: structuredClone(INITIAL_SEGMENTS),
    actionItems: structuredClone(INITIAL_TASKS),
    nodes: structuredClone(INITIAL_NODES),
    aiChatHistory: structuredClone(INITIAL_CHAT)
  };
}
