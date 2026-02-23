import { Navigate, Outlet } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useLogoutMutation } from '@/hooks/useAuthMutations'
import { useMe } from '@/hooks/useMe'
import { isAdmin } from '@/lib/api'
import { NAV_ITEMS } from '@/lib/nav-config'
import { ROUTES } from '@/lib/routes'
import { AppHeader } from './AppHeader'

/**
 * Main app shell: auth guard, header, main content, toaster.
 * Redirects to login when no token or /api/auth/me/ fails.
 */
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

  if (user == null) {
    return <Navigate to={ROUTES.login} replace />
  }

  const mainItems = NAV_ITEMS.filter((i) => !i.adminOnly)
  const adminItems = NAV_ITEMS.filter((i) => i.adminOnly)
  const showAdminNav = isAdmin(user) && adminItems.length > 0

  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden">
      <AppHeader
        user={user}
        mainItems={mainItems}
        adminItems={adminItems}
        showAdminNav={showAdminNav}
        onLogout={() => logoutMutation.mutate()}
        isLoggingOut={logoutMutation.isPending}
      />
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <main className="mx-auto w-full max-w-4xl">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}
