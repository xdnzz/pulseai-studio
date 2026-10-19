import { describe, expect, it } from 'vitest';
import { sampleFrequencyBars } from '@/lib/frequencyBars';

describe('sampleFrequencyBars', () => {
  it('reduces analyser bins to 40 bar heights', () => {
    const frequencies = new Uint8Array(64).fill(0);
    frequencies[0] = 255;
    const bars = sampleFrequencyBars(frequencies);
    expect(bars).toHaveLength(40);
    expect(bars[0]).toBe(100);
    expect(bars[39]).toBe(8);
  });
});
