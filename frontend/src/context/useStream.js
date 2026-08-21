import { useState, useRef, useCallback } from 'react';

const BASE_URL = '/api';

export function useStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const abortRef = useRef(null);

  const startStream = useCallback(async (path, body, { onChunk, onDone, onMeta, onError } = {}) => {
    setIsStreaming(true);
    setStreamText('');

    const token = localStorage.getItem('nexlearn_token');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6).trim();
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.meta) {
              onMeta && onMeta(data.meta);
              continue;
            }

            if (data.chunk) {
              accumulated += data.chunk;
              setStreamText(accumulated);
              onChunk && onChunk(accumulated);
            }

            if (data.done) {
              onDone && onDone(data.fullText || accumulated);
            }
          } catch (parseErr) {
            
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Stream error:', err.message);
      onError && onError(err.message);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const abortStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { streamText, isStreaming, startStream, abortStream, setStreamText };
}
