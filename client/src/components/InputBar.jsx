import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, StopCircle } from 'lucide-react';
import { useVoice } from '../hooks/useVoice.js';

export default function InputBar({ onSend, onCancel, streaming }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const { listening, startListening, stopListening } = useVoice({
    onResult: (t) => setText(prev => prev + t),
  });

  // Auto-grow textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="px-6 pb-6 pt-2 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <div
          className="flex items-end gap-2 rounded-xl px-4 py-3 transition-all duration-200"
          style={{
            background: 'var(--surface-100)',
            border: '1px solid var(--border)',
          }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onBlurCapture={e  => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything or simulate telemetry..."
            className="flex-1 bg-transparent resize-none outline-none text-sm font-sans leading-relaxed"
            style={{
              color: 'var(--text-primary)',
              minHeight: '1.5rem',
              maxHeight: '8rem',
            }}
          />
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mic */}
            <button
              onClick={listening ? stopListening : startListening}
              title={listening ? 'Stop voice input' : 'Voice input'}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: listening ? '#f87171' : 'var(--text-secondary)' }}
            >
              {listening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {/* Cancel / Send */}
            {streaming ? (
              <button
                onClick={onCancel}
                title="Cancel"
                className="p-1.5 rounded-lg transition-all"
                style={{ color: '#f87171' }}
              >
                <StopCircle size={16} />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                title="Send"
                className="p-1.5 rounded-lg transition-all"
                style={
                  text.trim()
                    ? { background: 'var(--accent)', color: '#000' }
                    : { color: 'var(--text-secondary)' }
                }
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
