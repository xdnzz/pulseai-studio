'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useAudioCapture } from '@/hooks/useAudioCapture';
import { formatSec } from '@/lib/time';
import { WAVEFORM_BAR_COUNT, waveformBar } from '@/lib/waveform';
import { useMeetingStore } from '@/store/useMeetingStore';
import { useToastStore } from '@/store/useToastStore';

export function WaveformPlayer() {
  const isPlaying = useMeetingStore((state) => state.isPlaying);
  const togglePlay = useMeetingStore((state) => state.togglePlay);
  const currentTimeSec = useMeetingStore((state) => state.currentTimeSec);
  const setCurrentTime = useMeetingStore((state) => state.setCurrentTime);
  const durationSec = useMeetingStore((state) => state.durationSec);
  const playbackSpeed = useMeetingStore((state) => state.playbackSpeed);
  const cycleSpeed = useMeetingStore((state) => state.cycleSpeed);
  const mode = useMeetingStore((state) => state.mode);
  const isRecordingMic = useMeetingStore((state) => state.isRecordingMic);
  const uploadedFileName = useMeetingStore((state) => state.uploadedFileName);
  const appendLiveSegment = useMeetingStore((state) => state.appendLiveSegment);
  const showToast = useToastStore((state) => state.show);
  const capture = useAudioCapture();
  const [phrase, setPhrase] = useState('');

  const showLiveLevels = capture.bars !== null && (isRecordingMic || (mode === 'uploaded_audio' && isPlaying));
  const status =
    mode === 'live_mic'
      ? isRecordingMic
        ? 'Microphone live'
        : 'Microphone idle'
      : mode === 'uploaded_audio'
        ? uploadedFileName ?? 'Uploaded audio'
        : 'WebSocket Stream Active (164ms)';

  const onTogglePlay = () => {
    if (mode === 'uploaded_audio') {
      void capture.toggleUploadedPlayback();
      return;
    }
    togglePlay();
  };

  const seekTo = (seconds: number) => {
    if (mode === 'live_mic') return;
    if (mode === 'uploaded_audio' && capture.audioRef.current) {
      capture.audioRef.current.currentTime = seconds;
    }
    setCurrentTime(seconds);
  };

  return (
    <section className="bg-canvas-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div>
            <div className="text-xs font-mono text-white font-semibold tabular-nums">
              {formatSec(currentTimeSec)} <span className="text-slate-500">/ {formatSec(durationSec)}</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{status}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center space-x-1 h-10 px-2">
          {Array.from({ length: WAVEFORM_BAR_COUNT }).map((_, index) => {
            const synthetic = waveformBar(index, durationSec, currentTimeSec);
            const liveHeight = showLiveLevels ? capture.bars?.[index] : undefined;
            const height = liveHeight ?? synthetic.heightPct;
            const active = liveHeight !== undefined ? liveHeight > 18 : synthetic.isPast;
            return (
              <button
                key={index}
                onClick={() => seekTo(synthetic.barSec)}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-full transition-all ${
                  active ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Seek to ${formatSec(synthetic.barSec)}`}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={cycleSpeed}
            className="px-2.5 py-1 rounded-lg bg-canvas-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
          >
            {playbackSpeed}x
          </button>
          <button
            onClick={() => void capture.startRecording()}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
              isRecordingMic
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-canvas-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isRecordingMic ? '🎙️ Stop Live Mic' : '🎙️ Record Live Mic'}
          </button>
          <label className="px-2.5 py-1 rounded-lg bg-canvas-950 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white cursor-pointer">
            📁 Upload Audio
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) void capture.loadFile(file);
              }}
            />
          </label>
          {mode !== 'demo' && (
            <button
              onClick={capture.resetDemo}
              className="px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-[11px] font-medium text-emerald-300"
            >
              Reset Demo
            </button>
          )}
        </div>
      </div>

      {isRecordingMic && !capture.speechSupported && (
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const detected = appendLiveSegment(phrase);
            setPhrase('');
            if (detected) showToast('Action item detected from live speech');
          }}
        >
          <input
            type="text"
            value={phrase}
            onChange={(event) => setPhrase(event.target.value)}
            placeholder="Type a phrase to simulate live speech..."
            className="flex-1 bg-canvas-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            Add phrase
          </button>
        </form>
      )}

      <audio ref={capture.audioRef} className="hidden" preload="metadata" playsInline />
    </section>
  );
}
