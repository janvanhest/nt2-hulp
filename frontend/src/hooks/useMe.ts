import { useQuery } from '@tanstack/react-query'
import type { User } from '@/lib/api'
import { apiFetch, ApiError, clearStoredToken } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Fetches the current user from GET /api/auth/me/. Only runs when a token is present.
 * On 401, clears the token; retry is disabled for this query.
 */
export function useMe() {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['me'],
    queryFn: async (): Promise<User> => {
      const res = await apiFetch('/api/auth/me/')
      if (!res.ok) {
        if (res.status === 401) {
          clearStoredToken()
        }
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<User>
    },
    enabled: !!token,
    retry: false,
  })
}
