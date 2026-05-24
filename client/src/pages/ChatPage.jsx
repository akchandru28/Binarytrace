import ChatWindow from '../components/ChatWindow.jsx';
import InputBar from '../components/InputBar.jsx';

export default function ChatPage({
  messages,
  streaming,
  streamingText,
  sendMessage,
  cancel
}) {
  return (
    <div className="flex h-full flex-col min-w-0" style={{ background: 'var(--surface)' }}>
      <ChatWindow
        messages={messages}
        streaming={streaming}
        streamingText={streamingText}
        onSendPrompt={sendMessage}
      />
      <InputBar onSend={sendMessage} onCancel={cancel} streaming={streaming} />
    </div>
  );
}
