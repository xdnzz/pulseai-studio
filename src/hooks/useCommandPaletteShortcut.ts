'use client';

import { useEffect } from 'react';
import { isCommandPaletteShortcut } from '@/lib/playback';
import { useMeetingStore } from '@/store/useMeetingStore';

export function useCommandPaletteShortcut() {
  const isCommandOpen = useMeetingStore((state) => state.isCommandOpen);
  const setCommandOpen = useMeetingStore((state) => state.setCommandOpen);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isCommandPaletteShortcut(event)) return;
      event.preventDefault();
      setCommandOpen(!isCommandOpen);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCommandOpen, setCommandOpen]);
}
