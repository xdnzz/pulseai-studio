'use client';

import { Search, Sparkles } from 'lucide-react';
import { filterSegments, isSegmentActive, speakerOptions } from '@/lib/transcript';
import { useMeetingStore } from '@/store/useMeetingStore';

export function TranscriptList() {
  const segments = useMeetingStore((state) => state.segments);
  const searchQuery = useMeetingStore((state) => state.searchQuery);
  const setSearchQuery = useMeetingStore((state) => state.setSearchQuery);
  const selectedSpeaker = useMeetingStore((state) => state.selectedSpeaker);
  const setSelectedSpeaker = useMeetingStore((state) => state.setSelectedSpeaker);
  const currentTimeSec = useMeetingStore((state) => state.currentTimeSec);
  const setCurrentTime = useMeetingStore((state) => state.setCurrentTime);

  const visibleSegments = filterSegments(segments, selectedSpeaker, searchQuery);
  const speakers = speakerOptions(segments);

  return (
    <div className="lg:col-span-7 bg-canvas-900 border border-slate-800/80 rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-semibold text-white">Speaker-Diarized Transcript</h2>
          <span className="text-xs font-mono text-slate-400">({visibleSegments.length} segments)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Filter transcript..."
              className="bg-canvas-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedSpeaker}
            onChange={(event) => setSelectedSpeaker(event.target.value)}
            className="bg-canvas-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300"
            aria-label="Filter by speaker"
          >
            <option value="ALL">All Speakers</option>
            {speakers.map((speaker) => (
              <option key={speaker} value={speaker}>
                {speaker}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {visibleSegments.map((segment) => {
          const isActive = isSegmentActive(currentTimeSec, segment.timestampSec);
          return (
            <div
              key={segment.id}
              onClick={() => setCurrentTime(segment.timestampSec)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                isActive
                  ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md'
                  : 'bg-canvas-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center ${segment.avatarColor}`}
                  >
                    {segment.initials}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-white">{segment.speaker}</span>
                    <span className="text-[11px] text-slate-400 ml-2">{segment.role}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-indigo-400">{segment.timestampFormatted}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{segment.text}</p>
              {segment.aiHighlight && (
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>{segment.aiHighlight}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
