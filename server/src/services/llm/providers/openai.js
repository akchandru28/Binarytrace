import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generate(messages) {
  const completion = await client.chat.completions.create({ model: 'gpt-4o-mini', messages });
  return {
    content: completion.choices[0].message.content,
    model: 'gpt-4o-mini',
    promptTokens: completion.usage?.prompt_tokens || 0,
    completionTokens: completion.usage?.completion_tokens || 0,
  };
}

export async function* generateStream(messages) {
  const stream = await client.chat.completions.create({ model: 'gpt-4o-mini', messages, stream: true });
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
