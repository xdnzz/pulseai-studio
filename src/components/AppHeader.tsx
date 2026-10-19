'use client';

import { CheckCircle2, Command, Kanban, Layers, Radio } from 'lucide-react';
import { useMeetingStore } from '@/store/useMeetingStore';
import { useToastStore } from '@/store/useToastStore';
import { StudioTab } from '@/types/meeting';

const TABS: {
  id: Extract<StudioTab, 'workspace' | 'kanban' | 'canvas'>;
  icon: typeof Radio;
  iconClass: string;
}[] = [
  { id: 'workspace', icon: Radio, iconClass: 'text-brass-400' },
  { id: 'kanban', icon: Kanban, iconClass: 'text-pulse-400' },
  { id: 'canvas', icon: Layers, iconClass: 'text-clay-400' }
];

function tabLabel(id: (typeof TABS)[number]['id'], taskCount: number) {
  if (id === 'workspace') return 'Meeting Workspace';
  if (id === 'kanban') return `Action Studio (${taskCount})`;
  return 'Agentic Canvas';
}

export function AppHeader() {
  const activeTab = useMeetingStore((state) => state.activeTab);
  const setActiveTab = useMeetingStore((state) => state.setActiveTab);
  const setCommandOpen = useMeetingStore((state) => state.setCommandOpen);
  const syncAllToLinear = useMeetingStore((state) => state.syncAllToLinear);
  const taskCount = useMeetingStore((state) => state.actionItems.length);
  const showToast = useToastStore((state) => state.show);

  return (
    <header className="sticky top-0 z-30 border-b border-ink-800/80 bg-canvas-900/90 backdrop-blur px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pulse-600 to-brass-500 flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-pulse-500/20">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white tracking-tight text-sm sm:text-base">PulseAI Studio</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-pulse-500/10 text-pulse-400 border border-pulse-500/20">
                v2.4 Realtime
              </span>
            </div>
            <p className="text-[11px] text-ink-400 hidden sm:block">
              Q4 Architecture & Product Sync · Whisper-v3 + GPT-4o Pipeline
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1 bg-canvas-950 p-1 rounded-xl border border-ink-800/80">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                  selected ? 'bg-ink-800 text-white shadow-sm' : 'text-ink-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.iconClass}`} />
                <span>{tabLabel(tab.id, taskCount)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-canvas-950 hover:bg-ink-800/80 border border-ink-800 text-xs text-ink-300 transition-colors"
        >
          <Command className="w-3.5 h-3.5 text-pulse-400" />
          <span className="hidden sm:inline">Command Menu</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-ink-800 text-ink-300 rounded">⌘K</kbd>
        </button>

        <button
          onClick={() => {
            syncAllToLinear();
            showToast('All action items synced to Linear & HubSpot CRM');
          }}
          className="px-3 py-1.5 rounded-lg bg-pulse-600 hover:bg-pulse-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-pulse-600/20 transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Sync to Linear</span>
        </button>
      </div>
    </header>
  );
}
