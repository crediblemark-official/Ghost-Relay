/**
 * Utility untuk auto-detect model berdasarkan nama dari daftar model.
 * Dipakai di onboarding dan settings.
 */
export interface DetectedModels {
  chat: string
  embedding: string
  audio: string
}

export function autoDetectModels(models: string[]): DetectedModels {
  const chat = models.find(m =>
    m.includes('gpt-4') || m.includes('claude') || m.includes('qwen') ||
    m.includes('deepseek') || m.includes('chat') || m.includes('instruct')
  ) ?? ''

  const embedding = models.find(m =>
    m.includes('embed') || m.includes('ada')
  ) ?? ''

  const audio = models.find(m =>
    m.includes('whisper') || m.includes('audio') || m.includes('speech')
  ) ?? ''

  return { chat, embedding, audio }
}
