import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { chat, chatStream } from '../services/llm/wrapper.js';

export async function sendMessage(req, res) {
  const { message, conversationId, provider = 'gemini', stream = false } = req.body;
  try {
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    } else {
      conversation = await Conversation.create({ title: message.slice(0, 40), provider });
    }

    const history = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 }).limit(20).lean();
    const messages = [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    await Message.create({ conversationId: conversation._id, role: 'user', content: message });

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let fullResponse = '';
      const generator = chatStream({ messages, provider, conversationId: conversation._id });

      for await (const chunk of generator) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      await Message.create({ conversationId: conversation._id, role: 'assistant', content: fullResponse });
      res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
      res.end();
    } else {
      const result = await chat({ messages, provider, conversationId: conversation._id });
      await Message.create({ conversationId: conversation._id, role: 'assistant', content: result.content });
      res.json({ reply: result.content, conversationId: conversation._id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getConversations(req, res) {
  const conversations = await Conversation.find().sort({ updatedAt: -1 }).lean();
  res.json(conversations);
}

export async function getConversation(req, res) {
  const conversation = await Conversation.findById(req.params.id).lean();
  if (!conversation) return res.status(404).json({ error: 'Not found' });
  const messages = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 }).lean();
  res.json({ conversation, messages });
}

export async function deleteConversation(req, res) {
  await Conversation.findByIdAndDelete(req.params.id);
  await Message.deleteMany({ conversationId: req.params.id });
  res.json({ success: true });
}
