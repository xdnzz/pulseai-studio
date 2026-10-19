import { beforeEach, describe, expect, it } from 'vitest';
import { resetMeetingStore, useMeetingStore } from '@/store/useMeetingStore';

describe('useMeetingStore', () => {
  beforeEach(() => {
    resetMeetingStore();
  });

  it('appends the user question and the copilot reply', () => {
    useMeetingStore.getState().submitAiQuestion('redis blocker');
    const history = useMeetingStore.getState().aiChatHistory;
    expect(history.at(-2)).toMatchObject({ role: 'user', text: 'redis blocker' });
    expect(history.at(-1)?.text).toContain('PUL-105');
  });

  it('leaves history unchanged for a blank question', () => {
    const before = useMeetingStore.getState().aiChatHistory.length;
    useMeetingStore.getState().submitAiQuestion('  ');
    expect(useMeetingStore.getState().aiChatHistory).toHaveLength(before);
  });

  it('puts a new task first and syncs every card', () => {
    useMeetingStore.getState().addActionItem('Write the tests', 'High', 'Danilo Diniz');
    const [created] = useMeetingStore.getState().actionItems;
    expect(created.linearIssueKey).toBe('PUL-112');
    expect(created.status).toBe('detected');

    useMeetingStore.getState().syncAllToLinear();
    expect(useMeetingStore.getState().actionItems.every((task) => task.status === 'synced_linear')).toBe(true);
  });

  it('cycles playback speed from the current value', () => {
    useMeetingStore.getState().cycleSpeed();
    expect(useMeetingStore.getState().playbackSpeed).toBe(1.25);
  });

  it('appends a live segment and extracts a task when the phrase has an action verb', () => {
    const detected = useMeetingStore.getState().appendLiveSegment('We should ship the upload flow');
    expect(detected).toBe(true);
    expect(useMeetingStore.getState().segments.at(-1)).toMatchObject({
      speaker: 'Danilo Diniz (Live)',
      timestampFormatted: '00:24',
      text: 'We should ship the upload flow'
    });
    expect(useMeetingStore.getState().actionItems[0]).toMatchObject({
      title: 'We should ship the upload flow',
      status: 'detected',
      linearIssueKey: 'PUL-112'
    });
  });

  it('keeps the task list unchanged for a neutral live phrase', () => {
    const detected = useMeetingStore.getState().appendLiveSegment('Hello team');
    expect(detected).toBe(false);
    expect(useMeetingStore.getState().actionItems).toHaveLength(4);
    expect(useMeetingStore.getState().segments).toHaveLength(6);
  });

  it('restores the demo transcript, clock, and capture mode', () => {
    useMeetingStore.getState().appendLiveSegment('please test this');
    useMeetingStore.getState().setDuration(999);
    useMeetingStore.getState().setMode('uploaded_audio');
    useMeetingStore.getState().setUploadedFileName('call.mp3');
    useMeetingStore.getState().setRecordingMic(true);
    useMeetingStore.getState().resetToDemo();

    const state = useMeetingStore.getState();
    expect(state.mode).toBe('demo');
    expect(state.durationSec).toBe(120);
    expect(state.currentTimeSec).toBe(24);
    expect(state.segments).toHaveLength(5);
    expect(state.actionItems).toHaveLength(4);
    expect(state.uploadedFileName).toBeNull();
    expect(state.isRecordingMic).toBe(false);
  });
});
