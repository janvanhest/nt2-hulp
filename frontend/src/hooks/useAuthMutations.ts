import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import type { LoginResponse, User } from '@/lib/api'
import { apiFetch, ApiError } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/routes'

/**
 * Login mutation. On success: stores token and user, sets ["me"] in cache, navigates to /.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setToken } = useAuth()

  return useMutation({
    mutationFn: async (body: { username: string; password: string }) => {
      const res = await apiFetch('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<LoginResponse>
    },
    onSuccess: (data) => {
      setToken(data.token)
      queryClient.setQueryData<User>(['me'], data.user)
      navigate(ROUTES.home, { replace: true })
    },
  })
}

/**
 * Logout mutation. On success: clears token, removes ["me"] from cache, navigates to /login.
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { clearToken } = useAuth()

  return useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/api/auth/logout/', { method: 'POST' })
      if (!res.ok && res.status !== 401) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
    },
    onSuccess: () => {
      clearToken()
      queryClient.removeQueries({ queryKey: ['me'] })
      navigate(ROUTES.login, { replace: true })
    },
  })
}
