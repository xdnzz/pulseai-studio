import { describe, expect, it } from 'vitest';
import { WAVEFORM_BAR_COUNT, waveformBar } from '@/lib/waveform';

describe('waveformBar', () => {
  it('builds 40 seek points across the duration', () => {
    expect(WAVEFORM_BAR_COUNT).toBe(40);
    expect(waveformBar(0, 120, 24)).toMatchObject({ barSec: 0, isPast: true, heightPct: 25 });
    expect(waveformBar(8, 120, 24)).toMatchObject({ barSec: 24, isPast: true });
    expect(waveformBar(9, 120, 24).isPast).toBe(false);
  });
});
