'use client';

import { useToastStore } from '@/store/useToastStore';

export function Toast() {
  const message = useToastStore((state) => state.message);
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-brass-600 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl">
      {message}
    </div>
  );
}
