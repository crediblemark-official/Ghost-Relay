import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Message, MessageListResponse } from '@/types'

const PAGE_SIZE = 30

export function useMessages(platform?: string, search?: string, sessionId?: string | null) {
  return useInfiniteQuery<MessageListResponse>({
    queryKey: ['messages', platform, search, sessionId],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number
      if (search) {
        const res = await api.post<MessageListResponse>('/messages/search', {
          query: search,
          page,
          page_size: PAGE_SIZE,
        }, { silent: true })
        return res
      }
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('page_size', String(PAGE_SIZE))
      if (platform) params.set('platform', platform)
      if (sessionId) params.set('session_id', sessionId)
      const res = await api.get<MessageListResponse>(`/messages?${params}`)
      return res
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.pageSize)
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined
    },
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      platform: string
      receiver_id: string
      content: string
      session_id?: string
    }) => api.post<Message>('/messages/send', data),

    // Optimistic update: langsung tampilkan pesan di UI
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['messages'] })

      const previous = queryClient.getQueriesData({ queryKey: ['messages'] })

      // Buat temporary message
      const tempMsg: Message = {
        id: `temp-${Date.now()}`,
        userId: '',
        sessionId: data.session_id,
        platform: data.platform,
        senderId: '',
        senderName: '',
        content: data.content,
        messageType: 'text',
        timestamp: new Date(),
        isOutgoing: true,
      }

      // Insert ke cache (page 1, urutan terbaru di atas)
      queryClient.setQueriesData<any>({ queryKey: ['messages'] }, (old: any) => {
        if (!old?.pages?.length) return old
        const firstPage = old.pages[0]
        return {
          ...old,
          pages: [
            {
              ...firstPage,
              messages: [tempMsg, ...firstPage.messages],
              total: firstPage.total + 1,
            },
            ...old.pages.slice(1),
          ],
        }
      })

      return { previous }
    },

    onError: (_err, _data, context) => {
      // Rollback ke data sebelumnya
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data)
        }
      }
    },

    onSuccess: () => {
      // Invalidate untuk dapat data real dari server
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

export function useUploadVoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData()
      formData.append('file', audioBlob, 'voice.webm')
      return api.post<{ id: number; status: string }>('/voice/process', formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

export function useVoiceCommand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData()
      formData.append('file', audioBlob, 'voice.webm')
      return api.post<{
        status: string
        intent: Record<string, string>
        original_text: string
      }>('/voice/command', formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}
