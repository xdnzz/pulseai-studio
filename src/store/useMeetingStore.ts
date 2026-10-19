import { create } from 'zustand';
import { cloneMeetingData } from '@/data/meetingFixture';
import { replyForQuestion } from '@/lib/copilot';
import { nextPlaybackSpeed, PlaybackSpeed } from '@/lib/playback';
import { buildLiveActionItem, buildLiveSegment, containsActionVerb } from '@/lib/liveTranscript';
import { createActionItem, markAllSynced, updateTaskStatus } from '@/lib/tasks';
import {
  ActionItem,
  CaptureState,
  ChatMessage,
  MeetingMode,
  PipelineNode,
  StudioTab,
  TranscriptSegment
} from '@/types/meeting';

interface MeetingState extends CaptureState {
  activeTab: StudioTab;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  playbackSpeed: PlaybackSpeed;
  searchQuery: string;
  selectedSpeaker: string;
  isCommandOpen: boolean;
  selectedNodeId: string;
  aiPromptInput: string;
  aiChatHistory: ChatMessage[];
  segments: TranscriptSegment[];
  actionItems: ActionItem[];
  nodes: PipelineNode[];
  setActiveTab: (tab: StudioTab) => void;
  togglePlay: () => void;
  setCurrentTime: (sec: number) => void;
  setDuration: (sec: number) => void;
  setPlaying: (playing: boolean) => void;
  setMode: (mode: MeetingMode) => void;
  setRecordingMic: (recording: boolean) => void;
  setUploadedFileName: (fileName: string | null) => void;
  appendLiveSegment: (text: string, speaker?: string) => boolean;
  resetToDemo: () => void;
  cycleSpeed: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedSpeaker: (speaker: string) => void;
  setCommandOpen: (open: boolean) => void;
  moveTaskStatus: (id: string, status: ActionItem['status']) => void;
  addActionItem: (title: string, priority: ActionItem['priority'], assignee: string) => void;
  syncAllToLinear: () => void;
  setSelectedNodeId: (id: string) => void;
  submitAiQuestion: (question: string) => void;
}

const initialUi = {
  activeTab: 'workspace' as const,
  isPlaying: false,
  currentTimeSec: 24,
  durationSec: 120,
  playbackSpeed: 1 as PlaybackSpeed,
  searchQuery: '',
  selectedSpeaker: 'ALL',
  isCommandOpen: false,
  selectedNodeId: 'node-llm',
  aiPromptInput: '',
  mode: 'demo' as const,
  isRecordingMic: false,
  uploadedFileName: null as string | null
};

export const useMeetingStore = create<MeetingState>((set) => ({
  ...initialUi,
  ...cloneMeetingData(),
  setActiveTab: (activeTab) => set({ activeTab }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (currentTimeSec) => set({ currentTimeSec }),
  setDuration: (durationSec) => set({ durationSec }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setMode: (mode) => set({ mode }),
  setRecordingMic: (isRecordingMic) => set({ isRecordingMic }),
  setUploadedFileName: (uploadedFileName) => set({ uploadedFileName }),
  appendLiveSegment: (text, speaker) => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const detected = containsActionVerb(trimmed);
    set((state) => {
      const now = Date.now();
      const task = detected
        ? buildLiveActionItem({
            text: trimmed,
            currentTimeSec: state.currentTimeSec,
            existingCount: state.actionItems.length,
            now
          })
        : null;
      const segment = buildLiveSegment({
        text: trimmed,
        speaker,
        currentTimeSec: state.currentTimeSec,
        now,
        extractedTaskId: task?.id
      });
      return {
        segments: [...state.segments, segment],
        actionItems: task ? [task, ...state.actionItems] : state.actionItems
      };
    });
    return detected;
  },
  resetToDemo: () =>
    set({
      ...cloneMeetingData(),
      mode: 'demo',
      isRecordingMic: false,
      uploadedFileName: null,
      isPlaying: false,
      currentTimeSec: initialUi.currentTimeSec,
      durationSec: initialUi.durationSec,
      playbackSpeed: 1
    }),
  cycleSpeed: () => set((state) => ({ playbackSpeed: nextPlaybackSpeed(state.playbackSpeed) })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedSpeaker: (selectedSpeaker) => set({ selectedSpeaker }),
  setCommandOpen: (isCommandOpen) => set({ isCommandOpen }),
  moveTaskStatus: (id, status) =>
    set((state) => ({ actionItems: updateTaskStatus(state.actionItems, id, status) })),
  addActionItem: (title, priority, assignee) =>
    set((state) => ({
      actionItems: [
        createActionItem({
          title,
          priority,
          assignee,
          existingCount: state.actionItems.length
        }),
        ...state.actionItems
      ]
    })),
  syncAllToLinear: () => set((state) => ({ actionItems: markAllSynced(state.actionItems) })),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  submitAiQuestion: (question) =>
    set((state) => {
      const reply = replyForQuestion(question);
      if (!reply) return state;
      return {
        aiChatHistory: [
          ...state.aiChatHistory,
          { role: 'user', text: question, time: 'Now' },
          { role: 'assistant', text: reply, time: 'Now' }
        ]
      };
    })
}));

export function resetMeetingStore() {
  useMeetingStore.setState({
    ...initialUi,
    ...cloneMeetingData()
  });
}
