import { useState, useCallback, useRef } from 'react';
import { getConversations, getConversation, deleteConversation as apiDelete, getLogs } from '../services/api.js';
import { useStream } from './useStream.js';

export function useChat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [activeLog, setActiveLog] = useState(null);
  const { streamChat, cancel } = useStream();
  const streamingTextRef = useRef('');

  const loadConversations = useCallback(async () => {
    const { data } = await getConversations();
    setConversations(data);
  }, []);

  const loadConversation = useCallback(async (id) => {
    const { data } = await getConversation(id);
    setActiveId(id);
    setMessages(data.messages);
    
    // Fetch latest telemetry log for this conversation
    try {
      const logRes = await getLogs(1, id);
      if (logRes.data && logRes.data.length > 0) {
        setActiveLog(logRes.data[0]);
      } else {
        setActiveLog(null);
      }
    } catch {
      setActiveLog(null);
    }
  }, []);

  const newConversation = useCallback(() => { setActiveId(null); setMessages([]); setActiveLog(null); }, []);

  const deleteConv = useCallback(async (id) => {
    await apiDelete(id);
    setConversations(prev => prev.filter(c => c._id !== id));
    if (activeId === id) newConversation();
  }, [activeId, newConversation]);

  const sendMessage = useCallback(async (content) => {
    const userMsg = { role: 'user', content, _id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setStreaming(true);
    setStreamingText('');
    streamingTextRef.current = '';

    const currentActiveId = activeId;

    await streamChat({
      message: content,
      conversationId: currentActiveId,
      provider,
      onChunk: (chunk) => {
        streamingTextRef.current += chunk;
        setStreamingText(streamingTextRef.current);
      },
      onDone: (newConvId) => {
        const finalText = streamingTextRef.current;
        const finalId = newConvId || currentActiveId;
        if (newConvId && !currentActiveId) setActiveId(newConvId);
        setMessages(prev => [...prev, { role: 'assistant', content: finalText, _id: Date.now().toString() + '-a' }]);
        setStreaming(false);
        setStreamingText('');
        streamingTextRef.current = '';
        loadConversations();

        // Query database after 800ms to allow logWorker to commit to MongoDB
        setTimeout(async () => {
          try {
            const logRes = await getLogs(1, finalId);
            if (logRes.data && logRes.data.length > 0) {
              setActiveLog(logRes.data[0]);
            }
          } catch {}
        }, 800);
      },
      onError: (errMsg) => { 
        setStreaming(false); 
        setStreamingText(''); 
        streamingTextRef.current = ''; 
        setMessages(prev => [...prev, { role: 'assistant', content: `**Connection Error:** Unable to reach the server. Is the backend running?\n\n*Details: ${errMsg}*`, _id: Date.now().toString() + '-err' }]);
      },
    });
  }, [activeId, provider, streamChat, loadConversations]);

  return {
    conversations, messages, activeId, streaming, streamingText,
    provider, setProvider, activeLog,
    loadConversations, loadConversation, newConversation,
    deleteConv, sendMessage, cancel,
  };
}
