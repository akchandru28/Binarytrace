import React from 'react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() { if (this.state.hasError) return <div className="text-red-500">{this.state.error.message}</div>; return this.props.children; }
}

export default function MessageBubble({ role, content, isStreaming }) {
  const isUser = role === 'user';

  return (
    <div className={clsx(
      'flex gap-3 py-3 w-full max-w-3xl mx-auto animate-message',
      isUser ? 'justify-end' : 'justify-start items-start'
    )}>
      {/* AI avatar */}
      {!isUser && (
        <div className={clsx(
          "w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300",
          isStreaming ? "border border-[var(--accent)] animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.35)]" : "border border-[var(--border)]"
        )}>
          <span className={clsx("text-[11px] font-mono font-bold transition-colors", isStreaming ? "text-[var(--accent)]" : "text-[var(--text-secondary)]")}>B</span>
        </div>
      )}

      {/* Message content */}
      <div className={clsx(
        isUser
          ? 'max-w-[78%] px-4 py-2.5 rounded-2xl bg-accent text-white font-medium text-sm leading-relaxed shadow-sm'
          : clsx('flex-1 min-w-0', isStreaming && 'cursor-blink')
      )}>
        {isUser ? (
          <span>{content}</span>
        ) : (
          <ErrorBoundary>
            <div className="prose-chat">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              ) : (
                isStreaming && (
                  <div className="flex flex-col gap-2 py-2">
                    <div className="h-3 w-4/5 rounded bg-surface-200 animate-pulse border border-surface-300/40 shadow-sm" />
                    <div className="h-3 w-2/3 rounded bg-surface-200 animate-pulse border border-surface-300/40 shadow-sm" />
                  </div>
                )
              )}
            </div>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
