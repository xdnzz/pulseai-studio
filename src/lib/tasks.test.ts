import { describe, expect, it } from 'vitest';
import { INITIAL_TASKS } from '@/data/meetingFixture';
import {
  advanceStatus,
  createActionItem,
  KANBAN_COLUMNS,
  markAllSynced,
  tasksForStatus,
  toggleSyncStatus,
  updateTaskStatus
} from '@/lib/tasks';

describe('tasks', () => {
  it('creates the next Linear key in the detected column', () => {
    const task = createActionItem({
      title: 'Ship the player',
      priority: 'High',
      assignee: 'Danilo Diniz',
      existingCount: INITIAL_TASKS.length,
      now: 1000
    });

    expect(task).toMatchObject({
      id: 'task-1000',
      status: 'detected',
      linearIssueKey: 'PUL-112',
      confidence: 95,
      crmDealTag: 'Product'
    });
  });

  it('advances a card one column and stops when it is synced', () => {
    expect(advanceStatus('detected')).toBe('in_progress');
    expect(advanceStatus('in_progress')).toBe('synced_linear');
    expect(advanceStatus('synced_linear')).toBeNull();
  });

  it('toggles the summary sync button between synced and in progress', () => {
    expect(toggleSyncStatus('detected')).toBe('synced_linear');
    expect(toggleSyncStatus('in_progress')).toBe('synced_linear');
    expect(toggleSyncStatus('synced_linear')).toBe('in_progress');
  });

  it('updates one task and can mark the whole board synced', () => {
    const moved = updateTaskStatus(INITIAL_TASKS, 'task-3', 'in_progress');
    expect(moved.find((task) => task.id === 'task-3')?.status).toBe('in_progress');
    expect(moved.find((task) => task.id === 'task-1')?.status).toBe('synced_linear');
    expect(markAllSynced(INITIAL_TASKS).every((task) => task.status === 'synced_linear')).toBe(true);
  });

  it('groups the board into the three columns', () => {
    expect(KANBAN_COLUMNS.map((column) => column.status)).toEqual([
      'detected',
      'in_progress',
      'synced_linear'
    ]);
    expect(tasksForStatus(INITIAL_TASKS, 'detected').map((task) => task.id)).toEqual(['task-3']);
    expect(tasksForStatus(INITIAL_TASKS, 'in_progress')).toHaveLength(2);
  });
});
