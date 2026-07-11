import { generateText } from 'ai'
import { getLanguageModel } from './ai-client.js'

const TRANSCRIPTION_PROMPT =
  'Transcribe this audio message exactly as spoken, in the original language. ' +
  'Return ONLY the transcription text — no punctuation normalization, no speaker labels, no summary.'

/**
 * Audio transcription — using Vercel AI SDK `generateText()` with a multimodal chat model.
 * Supports GPT-4o, Gemini, Qwen-audio, or any model that accepts audio input.
 */
export async function transcribeAudio(audioPath: string, userId?: string): Promise<string> {
  const fs = await import('node:fs')
  const audioBuffer = fs.readFileSync(audioPath)

  const model = await getLanguageModel(userId)
  if (!model) {
    throw new Error(
      'No AI provider configured. Add a provider in Settings → AI Providers (GPT-4o, Gemini, or Qwen-audio all support audio).'
    )
  }

  try {
    const { text } = await generateText({
      model: model.model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'file',
              data: audioBuffer,
              mediaType: 'audio/webm',
            },
            {
              type: 'text',
              text: TRANSCRIPTION_PROMPT,
            },
          ],
        },
      ],
    })
    return (text ?? '').trim()
  } catch (err: any) {
    // Some providers return 400/404 for unsupported content types
    if (err?.statusCode === 404 || err?.statusCode === 400 || err?.status === 404 || err?.status === 400) {
      throw new Error(
        `Audio input not supported by model "${model.modelId ?? 'unknown'}". ` +
        `Use a model that supports audio (GPT-4o, Gemini Flash/Pro, or Qwen-audio). ` +
        `Check your provider in Settings → AI Providers.`
      )
    }
    throw err
  }
}
