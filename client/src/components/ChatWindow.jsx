import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import { Terminal, Sparkles, HelpCircle, Activity } from 'lucide-react';

const suggestions = [
  { text: 'Benchmark Gemini vs OpenAI latency', icon: Activity },
  { text: 'Generate high-throughput dummy traces', icon: Terminal },
  { text: 'Simulate PII redaction pipeline', icon: Sparkles },
  { text: 'Inspect database log schema design', icon: HelpCircle },
];

export default function ChatWindow({ messages, streaming, streamingText, onSendPrompt }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamingText]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {messages.length === 0 && !streaming && (
        <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto gap-8">
          {/* Hero */}
          <div className="text-center space-y-3">
            <div
              className="inline-flex p-3 rounded-2xl mb-2"
              style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}
            >
              <Terminal size={30} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Send prompts to test the lightweight ingestion pipeline,
              latency trackers, and token analytics in near real-time.
            </p>
          </div>

          {/* Suggested prompts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onSendPrompt?.(s.text)}
                className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 group active:scale-[0.99]"
                style={{
                  background: 'var(--surface-100)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <s.icon size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span className="text-xs leading-relaxed">{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="max-w-3xl mx-auto space-y-1">
        {messages.map(m => (
          <MessageBubble key={m._id} role={m.role} content={m.content} />
        ))}
        {streaming && streamingText && (
          <MessageBubble role="assistant" content={streamingText} isStreaming />
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
