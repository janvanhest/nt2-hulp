import type { ExerciseType } from '@/lib/api'
import { VerbSentenceCard } from '@/components/VerbSentenceCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WizardStep4Props } from './types'

const EXERCISE_TYPE_OPTIONS: { value: ExerciseType; label: string }[] = [
  { value: 'vervoeging', label: 'Vervoegingsoefening' },
  { value: 'invulzin', label: 'Invulzin-oefening' },
]

export const Step4SummaryAndExercise = ({
  createdVerb,
  sentences,
  step4CardExpanded,
  onStep4CardExpandChange,
  onEditSentence,
  onDeleteSentence,
  onAddSentence,
  exerciseType,
  onExerciseTypeChange,
  numItems,
  onNumItemsChange,
  useAllVerbs,
  onUseAllVerbsChange,
  selectedVerbIds,
  onToggleVerb,
  verbsLoading,
  sortedVerbs,
  onExerciseSubmit,
  exerciseSubmitPending,
}: WizardStep4Props) => (
  <>
    <h2 className="text-lg font-semibold mt-8">Stap 4: Werkwoord afgerond</h2>
    <div className="mt-4 max-w-4xl">
      <VerbSentenceCard
        group={{ verb: createdVerb, sentences }}
        isExpanded={step4CardExpanded}
        onExpandChange={onStep4CardExpandChange}
        onEditSentence={(s, _e) => onEditSentence(s)}
        onDeleteSentence={onDeleteSentence}
        onAddSentence={onAddSentence}
        showFormCoverage
      />
    </div>
    <Card className="mt-6 max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Nieuwe oefening</CardTitle>
        <CardDescription>
          Vervoeging: werkwoorden met alle vormen. Invulzin: zinnen met een
          invulplek.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onExerciseSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-type">Oefeningstype</Label>
            <Select
              value={exerciseType}
              onValueChange={(v) => onExerciseTypeChange(v as ExerciseType)}
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
            <Label>Werkwoorden</Label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAllVerbs}
                  onChange={(e) => onUseAllVerbsChange(e.target.checked)}
                  className="rounded border-input"
                />
                Alle werkwoorden
              </label>
              {!useAllVerbs && (
                <div
                  className="max-h-48 overflow-y-auto rounded-md border border-input p-2 space-y-1.5"
                  role="group"
                  aria-label="Kies werkwoorden"
                >
                  {verbsLoading ? (
                    <p className="text-muted-foreground text-sm">
                      Werkwoorden laden…
                    </p>
                  ) : sortedVerbs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Geen werkwoorden. Voeg eerst werkwoorden toe.
                    </p>
                  ) : (
                    sortedVerbs.map((v) => (
                      <label
                        key={v.id}
                        className="flex items-center gap-2 text-sm font-normal cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={selectedVerbIds.has(v.id)}
                          onChange={() => onToggleVerb(v.id)}
                          className="rounded border-input"
                        />
                        {v.infinitive}
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="num-items">Aantal items</Label>
            <Input
              id="num-items"
              type="number"
              min={1}
              value={numItems}
              onChange={(e) => onNumItemsChange(e.target.value)}
              aria-describedby="num-items-hint"
            />
            <p id="num-items-hint" className="text-muted-foreground text-sm">
              Minimaal 1. Maximaal het aantal beschikbare werkwoorden of zinnen.
            </p>
          </div>
          <Button
            type="submit"
            disabled={exerciseSubmitPending}
          >
            {exerciseSubmitPending ? 'Bezig…' : 'Oefening toevoegen'}
          </Button>
        </form>
      </CardContent>
    </Card>
  </>
)
