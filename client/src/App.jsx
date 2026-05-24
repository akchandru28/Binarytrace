import { useState, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, Plus, Trash2, Cpu } from 'lucide-react';
import ChatPage from './pages/ChatPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProviderBadge from './components/ProviderBadge.jsx';
import { useChat } from './hooks/useChat.js';

export default function App() {
  const [page, setPage] = useState('chat');
  const {
    conversations, messages, activeId, streaming, streamingText,
    provider, setProvider,
    loadConversations, loadConversation, newConversation,
    deleteConv, sendMessage, cancel,
  } = useChat();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    loadConversations();
  }, [loadConversations]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}>
      {/* ChatGPT-style Left Sidebar */}
      <aside
        className="w-64 flex flex-col h-full shrink-0 animate-fade-in"
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex flex-col gap-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-default shrink-0"
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent)',
              }}
              title="Binary trace"
            >
              <span className="text-accent text-xs font-mono font-black">B</span>
            </div>
            <span className="text-xs font-mono tracking-wider uppercase font-bold text-[var(--text-primary)] whitespace-nowrap">
              Binary trace
            </span>
          </div>

          {/* Model Selector & New Session Button */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 min-w-0">
              <ProviderBadge provider={provider} onChange={setProvider} />
            </div>
            <button
              onClick={() => {
                newConversation();
                setPage('chat');
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] hover:opacity-90 shrink-0"
              style={{
                background: 'var(--accent)',
                color: '#ffffff',
              }}
            >
              <Plus size={13} /> New
            </button>
          </div>
        </div>

        {/* Sessions list */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Cpu size={22} style={{ color: 'var(--text-secondary)', marginBottom: '6px' }} />
              <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>No active traces</p>
            </div>
          )}

          {conversations.map(c => {
            const isActive = page === 'chat' && activeId === c._id;
            const date = new Date(c.updatedAt || c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            return (
              <div
                key={c._id}
                onClick={() => {
                  loadConversation(c._id);
                  setPage('chat');
                }}
                className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-xs transition-all duration-150"
                style={{
                  background: isActive ? 'var(--surface-200)' : 'transparent',
                  border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface-200)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    size={13}
                    className="shrink-0"
                    style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="truncate font-medium">{c.title || 'Untitled session'}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="px-1 py-0.5 rounded text-[9px] font-mono uppercase"
                        style={{ background: 'var(--surface-300)', color: 'var(--text-secondary)' }}
                      >
                        {c.provider || 'gemini'}
                      </span>
                      <span className="text-[9px] font-mono text-[var(--text-secondary)]">{date}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteConv(c._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-[var(--text-secondary)] hover:text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Navigation */}
        <div className="p-3 border-t border-[var(--border)] flex flex-col gap-1.5 bg-[var(--sidebar-bg)]">
          <button
            onClick={() => setPage('chat')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: page === 'chat' ? 'var(--accent-glow)' : 'transparent',
              border: page === 'chat' ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid transparent',
              color: page === 'chat' ? 'var(--accent)' : 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              if (page !== 'chat') {
                e.currentTarget.style.background = 'var(--surface-200)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (page !== 'chat') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <MessageSquare size={14} />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setPage('dashboard')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: page === 'dashboard' ? 'var(--accent-glow)' : 'transparent',
              border: page === 'dashboard' ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid transparent',
              color: page === 'dashboard' ? 'var(--accent)' : 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              if (page !== 'dashboard') {
                e.currentTarget.style.background = 'var(--surface-200)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (page !== 'dashboard') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Page Content */}
      <div className="flex-1 min-w-0 h-screen overflow-hidden">
        {page === 'chat' ? (
          <ChatPage
            messages={messages}
            streaming={streaming}
            streamingText={streamingText}
            sendMessage={sendMessage}
            cancel={cancel}
          />
        ) : (
          <DashboardPage />
        )}
      </div>
    </div>
  );
}
