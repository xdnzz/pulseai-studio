import { describe, expect, it } from 'vitest';
import { isCommandPaletteShortcut, nextPlaybackSpeed, tickTime } from '@/lib/playback';

describe('playback', () => {
  it('cycles speed and wraps after 2x', () => {
    expect(nextPlaybackSpeed(1)).toBe(1.25);
    expect(nextPlaybackSpeed(1.25)).toBe(1.5);
    expect(nextPlaybackSpeed(1.5)).toBe(2);
    expect(nextPlaybackSpeed(2)).toBe(1);
  });

  it('advances one second and restarts at the end', () => {
    expect(tickTime(24, 120)).toBe(25);
    expect(tickTime(119, 120)).toBe(120);
    expect(tickTime(120, 120)).toBe(0);
  });

  it('recognizes Ctrl+K and Cmd+K only', () => {
    expect(isCommandPaletteShortcut({ key: 'k', ctrlKey: true, metaKey: false })).toBe(true);
    expect(isCommandPaletteShortcut({ key: 'K', ctrlKey: false, metaKey: true })).toBe(true);
    expect(isCommandPaletteShortcut({ key: 'k', ctrlKey: false, metaKey: false })).toBe(false);
    expect(isCommandPaletteShortcut({ key: 's', ctrlKey: true, metaKey: false })).toBe(false);
  });
});
