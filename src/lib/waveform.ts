export const WAVEFORM_BAR_COUNT = 40;

export function waveformBar(index: number, durationSec: number, currentTimeSec: number) {
  const barSec = Math.round((index / WAVEFORM_BAR_COUNT) * durationSec);
  return {
    barSec,
    isPast: barSec <= currentTimeSec,
    heightPct: 25 + ((index * 17) % 70)
  };
}
