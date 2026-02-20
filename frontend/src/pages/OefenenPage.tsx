import { Link } from 'react-router'
import type { Exercise, ExerciseType } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useExerciseList } from '@/hooks/useExercises'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  vervoeging: 'Vervoegingsoefening',
  invulzin: 'Invulzin-oefening',
}

function formatExerciseDate(createdAt: string): string {
  try {
    const d = new Date(createdAt)
    return d.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return createdAt
  }
}

export function OefenenPage() {
  const { data: exercises, isLoading, isError, error } = useExerciseList()

  if (isLoading) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Oefenen</h1>
        <p className="text-muted-foreground mt-2">Laden…</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Oefenen</h1>
        <p className="text-destructive mt-2">
          {error instanceof Error ? error.message : 'Kon oefeningen niet laden.'}
        </p>
      </main>
    )
  }

  const list = exercises ?? []

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Oefenen</h1>
      <p className="text-muted-foreground mt-1">
        Kies een oefening om te maken. Na het invullen kun je het nakijkmodel bekijken.
      </p>

      {list.length === 0 ? (
        <p className="text-muted-foreground mt-6">Er zijn nog geen oefeningen. Een beheerder kan er een genereren via Beheer → Oefening genereren.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.map((ex: Exercise) => (
            <li key={ex.id}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    {EXERCISE_TYPE_LABELS[ex.exercise_type]} – {formatExerciseDate(ex.created_at)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="default">
                    <Link to={ROUTES.oefenenDo(ex.id)}>Start oefening</Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
