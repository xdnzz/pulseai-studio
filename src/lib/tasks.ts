import { ActionItem, TaskPriority, TaskStatus } from '@/types/meeting';

export const KANBAN_COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'detected', title: 'AI Detected' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'synced_linear', title: 'Synced to Linear / CRM' }
];

const LINEAR_KEY_BASE = 108;

export function nextLinearIssueKey(existingCount: number): string {
  return `PUL-${LINEAR_KEY_BASE + existingCount}`;
}

export function createActionItem(input: {
  title: string;
  priority: TaskPriority;
  assignee: string;
  existingCount: number;
  now?: number;
}): ActionItem {
  return {
    id: `task-${input.now ?? Date.now()}`,
    title: input.title,
    assignee: input.assignee,
    priority: input.priority,
    status: 'detected',
    sourceTimestamp: '01:32',
    linearIssueKey: nextLinearIssueKey(input.existingCount),
    crmDealTag: 'Product',
    confidence: 95
  };
}

export function updateTaskStatus(tasks: ActionItem[], id: string, status: TaskStatus): ActionItem[] {
  return tasks.map((task) => (task.id === id ? { ...task, status } : task));
}

export function markAllSynced(tasks: ActionItem[]): ActionItem[] {
  return tasks.map((task) => ({ ...task, status: 'synced_linear' }));
}

export function advanceStatus(status: TaskStatus): TaskStatus | null {
  if (status === 'detected') return 'in_progress';
  if (status === 'in_progress') return 'synced_linear';
  return null;
}

export function toggleSyncStatus(status: TaskStatus): TaskStatus {
  return status === 'synced_linear' ? 'in_progress' : 'synced_linear';
}

export function tasksForStatus(tasks: ActionItem[], status: TaskStatus): ActionItem[] {
  return tasks.filter((task) => task.status === status);
}
