import { useParams, Link } from 'react-router'
import type { NakijkmodelResponse, VerbForm } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import {
  useExerciseDetail,
  useNakijkmodel,
} from '@/hooks/useExercises'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

const CONJUGATION_FORM_KEYS: (keyof VerbForm)[] = [
  'tt_ik',
  'tt_jij',
  'tt_hij',
  'vt_ev',
  'vt_mv',
  'vd',
  'vd_hulpwerkwoord',
]

const CONJUGATION_FORM_LABELS: Record<keyof VerbForm, string> = {
  tt_ik: 'ik (tt)',
  tt_jij: 'jij (tt)',
  tt_hij: 'hij/zij/het (tt)',
  vt_ev: 'hij/zij/het (vt)',
  vt_mv: 'wij/jullie/zij (vt)',
  vd: 'voltooid deelwoord',
  vd_hulpwerkwoord: 'hulpwerkwoord',
}

type ConjugationAnswers = Record<number, Partial<Record<keyof VerbForm, string>>>
type FillInAnswers = Record<number, string>

export function OefenenDoPage() {
  const { id } = useParams<{ id: string }>()
  const exerciseId = id != null ? parseInt(id, 10) : undefined
  const { data: exercise, isLoading: loadingExercise, isError: errorExercise, error } = useExerciseDetail(exerciseId)
  const [showNakijk, setShowNakijk] = useState(false)
  const nakijkQuery = useNakijkmodel(showNakijk ? exerciseId : undefined)
  const [conjugationAnswers, setConjugationAnswers] = useState<ConjugationAnswers>({})
  const [fillInAnswers, setFillInAnswers] = useState<FillInAnswers>({})

  const setConjugationAnswer = (itemId: number, key: keyof VerbForm, value: string) => {
    setConjugationAnswers((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [key]: value },
    }))
  }

  const setFillInAnswer = (itemId: number, value: string) => {
    setFillInAnswers((prev) => ({ ...prev, [itemId]: value }))
  }

  if (exerciseId == null || !Number.isInteger(exerciseId)) {
    return (
      <main className="p-6">
        <p className="text-destructive">Ongeldige oefening.</p>
        <Button asChild variant="link" className="mt-2">
          <Link to={ROUTES.oefenen}>Terug naar oefenen</Link>
        </Button>
      </main>
    )
  }

  if (loadingExercise || exercise == null) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Oefening</h1>
        <p className="text-muted-foreground mt-2">{loadingExercise ? 'Laden…' : 'Oefening niet gevonden.'}</p>
        {!loadingExercise && (
          <Button asChild variant="link" className="mt-2">
            <Link to={ROUTES.oefenen}>Terug naar oefenen</Link>
          </Button>
        )}
      </main>
    )
  }

  if (errorExercise && error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Oefening</h1>
        <p className="text-destructive mt-2">{error instanceof Error ? error.message : 'Kon oefening niet laden.'}</p>
        <Button asChild variant="link" className="mt-2">
          <Link to={ROUTES.oefenen}>Terug naar oefenen</Link>
        </Button>
      </main>
    )
  }

  const isConjugation = exercise.exercise_type === 'vervoeging'
  const nakijk = showNakijk ? nakijkQuery.data : null

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to={ROUTES.oefenen}>← Terug</Link>
        </Button>
      </div>

      <h1 className="text-2xl font-semibold">
        {isConjugation ? 'Vervoegingsoefening' : 'Invulzin-oefening'}
      </h1>
      <p className="text-muted-foreground mt-1">
        Vul de antwoorden in. Je kunt daarna het nakijkmodel bekijken.
      </p>

      {isConjugation ? (
        <ConjugationForm
          items={exercise.conjugation_items}
          answers={conjugationAnswers}
          setAnswer={setConjugationAnswer}
        />
      ) : (
        <FillInForm
          items={exercise.fill_in_sentence_items}
          answers={fillInAnswers}
          setAnswer={setFillInAnswer}
        />
      )}

      <div className="mt-6">
        <Button
          onClick={() => setShowNakijk(true)}
          disabled={nakijkQuery.isFetching}
        >
          {nakijkQuery.isFetching ? 'Laden…' : 'Bekijk nakijkmodel'}
        </Button>
      </div>

      {showNakijk && nakijk && (
        <NakijkSection nakijk={nakijk} isConjugation={isConjugation} />
      )}
    </main>
  )
}

function ConjugationForm({
  items,
  answers,
  setAnswer,
}: {
  items: { id: number; order: number; verb: { id: number; infinitive: string } }[]
  answers: ConjugationAnswers
  setAnswer: (itemId: number, key: keyof VerbForm, value: string) => void
}) {
  return (
    <div className="mt-6 space-y-6">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{item.verb.infinitive}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONJUGATION_FORM_KEYS.map((key) => (
              <div key={key} className="space-y-1">
                <Label htmlFor={`${item.id}-${key}`}>{CONJUGATION_FORM_LABELS[key]}</Label>
                <Input
                  id={`${item.id}-${key}`}
                  value={answers[item.id]?.[key] ?? ''}
                  onChange={(e) => setAnswer(item.id, key, e.target.value)}
                  autoComplete="off"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function FillInForm({
  items,
  answers,
  setAnswer,
}: {
  items: { id: number; order: number; fill_in_sentence: { id: number; sentence_template: string; answer_form_key: string } }[]
  answers: FillInAnswers
  setAnswer: (itemId: number, value: string) => void
}) {
  return (
    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-4">
            <p className="text-muted-foreground mb-2">{item.fill_in_sentence.sentence_template}</p>
            <div className="space-y-1">
              <Label htmlFor={`fill-${item.id}`}>Antwoord</Label>
              <Input
                id={`fill-${item.id}`}
                value={answers[item.id] ?? ''}
                onChange={(e) => setAnswer(item.id, e.target.value)}
                autoComplete="off"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function NakijkSection({
  nakijk,
  isConjugation,
}: {
  nakijk: NakijkmodelResponse
  isConjugation: boolean
}) {
  return (
    <Card className="mt-8 border-primary/50">
      <CardHeader>
        <CardTitle>Nakijkmodel</CardTitle>
        <p className="text-muted-foreground text-sm">Correcte antwoorden</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConjugation ? (
          nakijk.conjugation_items.map((item) => (
            <div key={item.id}>
              <p className="font-medium text-muted-foreground mb-2">{item.infinitive}</p>
              <ul className="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {CONJUGATION_FORM_KEYS.map((key) => (
                  <li key={key}>
                    <span className="text-muted-foreground">{CONJUGATION_FORM_LABELS[key]}:</span>{' '}
                    {item.forms[key] ?? '—'}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          nakijk.fill_in_sentence_items.map((item) => (
            <div key={item.id}>
              <p className="text-muted-foreground">{item.sentence_template}</p>
              <p className="mt-1 font-medium">Antwoord: {item.answer}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
