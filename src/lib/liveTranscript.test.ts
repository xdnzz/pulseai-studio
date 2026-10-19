import { describe, expect, it } from 'vitest';
import { buildLiveActionItem, buildLiveSegment, containsActionVerb, LIVE_SPEAKER } from '@/lib/liveTranscript';

describe('live transcript', () => {
  it('detects the action verbs used by live capture', () => {
    expect(containsActionVerb('We should ship the player')).toBe(true);
    expect(containsActionVerb('need to fix the pool')).toBe(true);
    expect(containsActionVerb('please test the upload')).toBe(true);
    expect(containsActionVerb('Hello team')).toBe(false);
    expect(containsActionVerb('the latest testing notes')).toBe(false);
  });

  it('stamps the segment with the current minute and the live speaker', () => {
    const segment = buildLiveSegment({
      text: '  We should deploy  ',
      currentTimeSec: 75.8,
      now: 50
    });
    expect(segment).toMatchObject({
      id: 'live-50',
      speaker: LIVE_SPEAKER,
      timestampSec: 75,
      timestampFormatted: '01:15',
      text: 'We should deploy',
      sentiment: 'action-required'
    });
  });

  it('keeps an explicit speaker and builds a detected task', () => {
    const segment = buildLiveSegment({
      text: 'hello',
      currentTimeSec: 8,
      speaker: 'Guest',
      now: 9
    });
    expect(segment.speaker).toBe('Guest');
    expect(segment.sentiment).toBe('neutral');

    expect(
      buildLiveActionItem({ text: 'ship the canvas', currentTimeSec: 8, existingCount: 4, now: 9 })
    ).toMatchObject({
      id: 'task-9',
      linearIssueKey: 'PUL-112',
      status: 'detected',
      sourceTimestamp: '00:08',
      crmDealTag: 'Live Session'
    });
  });
});
