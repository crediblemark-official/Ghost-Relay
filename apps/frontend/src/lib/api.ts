import { useAuthStore } from '@/stores/authStore'

const BASE_URL = import.meta.env.VITE_API_URL || ''

function normalizePath(path: string): string {
  if (BASE_URL) return path
  return path.startsWith('/api/') ? path : `/api${path}`
}

function getHeaders(hasBody: boolean): HeadersInit {
  const token = useAuthStore.getState().token
  const headers: HeadersInit = {}
  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${BASE_URL}${normalizePath(path)}`
  const hasBody = body !== undefined && !(body instanceof FormData)
  const options: RequestInit = { method, headers: getHeaders(hasBody) }

  if (body instanceof FormData) {
    options.body = body
  } else if (body) {
    options.body = JSON.stringify(body)
  }

  const res = await fetch(url, options)
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.detail || `API error: ${res.status} ${res.statusText}`)
  }
  if (res.status === 204) {
    return {} as T
  }
  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
