import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getStoredToken, setStoredToken, clearStoredToken, setUnauthorizedHandler } from '@/lib/api'

export interface AuthContextValue {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

const noop = () => {}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  setToken: noop,
  clearToken: noop,
})

/**
 * Registers clearToken with api so any 401 from apiFetch updates auth state and triggers redirect to login.
 * Must be mounted inside AuthProvider.
 */
function AuthUnauthorizedSync() {
  const { clearToken } = useAuth()
  useEffect(() => {
    setUnauthorizedHandler(clearToken)
    return () => setUnauthorizedHandler(null)
  }, [clearToken])
  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getStoredToken)

  const setToken = useCallback((t: string) => {
    setStoredToken(t)
    setTokenState(t)
  }, [])

  const clearToken = useCallback(() => {
    clearStoredToken()
    setTokenState(null)
  }, [])

  const value: AuthContextValue = {
    token,
    setToken,
    clearToken,
  }

  return (
    <AuthContext.Provider value={value}>
      <AuthUnauthorizedSync />
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Returns auth token and setters. Must be used inside AuthProvider for real auth;
 * outside provider, token is null and setters are no-ops.
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
