import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { ApiError, apiFetch } from '@/lib/api'
import { ROUTES } from '@/lib/routes'

export function AdminPage() {
  const { data, isError, error } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const res = await apiFetch('/api/beheer/')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<{ ok: boolean }>
    },
  })

  const forbiddenMessage =
    isError && error instanceof ApiError && error.status === 403 ? error.message : null

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Beheer</h1>
      {forbiddenMessage != null ? (
        <p className="bg-destructive/10 text-destructive mt-2 rounded-md px-3 py-2 text-sm" role="alert">
          {forbiddenMessage}
        </p>
      ) : (
        <>
          <p className="text-muted-foreground mt-1">
            Overzicht beheer. Werkwoorden en zinnen beheren:
          </p>
          <ul className="mt-2 list-none space-y-1">
            <li>
              <Link
                to={ROUTES.beheerWerkwoorden}
                className="text-primary hover:underline font-medium"
              >
                Werkwoorden beheren
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.beheerZinnen}
                className="text-primary hover:underline font-medium"
              >
                Zinnen beheren
              </Link>
            </li>
          </ul>
        </>
      )}
      {data?.ok === true && (
        <p className="text-muted-foreground mt-1 text-sm">Toegang bevestigd.</p>
      )}
    </main>
  )
}
