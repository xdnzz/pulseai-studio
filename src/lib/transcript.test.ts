import { describe, expect, it } from 'vitest';
import { INITIAL_SEGMENTS } from '@/data/meetingFixture';
import { filterSegments, isSegmentActive, speakerOptions } from '@/lib/transcript';

describe('transcript', () => {
  it('returns every segment when the query is blank and the speaker is ALL', () => {
    expect(filterSegments(INITIAL_SEGMENTS, 'ALL', '   ')).toHaveLength(INITIAL_SEGMENTS.length);
  });

  it('filters by speaker and by text, ignoring case', () => {
    expect(filterSegments(INITIAL_SEGMENTS, 'Danilo Diniz', '').map((segment) => segment.id)).toEqual([
      'seg-2',
      'seg-5'
    ]);
    expect(filterSegments(INITIAL_SEGMENTS, 'ALL', 'REDIS').map((segment) => segment.id)).toEqual(['seg-3']);
  });

  it('matches a search against the speaker name', () => {
    expect(filterSegments(INITIAL_SEGMENTS, 'ALL', 'elena').map((segment) => segment.id)).toEqual(['seg-1']);
  });

  it('marks a segment active for 22 seconds after it starts', () => {
    expect(isSegmentActive(24, 8)).toBe(true);
    expect(isSegmentActive(29, 8)).toBe(true);
    expect(isSegmentActive(30, 8)).toBe(false);
    expect(isSegmentActive(7, 8)).toBe(false);
  });

  it('lists speakers in first-seen order, without duplicates', () => {
    expect(speakerOptions(INITIAL_SEGMENTS)).toEqual([
      'Elena Rostova',
      'Danilo Diniz',
      'Marcus Vance',
      'Sarah Lin'
    ]);
  });
});
