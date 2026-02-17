import { useMe } from '@/hooks/useMe'

export function HomePage() {
  const { data: user } = useMe()
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Welkom</h1>
      {user?.username != null && (
        <p className="text-muted-foreground mt-1">Ingelogd als {user.username}</p>
      )}
    </main>
  )
}
