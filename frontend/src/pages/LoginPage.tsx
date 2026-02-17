import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginMutation } from '@/hooks/useAuthMutations'
import illustrationLogin from '@/assets/illustration-login.svg?url'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLoginMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 p-6 md:flex-row md:gap-12">
      <img
        src={illustrationLogin}
        alt=""
        className="h-56 w-auto max-w-xs object-contain md:h-72 md:max-w-sm"
        aria-hidden
      />
      <Card className="w-full max-w-sm shrink-0">
        <CardHeader>
          <CardTitle>Inloggen</CardTitle>
          <CardDescription>Log in met je gebruikersnaam en wachtwoord.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Gebruikersnaam</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                disabled={loginMutation.isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loginMutation.isPending}
              />
            </div>
            {loginMutation.isError && (
              <p className="text-sm text-destructive" role="alert">
                {loginMutation.error?.message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Bezig…' : 'Inloggen'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
