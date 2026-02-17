import { Link, Navigate, Outlet } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useLogoutMutation } from '@/hooks/useAuthMutations'
import { useMe } from '@/hooks/useMe'
import { ROUTES } from '@/lib/routes'

export function AppLayout() {
  const { token, clearToken } = useAuth()
  const { data: user, isPending, isError } = useMe()
  const logoutMutation = useLogoutMutation()

  if (!token) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (isError) {
    clearToken()
    return <Navigate to={ROUTES.login} replace />
  }

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Laden…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b bg-card">
        <div className="flex h-14 items-center gap-4 px-6">
          <Link to={ROUTES.home} className="font-semibold text-foreground hover:underline">
            NT-2
          </Link>
          <nav className="flex flex-1 items-center gap-2">
            <Link
              to={ROUTES.home}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Home
            </Link>
          </nav>
          {user != null && (
            <span className="text-muted-foreground text-sm">{user.username}</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Uitloggen
          </Button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
