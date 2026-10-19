'use client';

import { ActionBoard } from '@/components/ActionBoard';
import { AgentCanvas } from '@/components/AgentCanvas';
import { AppHeader } from '@/components/AppHeader';
import { CommandPalette } from '@/components/CommandPalette';
import { MeetingWorkspace } from '@/components/MeetingWorkspace';
import { Toast } from '@/components/Toast';
import { WaveformPlayer } from '@/components/WaveformPlayer';
import { useCommandPaletteShortcut } from '@/hooks/useCommandPaletteShortcut';
import { usePlaybackClock } from '@/hooks/usePlaybackClock';
import { useMeetingStore } from '@/store/useMeetingStore';

export function StudioApp() {
  const activeTab = useMeetingStore((state) => state.activeTab);
  usePlaybackClock();
  useCommandPaletteShortcut();

  return (
    <div className="min-h-screen flex flex-col bg-canvas-950 text-ink-200">
      <AppHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <WaveformPlayer />
        {activeTab === 'workspace' && <MeetingWorkspace />}
        {activeTab === 'kanban' && <ActionBoard />}
        {activeTab === 'canvas' && <AgentCanvas />}
      </main>
      <CommandPalette />
      <Toast />
    </div>
  );
}
