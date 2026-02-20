import { Link } from 'react-router'
import { ROUTES } from '@/lib/routes'
import { Button } from '@/components/ui/button'

export function NakijkPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Nakijkmodel</h1>
      <p className="text-muted-foreground mt-1">
        Kies een oefening bij Oefenen, vul deze in en klik op &quot;Bekijk nakijkmodel&quot; om de correcte antwoorden te zien.
      </p>
      <Button asChild className="mt-4">
        <Link to={ROUTES.oefenen}>Naar oefenen</Link>
      </Button>
    </main>
  )
}
