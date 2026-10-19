'use client';

import { Cpu, Terminal } from 'lucide-react';
import { useMeetingStore } from '@/store/useMeetingStore';

export function AgentCanvas() {
  const nodes = useMeetingStore((state) => state.nodes);
  const selectedNodeId = useMeetingStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useMeetingStore((state) => state.setSelectedNodeId);
  const activeNode = nodes.find((node) => node.id === selectedNodeId) || nodes[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-canvas-900 border border-ink-800/80 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Interactive Agentic Dataflow Canvas (Click a Node to Inspect)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                selectedNodeId === node.id
                  ? 'bg-pulse-950/30 border-pulse-500 shadow-lg'
                  : 'bg-canvas-950 border-ink-800 hover:border-ink-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-pulse-400 uppercase">{node.category}</span>
                <span className="text-brass-400">⚡ {node.latencyMs}ms</span>
              </div>
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-pulse-400" />
                <span>{node.title}</span>
              </h3>
              <p className="text-xs text-ink-400 leading-relaxed">{node.description}</p>
              <div className="text-[11px] font-mono text-ink-300 pt-1">{node.throughput}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 bg-canvas-900 border border-ink-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-ink-800 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-brass-400" />
            <h3 className="text-sm font-semibold text-white">Node Telemetry Payload</h3>
          </div>
          <span className="text-xs font-mono text-pulse-400">{activeNode.id}</span>
        </div>
        <pre className="p-4 rounded-xl bg-canvas-950 border border-ink-800 font-mono text-xs text-brass-300 overflow-x-auto leading-relaxed">
          {JSON.stringify(activeNode.payloadSample, null, 2)}
        </pre>
      </div>
    </div>
  );
}
