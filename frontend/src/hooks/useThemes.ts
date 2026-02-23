import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Theme } from '@/lib/api'
import { apiFetch, ApiError, THEMAS_API_PATH } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export const themeQueryKeys = {
  all: ['themas'] as const,
}

async function fetchThemes(): Promise<Theme[]> {
  const res = await apiFetch(`${THEMAS_API_PATH}/`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<Theme[]>
}

/**
 * Fetches themas from GET /api/beheer/themas/. Only runs when a token is present.
 */
export function useThemes() {
  const { token } = useAuth()

  return useQuery({
    queryKey: themeQueryKeys.all,
    queryFn: fetchThemes,
    enabled: !!token,
  })
}

/**
 * Creates a theme. On success invalidates themas queries.
 */
export function useCreateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { naam: string }): Promise<Theme> => {
      const res = await apiFetch(`${THEMAS_API_PATH}/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<Theme>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: themeQueryKeys.all })
    },
  })
}
