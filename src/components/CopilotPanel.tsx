'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useMeetingStore } from '@/store/useMeetingStore';

export function CopilotPanel() {
  const aiChatHistory = useMeetingStore((state) => state.aiChatHistory);
  const submitAiQuestion = useMeetingStore((state) => state.submitAiQuestion);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    submitAiQuestion(draft);
    setDraft('');
  };

  return (
    <div className="bg-canvas-900 border border-ink-800/80 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-ink-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-pulse-400" />
          <h3 className="text-sm font-semibold text-white">Ask PulseAI Context Copilot</h3>
        </div>
        <span className="text-[11px] font-mono text-brass-400">GPT-4o Realtime</span>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {aiChatHistory.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl text-xs leading-relaxed ${
              message.role === 'user'
                ? 'bg-pulse-600/20 border border-pulse-500/30 text-pulse-200 ml-6'
                : 'bg-canvas-950 border border-ink-800 text-ink-300 mr-4'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') send();
          }}
          placeholder="Ask about blockers, owners, or CRM..."
          className="flex-1 bg-canvas-950 border border-ink-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pulse-500"
        />
        <button onClick={send} className="p-2 rounded-xl bg-pulse-600 hover:bg-pulse-500 text-white" aria-label="Send question">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
