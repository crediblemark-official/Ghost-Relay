import OpenAI from 'openai'
import { getActiveProvider } from './ai-client.js'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'

/**
 * Audio transcription — using OpenAI SDK client to support dedicated ASR endpoints
 * and custom multimodal chat completions fallbacks (like Qwen audio/SenseVoice).
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

  let processedAudioPath = audioPath
  let wasTranscoded = false
  const ext = audioPath.split('.').pop()?.toLowerCase() ?? 'webm'
  const isWebm = ext === 'webm'

  const isDashScope = provider.baseURL.includes('dashscope') || provider.baseURL.includes('aliyuncs.com')

  // DashScope/Qwen models do not support webm, they require wav/mp3. Transcode if ffmpeg is available.
  if (isWebm && isDashScope) {
    const tempWavPath = join(tmpdir(), `${randomUUID()}.wav`)
    try {
      execSync(`ffmpeg -i "${audioPath}" -acodec pcm_s16le -ar 16000 -ac 1 "${tempWavPath}" -y`, { stdio: 'ignore' })
      processedAudioPath = tempWavPath
      wasTranscoded = true
    } catch (ffmpegErr) {
      console.warn(`[AUDIO] ffmpeg conversion failed, trying original webm:`, ffmpegErr)
    }
  }

  // Detect if this is a chat completions fallback model
  const isMultimodalChatFallback = 
    provider.modelId.includes('qwen-audio') || 
    provider.modelId.includes('qwen2-audio') ||
    provider.modelId.includes('omni')

  if (!isMultimodalChatFallback) {
    try {
      const result = await client.audio.transcriptions.create({
        model: provider.modelId,
        file: fs.createReadStream(processedAudioPath),
      })
      
      if (wasTranscoded) {
        fs.unlinkSync(processedAudioPath)
      }
      return result.text ?? ''
    } catch (err: any) {
      if (err?.status !== 404) {
        if (wasTranscoded) {
          fs.unlinkSync(processedAudioPath)
        }
        throw err
      }
    }
  }

  // Fallback ke Chat Completions dengan audio input data base64 (Multimodal Audio/Omni Models)
  try {
    const audioBuffer = fs.readFileSync(processedAudioPath)
    const base64Audio = audioBuffer.toString('base64')
    const finalExt = processedAudioPath.split('.').pop()?.toLowerCase() ?? 'wav'
    
    let mimeType = 'audio/wav'
    if (finalExt === 'webm') mimeType = 'audio/webm'
    else if (finalExt === 'mp3') mimeType = 'audio/mpeg'
    else if (finalExt === 'ogg') mimeType = 'audio/ogg'
    else if (finalExt === 'wav') mimeType = 'audio/wav'

    const format = finalExt === 'mp3' ? 'mp3' : finalExt === 'wav' ? 'wav' : 'wav'

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

    if (wasTranscoded) {
      fs.unlinkSync(processedAudioPath)
    }

    const text = response.choices[0]?.message?.content?.trim() ?? ''
    return text
  } catch (chatErr: any) {
    if (wasTranscoded) {
      fs.unlinkSync(processedAudioPath)
    }
    throw new Error(
      `Audio transcription failed. Dedicated endpoint was not found and chat completion fallback failed: ${chatErr.message || chatErr}`
    )
  }
}
