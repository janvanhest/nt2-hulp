import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Verb, VerbPayload } from '@/lib/api'
import { apiFetch, ApiError, VERBS_API_PATH } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export const verbQueryKeys = {
  all: ['verbs'] as const,
  detail: (id: number | undefined) => ['verbs', id] as const,
}

async function fetchVerbs(): Promise<Verb[]> {
  const res = await apiFetch(`${VERBS_API_PATH}/`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<Verb[]>
}

async function fetchVerb(id: number): Promise<Verb> {
  const res = await apiFetch(`${VERBS_API_PATH}/${id}/`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<Verb>
}

/**
 * Fetches the list of verbs from GET /api/beheer/werkwoorden/. Only runs when a token is present.
 */
export function useVerbs() {
  const { token } = useAuth()

  return useQuery({
    queryKey: verbQueryKeys.all,
    queryFn: fetchVerbs,
    enabled: !!token,
  })
}

/**
 * Fetches a single verb by id. Only runs when token and id are present.
 */
export function useVerb(id: number | undefined) {
  const { token } = useAuth()

  return useQuery({
    queryKey: verbQueryKeys.detail(id),
    queryFn: () => fetchVerb(id!),
    enabled: !!token && id != null,
  })
}

/**
 * Creates a verb. On success invalidates the verbs list and detail queries.
 */
export function useCreateVerb() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: VerbPayload): Promise<Verb> => {
      const res = await apiFetch(`${VERBS_API_PATH}/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<Verb>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: verbQueryKeys.all })
    },
  })
}

/**
 * Updates a verb by id. On success invalidates the verbs list and detail queries.
 */
export function useUpdateVerb() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: VerbPayload
    }): Promise<Verb> => {
      const res = await apiFetch(`${VERBS_API_PATH}/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<Verb>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: verbQueryKeys.all })
    },
  })
}

/**
 * Deletes a verb by id. On success invalidates the verbs list and detail queries.
 */
export function useDeleteVerb() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const res = await apiFetch(`${VERBS_API_PATH}/${id}/`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: verbQueryKeys.all })
    },
  })
}
