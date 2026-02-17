import { useMe } from '@/hooks/useMe'
import illustrationWelcome from '@/assets/illustration-welcome.svg?url'

export function HomePage() {
  const { data: user } = useMe()
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Welkom</h1>
      {user?.username != null && (
        <p className="text-muted-foreground mt-1">Ingelogd als {user.username}</p>
      )}
      <img
        src={illustrationWelcome}
        alt=""
        className="mt-8 h-48 w-auto max-w-md object-contain"
        aria-hidden
      />
    </main>
  )
}
