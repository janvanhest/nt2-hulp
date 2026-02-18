import { Link } from 'react-router'
import { Outlet } from 'react-router'
import { useMe } from '@/hooks/useMe'
import { isAdmin } from '@/lib/api'
import { ROUTES } from '@/lib/routes'

/**
 * Layout for beheer (admin) routes. Renders children only when user has role 'beheerder';
 * otherwise shows a "no access" message so the URL stays visible (e.g. /beheer/werkwoorden).
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
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Geen toegang</h1>
        <p className="text-muted-foreground mt-1">
          Alleen beheerders hebben toegang tot deze pagina.
        </p>
        <Link
          to={ROUTES.home}
          className="mt-4 inline-block text-primary font-medium hover:underline"
        >
          Naar startpagina
        </Link>
      </main>
    )
  }

  return <Outlet />
}
