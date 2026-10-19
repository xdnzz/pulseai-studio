'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { advanceStatus, KANBAN_COLUMNS, tasksForStatus } from '@/lib/tasks';
import { useMeetingStore } from '@/store/useMeetingStore';
import { useToastStore } from '@/store/useToastStore';

export function ActionBoard() {
  const actionItems = useMeetingStore((state) => state.actionItems);
  const addActionItem = useMeetingStore((state) => state.addActionItem);
  const moveTaskStatus = useMeetingStore((state) => state.moveTaskStatus);
  const showToast = useToastStore((state) => state.show);
  const [title, setTitle] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-canvas-900 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-sm font-semibold text-white">AI Action Studio & Linear Sync Board</h2>
          <p className="text-xs text-slate-400">Tasks automatically extracted from meeting audio with speaker attribution</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="New action item title..."
            className="bg-canvas-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
          />
          <button
            onClick={() => {
              const nextTitle = title.trim();
              if (!nextTitle) return;
              addActionItem(nextTitle, 'High', 'Danilo Diniz');
              setTitle('');
              showToast('Added new action item to board');
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = tasksForStatus(actionItems, column.status);
          return (
            <div key={column.status} className="bg-canvas-900 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{column.title}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-canvas-950 text-slate-400">{columnTasks.length}</span>
              </div>
              <div className="space-y-3">
                {columnTasks.map((task) => {
                  const nextStatus = advanceStatus(task.status);
                  return (
                    <div key={task.id} className="p-3.5 rounded-xl bg-canvas-950 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-indigo-400 font-semibold">{task.linearIssueKey}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{task.priority}</span>
                      </div>
                      <p className="text-xs font-medium text-white leading-snug">{task.title}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>{task.assignee}</span>
                        <div className="flex space-x-1">
                          {nextStatus && (
                            <button
                              onClick={() => moveTaskStatus(task.id, nextStatus)}
                              className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 font-mono text-[10px]"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
