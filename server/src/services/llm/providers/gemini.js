import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generate(messages) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage);
  const response = await result.response;
  const text = response.text();
  return {
    content: text,
    model: 'gemini-2.5-flash',
    promptTokens: response.usageMetadata?.promptTokenCount || 0,
    completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
  };
}

export async function* generateStream(messages) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;
  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage);
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}
