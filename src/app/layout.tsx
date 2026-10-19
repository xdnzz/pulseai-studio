import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PulseAI Studio — Real-Time AI Meeting & Agentic Workflow Canvas',
  description: 'Engineered by Danilo Diniz — Product-Minded Full Stack & Design Engineer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
