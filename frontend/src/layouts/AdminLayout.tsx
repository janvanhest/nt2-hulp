import { Navigate, Outlet } from 'react-router'
import { useMe } from '@/hooks/useMe'
import { isAdmin } from '@/lib/api'
import { ROUTES } from '@/lib/routes'

/**
 * Layout for beheer (admin) routes. Renders children only when user has role 'beheerder';
 * otherwise redirects to home. Use as parent route component for /beheer/*.
 */
export function AdminLayout() {
  const { data: user, isPending, isError } = useMe()

  if (isPending || isError || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">Laden…</p>
      </div>
    )
  }

  if (!isAdmin(user)) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}
