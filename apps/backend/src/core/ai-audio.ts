import OpenAI from 'openai'
import { getActiveProvider } from './ai-client.js'

/**
 * Audio transcription — masih pakai openai SDK karena Vercel AI SDK
 * belum punya dukungan audio/transcriptions.
 */
export async function transcribeAudio(audioPath: string, userId?: string): Promise<string> {
  const provider = await getActiveProvider('audio', userId)
  if (!provider) throw new Error('No AI provider configured for audio transcription. Add an audio provider in Settings → AI Providers.')

  const client = new OpenAI({
    apiKey: provider.apiKey,
    baseURL: provider.baseURL || undefined,
    timeout: 60000,
  })

  const fs = await import('node:fs')

  const isMultimodalChatFallback =
    provider.modelId.includes('qwen-audio') ||
    provider.modelId.includes('qwen2-audio') ||
    provider.modelId.includes('omni')

  if (!isMultimodalChatFallback) {
    try {
      const result = await client.audio.transcriptions.create({
        model: provider.modelId,
        file: fs.createReadStream(audioPath),
      })
      return result.text ?? ''
    } catch (err: any) {
      if (err?.status !== 404) {
        throw err
      }
    }
  }

  try {
    const audioBuffer = fs.readFileSync(audioPath)
    const base64Audio = audioBuffer.toString('base64')
    const ext = audioPath.split('.').pop()?.toLowerCase() ?? 'webm'
    
    let mimeType = 'audio/wav'
    if (ext === 'webm') mimeType = 'audio/webm'
    else if (ext === 'mp3') mimeType = 'audio/mpeg'
    else if (ext === 'ogg') mimeType = 'audio/ogg'
    else if (ext === 'wav') mimeType = 'audio/wav'

    const format = ext === 'mp3' ? 'mp3' : ext === 'wav' ? 'wav' : 'wav'

    const isDashScope = provider.baseURL.includes('dashscope') || provider.baseURL.includes('aliyuncs.com')
    const audioData = isDashScope
      ? `data:${mimeType};base64,${base64Audio}`
      : base64Audio

    const response = await client.chat.completions.create({
      model: provider.modelId,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Transcribe this audio precisely. Output only the transcript text, no translations, no explanations, no markdown tags.',
            },
            {
              type: 'input_audio',
              input_audio: isDashScope
                ? {
                    data: audioData,
                  }
                : {
                    data: audioData,
                    format: format as any,
                  },
            },
          ],
        },
      ] as any,
    })

    const text = response.choices[0]?.message?.content?.trim() ?? ''
    return text
  } catch (chatErr: any) {
    throw new Error(
      `Audio transcription failed. Dedicated endpoint was not found and chat completion fallback failed: ${chatErr.message || chatErr}`
    )
  }
}
