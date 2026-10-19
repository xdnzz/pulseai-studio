'use client';

import { useMeetingStore } from '@/store/useMeetingStore';
import { useToastStore } from '@/store/useToastStore';
import { StudioTab } from '@/types/meeting';

const DESTINATIONS: { tab: Extract<StudioTab, 'workspace' | 'kanban' | 'canvas'>; label: string; hint: string }[] = [
  { tab: 'workspace', label: 'Go to Meeting Transcript Workspace', hint: 'G W' },
  { tab: 'kanban', label: 'Open Action Studio Kanban Board', hint: 'G K' },
  { tab: 'canvas', label: 'Inspect Agentic Dataflow Canvas', hint: 'G C' }
];

export function CommandPalette() {
  const isCommandOpen = useMeetingStore((state) => state.isCommandOpen);
  const setCommandOpen = useMeetingStore((state) => state.setCommandOpen);
  const setActiveTab = useMeetingStore((state) => state.setActiveTab);
  const syncAllToLinear = useMeetingStore((state) => state.syncAllToLinear);
  const showToast = useToastStore((state) => state.show);

  if (!isCommandOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="bg-canvas-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">PulseAI Command Palette</span>
          <button onClick={() => setCommandOpen(false)} className="text-xs text-slate-400 hover:text-white">
            ESC
          </button>
        </div>
        <div className="p-2 space-y-1">
          {DESTINATIONS.map((destination) => (
            <button
              key={destination.tab}
              onClick={() => {
                setActiveTab(destination.tab);
                setCommandOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-white flex justify-between"
            >
              <span>{destination.label}</span>
              <kbd className="font-mono text-slate-400">{destination.hint}</kbd>
            </button>
          ))}
          <button
            onClick={() => {
              syncAllToLinear();
              setCommandOpen(false);
              showToast('Synced all issues to Linear');
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-emerald-400 flex justify-between"
          >
            <span>Sync All Extracted Tasks to Linear & HubSpot</span>
            <kbd className="font-mono text-slate-400">⌘ S</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
