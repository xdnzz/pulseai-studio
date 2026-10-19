# PulseAI Studio — Real-Time AI Meeting Intelligence & Agentic Workflow Canvas

> Built by **[Danilo Diniz](https://github.com/xdnzz)** · Product-Minded Full Stack & Design Engineer

PulseAI Studio is a real-time AI meeting workspace and agentic workflow canvas inspired by modern engineering-first products like **Fathom**, **Hubs.is**, **Linear**, and **Resend**. It bridges real-time audio transcription, LLM-driven action item extraction, interactive node-based agent workflows, and one-click CRM/Linear synchronization.

---

## ✨ Key Engineering Highlights

1. **Synchronized Audio Waveform & Speaker Diarization (`60fps`)**
   - Interactive multi-bar acoustic waveform scrub player synced with speaker-diarized transcript blocks.
   - Click any transcript segment or chapter marker to seek audio and highlight active speaker context in real time.
2. **AI Action Item Extraction & Kanban Sync Studio**
   - Extract structured engineering tasks from natural conversation with confidence scores, priority tags, and assignee mapping.
   - Interactive Kanban board (`Backlog`, `In Progress`, `Synced to Linear/CRM`) with simulated webhook payload inspection.
3. **Visual Agentic Dataflow Canvas**
   - Interactive node canvas displaying live telemetry (`p95 latency`, token throughput, WebSocket status) across the AI pipeline:
     `WebRTC Audio Stream` → `Whisper Large-v3 ASR` → `GPT-4o Context Summarizer` → `Linear & HubSpot Webhooks`.
4. **Keyboard-First Command Palette (`⌘K` / `Ctrl+K`)**
   - Instant keyboard navigation to switch views, trigger AI summaries, export Markdown/JSON notes, filter speakers, or sync tasks to Linear.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript (Strict Mode)
- **State Management:** Zustand (centralized reactive store for playback, transcript stream, Kanban tasks, and telemetry)
- **Design System:** Tailwind CSS, Lucide Icons, custom dark-mode surface hierarchy (`#06080d` / `#0b0f19`), tabular monospace telemetry (`JetBrains Mono`)
- **AI & Cursor Native:** Includes `.cursorrules` pre-configured for seamless AI-assisted iteration in Cursor IDE.

---

## 🚀 Getting Started Locally (Cursor / VS Code)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Press `Cmd + K` (macOS) or `Ctrl + K` (Windows/Linux) at any time to open the Command Palette.

---

## 🌐 Deploying to Vercel

1. Push this repository to your GitHub account.
2. Import the project on [Vercel](https://vercel.com/new) — Next.js is detected automatically with zero configuration required.
