import emitter from '../../events/emitter.js';
import * as gemini from './providers/gemini.js';
import * as openai from './providers/openai.js';

const PROVIDERS = { gemini, openai };

export async function chat({ messages, provider = 'gemini', conversationId }) {
  const p = PROVIDERS[provider];
  if (!p) throw new Error(`Unknown provider: ${provider}`);
  const start = Date.now();
  let result, status = 'success', error;
  try {
    result = await p.generate(messages);
  } catch (err) {
    status = 'error'; error = err.message; throw err;
  } finally {
    emitter.emit('log.created', {
      conversationId, provider, model: result?.model || provider,
      latency: Date.now() - start,
      promptTokens: result?.promptTokens || 0,
      completionTokens: result?.completionTokens || 0,
      status, error,
      inputPreview: messages.at(-1)?.content?.slice(0, 100),
      outputPreview: result?.content?.slice(0, 100),
    });
  }
  return result;
}

export async function* chatStream({ messages, provider = 'gemini', conversationId }) {
  const p = PROVIDERS[provider];
  if (!p) throw new Error(`Unknown provider: ${provider}`);
  const start = Date.now();
  let fullContent = '', status = 'success', error;
  try {
    for await (const chunk of p.generateStream(messages)) {
      fullContent += chunk;
      yield chunk;
    }
  } catch (err) {
    status = 'error'; error = err.message; throw err;
  } finally {
    emitter.emit('log.created', {
      conversationId, provider,
      model: provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini',
      latency: Date.now() - start,
      promptTokens: Math.ceil(messages.map(m => m.content).join(' ').length / 4) || 0,
      completionTokens: Math.ceil(fullContent.length / 4) || 0,
      status, error,
      inputPreview: messages.at(-1)?.content?.slice(0, 100),
      outputPreview: fullContent.slice(0, 100),
    });
  }
}
