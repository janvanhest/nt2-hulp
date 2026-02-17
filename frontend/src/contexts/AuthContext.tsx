import { createContext, useCallback, useContext, useState } from 'react'
import { getStoredToken, setStoredToken, clearStoredToken } from '@/lib/api'

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Returns auth token and setters. Must be used inside AuthProvider for real auth;
 * outside provider, token is null and setters are no-ops.
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
