import { describe, expect, it } from 'vitest';
import { formatSec } from '@/lib/time';

describe('formatSec', () => {
  it('formats minutes and seconds with two digits', () => {
    expect(formatSec(0)).toBe('00:00');
    expect(formatSec(8)).toBe('00:08');
    expect(formatSec(68)).toBe('01:08');
    expect(formatSec(125)).toBe('02:05');
  });
});
