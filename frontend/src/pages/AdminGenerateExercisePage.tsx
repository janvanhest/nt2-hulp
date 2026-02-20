import { useNavigate } from 'react-router'
import type { ExerciseType } from '@/lib/api'
import { ApiError } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useCreateExercise } from '@/hooks/useExercises'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useState } from 'react'

const EXERCISE_TYPE_OPTIONS: { value: ExerciseType; label: string }[] = [
  { value: 'vervoeging', label: 'Vervoegingsoefening' },
  { value: 'invulzin', label: 'Invulzin-oefening' },
]

export function AdminGenerateExercisePage() {
  const navigate = useNavigate()
  const createMutation = useCreateExercise()
  const [exerciseType, setExerciseType] = useState<ExerciseType>('vervoeging')
  const [numItems, setNumItems] = useState<string>('10')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = parseInt(numItems, 10)
    if (Number.isNaN(n) || n < 1) {
      toast.error('Voer een geldig aantal in (minimaal 1).')
      return
    }
    createMutation.mutate(
      { exercise_type: exerciseType, num_items: n },
      {
        onSuccess: () => {
          toast.success('Oefening aangemaakt.')
          navigate(ROUTES.oefenen)
        },
        onError: (err) => {
          const message =
            err instanceof ApiError ? err.message : 'Er is iets misgegaan.'
          toast.error(message)
        },
      }
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Oefening genereren</h1>
      <p className="text-muted-foreground mt-1">
        Kies het type oefening en het aantal items. De oefening wordt direct
        aangemaakt.
      </p>

      <Card className="mt-6 max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Nieuwe oefening</CardTitle>
          <CardDescription>
            Vervoeging: werkwoorden met alle vormen. Invulzin: zinnen met een
            invulplek.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-type">Oefeningstype</Label>
              <Select
                value={exerciseType}
                onValueChange={(v) => setExerciseType(v as ExerciseType)}
                name="exercise_type"
              >
                <SelectTrigger id="exercise-type">
                  <SelectValue placeholder="Kies type" />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="num-items">Aantal items</Label>
              <Input
                id="num-items"
                type="number"
                min={1}
                value={numItems}
                onChange={(e) => setNumItems(e.target.value)}
                aria-describedby="num-items-hint"
              />
              <p id="num-items-hint" className="text-muted-foreground text-sm">
                Minimaal 1. Maximaal het aantal beschikbare werkwoorden of
                zinnen.
              </p>
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Bezig…' : 'Oefening genereren'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
