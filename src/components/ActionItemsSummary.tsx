'use client';

import { ArrowUpRight } from 'lucide-react';
import { toggleSyncStatus } from '@/lib/tasks';
import { useMeetingStore } from '@/store/useMeetingStore';
import { useToastStore } from '@/store/useToastStore';

export function ActionItemsSummary() {
  const actionItems = useMeetingStore((state) => state.actionItems);
  const moveTaskStatus = useMeetingStore((state) => state.moveTaskStatus);
  const setActiveTab = useMeetingStore((state) => state.setActiveTab);
  const showToast = useToastStore((state) => state.show);

  return (
    <div className="bg-canvas-900 border border-ink-800/80 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Extracted Action Items</h3>
        <button
          onClick={() => setActiveTab('kanban')}
          className="text-xs text-pulse-400 hover:text-pulse-300 flex items-center space-x-1"
        >
          <span>Open Board</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        {actionItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-canvas-950 border border-ink-800/80 flex items-center justify-between gap-2"
          >
            <div className="space-y-1">
              <div className="text-xs font-medium text-white">{item.title}</div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-ink-400">
                <span className="text-pulse-400">{item.linearIssueKey}</span>
                <span>·</span>
                <span>{item.assignee}</span>
                <span>·</span>
                <span className="text-brass-400">{item.confidence}% AI match</span>
              </div>
            </div>
            <button
              onClick={() => {
                moveTaskStatus(item.id, toggleSyncStatus(item.status));
                showToast(`Updated ${item.linearIssueKey} status`);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono border ${
                item.status === 'synced_linear'
                  ? 'bg-brass-500/10 text-brass-400 border-brass-500/20'
                  : 'bg-ink-800 text-ink-300 border-ink-700'
              }`}
            >
              {item.status === 'synced_linear' ? 'Synced' : 'Sync'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
