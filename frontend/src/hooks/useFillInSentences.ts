import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FillInSentence, FillInSentencePayload } from '@/lib/api'
import { apiFetch, ApiError, FILL_IN_SENTENCES_API_PATH } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export const fillInSentenceQueryKeys = {
  all: ['fillInSentences'] as const,
  list: (verbId: number | undefined) => ['fillInSentences', verbId] as const,
  detail: (id: number | undefined) => ['fillInSentences', 'detail', id] as const,
}

async function fetchFillInSentences(verbId?: number): Promise<FillInSentence[]> {
  const url = verbId != null ? `${FILL_IN_SENTENCES_API_PATH}/?verb=${verbId}` : `${FILL_IN_SENTENCES_API_PATH}/`
  const res = await apiFetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<FillInSentence[]>
}

async function fetchFillInSentence(id: number): Promise<FillInSentence> {
  const res = await apiFetch(`${FILL_IN_SENTENCES_API_PATH}/${id}/`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<FillInSentence>
}

/**
 * Fetches invulzinnen from GET /api/beheer/invulzinnen/. Optional verbId filters by verb.
 * Only runs when a token is present.
 */
export function useFillInSentences(verbId?: number) {
  const { token } = useAuth()

  return useQuery({
    queryKey: fillInSentenceQueryKeys.list(verbId),
    queryFn: () => fetchFillInSentences(verbId),
    enabled: !!token,
  })
}

/**
 * Fetches a single invulzin by id. Only runs when token and id are present.
 */
export function useFillInSentence(id: number | undefined) {
  const { token } = useAuth()

  return useQuery({
    queryKey: fillInSentenceQueryKeys.detail(id),
    queryFn: () => fetchFillInSentence(id!),
    enabled: !!token && id != null,
  })
}

/**
 * Creates an invulzin. On success invalidates all fillInSentences queries.
 */
export function useCreateFillInSentence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FillInSentencePayload): Promise<FillInSentence> => {
      const res = await apiFetch(`${FILL_IN_SENTENCES_API_PATH}/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<FillInSentence>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fillInSentenceQueryKeys.all })
    },
  })
}

/**
 * Updates an invulzin by id. On success invalidates all fillInSentences queries.
 */
export function useUpdateFillInSentence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: FillInSentencePayload
    }): Promise<FillInSentence> => {
      const res = await apiFetch(`${FILL_IN_SENTENCES_API_PATH}/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<FillInSentence>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fillInSentenceQueryKeys.all })
    },
  })
}

/**
 * Deletes an invulzin by id. On success invalidates all fillInSentences queries.
 */
export function useDeleteFillInSentence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const res = await apiFetch(`${FILL_IN_SENTENCES_API_PATH}/${id}/`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fillInSentenceQueryKeys.all })
    },
  })
}
