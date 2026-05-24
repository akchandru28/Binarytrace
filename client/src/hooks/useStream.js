import { useRef, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function useStream() {
  const abortRef = useRef(null);

  const streamChat = useCallback(async ({ message, conversationId, provider = 'gemini', onChunk, onDone, onError }) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationId, provider, stream: true }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) onChunk?.(data.chunk);
            if (data.done) onDone?.(data.conversationId);
          } catch {}
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') onError?.(err.message);
    }
  }, []);

  const cancel = useCallback(() => { abortRef.current?.abort(); }, []);
  return { streamChat, cancel };
}
