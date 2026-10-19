'use client';

import { ActionItemsSummary } from '@/components/ActionItemsSummary';
import { CopilotPanel } from '@/components/CopilotPanel';
import { TranscriptList } from '@/components/TranscriptList';

export function MeetingWorkspace() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <TranscriptList />
      <div className="lg:col-span-5 space-y-6">
        <CopilotPanel />
        <ActionItemsSummary />
      </div>
    </div>
  );
}
