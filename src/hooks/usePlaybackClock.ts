'use client';

import { useEffect } from 'react';
import { tickTime } from '@/lib/playback';
import { useMeetingStore } from '@/store/useMeetingStore';

export function usePlaybackClock() {
  const isPlaying = useMeetingStore((state) => state.isPlaying);
  const currentTimeSec = useMeetingStore((state) => state.currentTimeSec);
  const durationSec = useMeetingStore((state) => state.durationSec);
  const playbackSpeed = useMeetingStore((state) => state.playbackSpeed);
  const setCurrentTime = useMeetingStore((state) => state.setCurrentTime);
  const mode = useMeetingStore((state) => state.mode);

  useEffect(() => {
    if (!isPlaying || mode !== 'demo') return;
    const interval = setInterval(() => {
      setCurrentTime(tickTime(currentTimeSec, durationSec));
    }, Math.round(1000 / playbackSpeed));
    return () => clearInterval(interval);
  }, [isPlaying, currentTimeSec, durationSec, playbackSpeed, setCurrentTime, mode]);
}
