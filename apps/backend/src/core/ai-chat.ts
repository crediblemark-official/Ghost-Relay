import { makeClient, getActiveProvider } from './ai-client.js'

export async function chatCompletion(
  model: string,
  messages: { role: string; content: string }[],
  options?: { temperature?: number; responseFormat?: { type: string }; userId?: number },
): Promise<string> {
  const provider = await getActiveProvider('chat', options?.userId)
  if (!provider) throw new Error('No AI provider configured for chat')
  const client = makeClient(provider.apiKey, provider.baseURL)
  const modelId = model || provider.modelId
  const result = await client.chat.completions.create({
    model: modelId,
    messages: messages.map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
    temperature: options?.temperature ?? 0.3,
    ...(options?.responseFormat ? { response_format: options.responseFormat as { type: 'json_object' } } : {}),
  })
  return result.choices[0]?.message?.content ?? ''
}

export async function summarizeText(text: string, userId?: number): Promise<string> {
  return chatCompletion('', [
    { role: 'user', content: `Ringkas teks berikut menjadi maksimal 2 kalimat inti:\n\n${text}` },
  ], { temperature: 0.3, userId })
}

export async function generateAutoReply(
  question: string,
  context: string[],
  userId?: number,
): Promise<string> {
  const contextText = context.length ? context.join('\n---\n') : 'Tidak ada konteks.'
  return chatCompletion('', [
    {
      role: 'user',
      content: `Berdasarkan konteks percakapan tim berikut, jawab pertanyaan user.
Jawab singkat dan to the point. Sebutkan sumber jika ada.

Konteks:
${contextText}

Pertanyaan: ${question}

Jawaban:`,
    },
  ], { temperature: 0.3, userId })
}
