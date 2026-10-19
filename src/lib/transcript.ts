import { TranscriptSegment } from '@/types/meeting';

export const ACTIVE_SEGMENT_WINDOW_SEC = 22;

export function filterSegments(
  segments: TranscriptSegment[],
  selectedSpeaker: string,
  searchQuery: string
): TranscriptSegment[] {
  const query = searchQuery.trim().toLowerCase();
  return segments.filter((segment) => {
    const matchesSpeaker = selectedSpeaker === 'ALL' || segment.speaker === selectedSpeaker;
    const matchesQuery =
      query.length === 0 ||
      segment.text.toLowerCase().includes(query) ||
      segment.speaker.toLowerCase().includes(query);
    return matchesSpeaker && matchesQuery;
  });
}

export function isSegmentActive(currentTimeSec: number, timestampSec: number): boolean {
  return (
    currentTimeSec >= timestampSec &&
    currentTimeSec < timestampSec + ACTIVE_SEGMENT_WINDOW_SEC
  );
}

export function speakerOptions(segments: TranscriptSegment[]): string[] {
  return [...new Set(segments.map((segment) => segment.speaker))];
}
