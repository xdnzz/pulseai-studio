import { WAVEFORM_BAR_COUNT } from '@/lib/waveform';

export function sampleFrequencyBars(
  frequencies: Uint8Array,
  barCount = WAVEFORM_BAR_COUNT
): number[] {
  if (frequencies.length === 0 || barCount <= 0) return [];

  const bars: number[] = [];
  for (let index = 0; index < barCount; index += 1) {
    const start = Math.floor((index * frequencies.length) / barCount);
    const end = Math.max(start + 1, Math.floor(((index + 1) * frequencies.length) / barCount));
    let total = 0;
    for (let cursor = start; cursor < end; cursor += 1) {
      total += frequencies[cursor] ?? 0;
    }
    const average = total / (end - start);
    bars.push(Math.max(8, Math.round((average / 255) * 100)));
  }
  return bars;
}
