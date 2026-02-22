import { Link, useNavigate } from 'react-router'
import type { ExerciseType, FillInSentence, Verb, VerbPayload } from '@/lib/api'
import { ApiError, getFieldErrors } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { DeleteSentenceConfirmDialog } from '@/components/DeleteSentenceConfirmDialog'
import { FillInSentenceFormDialog } from '@/components/FillInSentenceFormDialog'
import { VerbFormEditor, getInitialVerbForm } from '@/components/VerbFormEditor'
import { VerbSentenceCard } from '@/components/VerbSentenceCard'
import { VerbSentenceTable } from '@/components/VerbSentenceTable'
import { useCreateExercise } from '@/hooks/useExercises'
import {
  useDeleteFillInSentence,
  useFillInSentences,
} from '@/hooks/useFillInSentences'
import { useCreateVerb, useUpdateVerb, useVerbs } from '@/hooks/useVerbs'
import {
  countCoveredForms,
  TARGET_SENTENCES_PER_FORM,
  TARGET_SENTENCES_PER_FORM_OPTIONS,
  TOTAL_VERB_FORMS,
} from '@/lib/sentenceUtils'
import {
  countFilledForms,
  getEmptyVerbForm,
  INFINITIVE_DESCRIPTION,
  VERB_FORM_KEYS,
} from '@/lib/verbFormConfig'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'

const FORM_COUNT = VERB_FORM_KEYS.length

const EXERCISE_TYPE_OPTIONS: { value: ExerciseType; label: string }[] = [
  { value: 'vervoeging', label: 'Vervoegingsoefening' },
  { value: 'invulzin', label: 'Invulzin-oefening' },
]

export const AdminGenerateExercisePage = () => {
  const navigate = useNavigate()
  const createExerciseMutation = useCreateExercise()
  const createVerbMutation = useCreateVerb()
  const updateVerbMutation = useUpdateVerb()
  const { data: verbs = [], isLoading: verbsLoading } = useVerbs()

  const [currentStep, setCurrentStep] = useState(1)
  const [createdVerb, setCreatedVerb] = useState<Verb | null>(null)
  const [step1Infinitive, setStep1Infinitive] = useState('')
  const [step1FieldErrors, setStep1FieldErrors] = useState<Record<string, string>>({})
  const [step2FieldErrors, setStep2FieldErrors] = useState<Record<string, string>>({})
  const [existingVerbDialogOpen, setExistingVerbDialogOpen] = useState(false)
  const [existingVerbToLoad, setExistingVerbToLoad] = useState<Verb | null>(null)
  const [sentenceDialogOpen, setSentenceDialogOpen] = useState(false)
  const [sentenceToEdit, setSentenceToEdit] = useState<FillInSentence | null>(null)
  const [sentenceToDelete, setSentenceToDelete] = useState<FillInSentence | null>(null)
  const [step4CardExpanded, setStep4CardExpanded] = useState(true)

  const { data: step3Sentences = [] } = useFillInSentences(createdVerb?.id)
  const deleteSentenceMutation = useDeleteFillInSentence()

  const [targetSentencesPerForm, setTargetSentencesPerForm] = useState(
    TARGET_SENTENCES_PER_FORM
  )
  const [exerciseType, setExerciseType] = useState<ExerciseType>('vervoeging')
  const [numItems, setNumItems] = useState<string>('10')
  const [useAllVerbs, setUseAllVerbs] = useState(true)
  const [selectedVerbIds, setSelectedVerbIds] = useState<Set<number>>(new Set())

  const sortedVerbs = useMemo(
    () => [...verbs].sort((a, b) => a.infinitive.localeCompare(b.infinitive)),
    [verbs]
  )

  const toggleVerb = (id: number) => {
    setSelectedVerbIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep1FieldErrors({})
    const raw = step1Infinitive.trim()
    if (raw === '') {
      setStep1FieldErrors({ infinitive: 'Infinitief is verplicht.' })
      return
    }
    const infinitive = raw.toLowerCase()
    const existingVerb = verbs.find(
      (v) => v.infinitive.toLowerCase() === infinitive
    )
    if (existingVerb != null) {
      setExistingVerbToLoad(existingVerb)
      setExistingVerbDialogOpen(true)
      return
    }
    const payload: VerbPayload = {
      infinitive,
      forms: getEmptyVerbForm(),
    }
    try {
      const verb = await createVerbMutation.mutateAsync(payload)
      setCreatedVerb(verb)
      setCurrentStep(2)
      toast.success('Werkwoord toegevoegd.')
    } catch (error) {
      if (error instanceof ApiError) {
        const errors = getFieldErrors(error)
        setStep1FieldErrors(errors)
        if (Object.keys(errors).length > 0) {
          toast.error('Fout bij opslaan', { description: error.message })
        }
      } else {
        toast.error('Er is iets misgegaan.', {
          description: error instanceof Error ? error.message : undefined,
        })
      }
    }
  }

  const handleLoadExistingVerb = () => {
    if (existingVerbToLoad != null) {
      setCreatedVerb(existingVerbToLoad)
      setCurrentStep(2)
      setExistingVerbDialogOpen(false)
      setExistingVerbToLoad(null)
      toast.success('Bestaand werkwoord geladen.')
    }
  }

  const handleCancelLoadExistingVerb = () => {
    setExistingVerbDialogOpen(false)
    setExistingVerbToLoad(null)
  }

  const handleStep2Submit = async (payload: VerbPayload) => {
    if (createdVerb == null) return
    setStep2FieldErrors({})
    try {
      await updateVerbMutation.mutateAsync({ id: createdVerb.id, data: payload })
      setCurrentStep(3)
      toast.success('Werkwoord bijgewerkt.')
    } catch (error) {
      if (error instanceof ApiError) {
        const errors = getFieldErrors(error)
        setStep2FieldErrors(errors)
        if (Object.keys(errors).length > 0) {
          toast.error('Fout bij opslaan', { description: error.message })
        }
      } else {
        toast.error('Er is iets misgegaan.', {
          description: error instanceof Error ? error.message : undefined,
        })
      }
    }
  }

  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = parseInt(numItems, 10)
    if (Number.isNaN(n) || n < 1) {
      toast.error('Voer een geldig aantal in (minimaal 1).')
      return
    }
    if (!useAllVerbs && selectedVerbIds.size === 0) {
      toast.error('Kies minimaal één werkwoord.')
      return
    }
    const payload = {
      exercise_type: exerciseType,
      num_items: n,
      ...(useAllVerbs ? {} : { verb_ids: Array.from(selectedVerbIds) }),
    }
    createExerciseMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Oefening aangemaakt.')
        navigate(ROUTES.oefenen)
      },
      onError: (err) => {
        const message =
          err instanceof ApiError ? err.message : 'Er is iets misgegaan.'
        toast.error(message)
      },
    })
  }

  const stepComplete = (stepIndex: number) => currentStep > stepIndex
  const stepActive = (stepIndex: number) => currentStep === stepIndex

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Oefening toevoegen</h1>
      <p className="text-muted-foreground mt-1">
        Volg de stappen. Na elke stap kun je door naar de volgende.
      </p>

      <nav
        className="mt-6 relative flex w-full max-w-2xl justify-between px-2"
        aria-label="Voorbereidingsstappen"
      >
        <div
          className="absolute left-0 right-0 top-[18px] h-0.5 bg-muted -translate-y-1/2"
          aria-hidden
        />
        {/* Step 1 */}
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="relative z-10 flex flex-col items-center gap-1.5 min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-foreground"
          aria-current={stepActive(1) ? 'step' : undefined}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
              stepComplete(1)
                ? 'bg-primary text-primary-foreground'
                : stepActive(1)
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground'
                  : 'border-2 border-muted bg-background'
            }`}
          >
            {stepComplete(1) ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              1
            )}
          </span>
          <span className="text-xs font-medium text-center">Infinitief</span>
          {createdVerb != null && (
            <Badge variant="secondary" className="text-xs w-fit">
              {createdVerb.infinitive}
            </Badge>
          )}
        </button>
        {/* Step 2 */}
        <button
          type="button"
          onClick={() => createdVerb != null && setCurrentStep(2)}
          className="relative z-10 flex flex-col items-center gap-1.5 min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={createdVerb == null}
          aria-current={stepActive(2) ? 'step' : undefined}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
              stepComplete(2)
                ? 'bg-primary text-primary-foreground'
                : stepActive(2)
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground'
                  : 'border-2 border-muted bg-background'
            }`}
          >
            {stepComplete(2) ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              2
            )}
          </span>
          <span className="text-xs font-medium text-center">Vormen</span>
          {createdVerb != null && (
            <Badge variant="secondary" className="text-xs w-fit">
              {stepActive(2)
                ? 'Bewerken'
                : countFilledForms(createdVerb.forms) === FORM_COUNT
                  ? 'ingevuld'
                  : 'Onvolledig'}
            </Badge>
          )}
        </button>
        {/* Step 3 */}
        <button
          type="button"
          onClick={() => currentStep >= 3 && setCurrentStep(3)}
          className="relative z-10 flex flex-col items-center gap-1.5 min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={currentStep < 3}
          aria-current={stepActive(3) ? 'step' : undefined}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
              stepComplete(3)
                ? 'bg-primary text-primary-foreground'
                : stepActive(3)
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground'
                  : 'border-2 border-muted bg-background'
            }`}
          >
            {stepComplete(3) ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              3
            )}
          </span>
          <span className="text-xs font-medium text-center">Zinnen</span>
        </button>
        {/* Step 4 */}
        <button
          type="button"
          onClick={() => currentStep >= 4 && setCurrentStep(4)}
          className="relative z-10 flex flex-col items-center gap-1.5 min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={currentStep < 4}
          aria-current={stepActive(4) ? 'step' : undefined}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
              stepActive(4)
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground'
                : 'border-2 border-muted bg-background'
            }`}
          >
            4
          </span>
          <span className="text-xs font-medium text-center">Afronden</span>
        </button>
      </nav>

      {/* Step 1: Werkwoord toevoegen (alleen infinitief) */}
      {currentStep === 1 && (
        <Card className="mt-8 max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Stap 1: Werkwoord toevoegen</CardTitle>
            <CardDescription>
              Voer de infinitief in. Na "Volgende stap" vul je in stap 2 de
              werkwoordsvormen in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleStep1Submit}
              className="flex flex-col gap-6 items-center"
            >
              <div className="space-y-2 w-full max-w-xs flex flex-col items-center text-center">
                <Label htmlFor="step1-infinitive">Infinitief</Label>
                <Input
                  id="step1-infinitive"
                  className="w-full"
                  value={step1Infinitive}
                  onChange={(e) => setStep1Infinitive(e.target.value)}
                  onBlur={() =>
                    setStep1Infinitive((v) => v.trim().toLowerCase())
                  }
                  aria-invalid={!!step1FieldErrors.infinitive}
                  aria-describedby={
                    step1FieldErrors.infinitive
                      ? 'step1-infinitive-error'
                      : undefined
                  }
                  placeholder="bijv. lopen"
                />
                {step1FieldErrors.infinitive && (
                  <p
                    id="step1-infinitive-error"
                    className="text-destructive text-sm"
                    role="alert"
                  >
                    {step1FieldErrors.infinitive}
                  </p>
                )}
                <p className="text-muted-foreground text-sm">
                  {INFINITIVE_DESCRIPTION}
                </p>
              </div>
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  disabled={createVerbMutation.isPending}
                  className="w-fit shrink-0"
                >
                  {createVerbMutation.isPending ? 'Bezig…' : 'Volgende stap'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={existingVerbDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCancelLoadExistingVerb()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Werkwoord bestaat al</AlertDialogTitle>
            <AlertDialogDescription>
              Dit werkwoord staat al in de lijst. Wilt u de reeds bekende data
              laden en naar stap 2 gaan om de vormen te bewerken?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoadExistingVerb}>
              Ja, data laden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Step 2: Vormen invullen */}
      {currentStep === 2 && createdVerb != null && (
        <Card className="mt-8 max-w-4xl">
          <CardHeader>
            <CardTitle>Stap 2: Vormen invullen</CardTitle>
            <CardDescription>
              Vul de werkwoordsvormen in voor "{createdVerb.infinitive}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerbFormEditor
              key={createdVerb.id}
              initialInfinitive={getInitialVerbForm(createdVerb).infinitive}
              initialForms={getInitialVerbForm(createdVerb).forms}
              onSubmit={handleStep2Submit}
              isPending={updateVerbMutation.isPending}
              fieldErrors={step2FieldErrors}
              layout="twoColumns"
              submitLabel="Opslaan en naar stap 3"
            />
          </CardContent>
        </Card>
      )}

      {/* Step 3: Invulzinnen */}
      {currentStep === 3 && createdVerb != null && (
        <Card className="mt-8 max-w-4xl">
          <CardHeader>
            <CardTitle>
              Stap 3: Invulzinnen voor {createdVerb.infinitive}
            </CardTitle>
            <CardDescription>
              Voeg invulzinnen toe voor dit werkwoord. Kies de werkwoordsvorm en
              optioneel een of meer thema&apos;s.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4 rounded-md border bg-muted/30 px-3 py-2">
              <Label htmlFor="step3-target" className="text-sm font-medium">
                Streef aantal invulzinnen per werkwoordsvorm:
              </Label>
              <Select
                value={String(targetSentencesPerForm)}
                onValueChange={(v) => setTargetSentencesPerForm(Number(v))}
              >
                <SelectTrigger id="step3-target" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_SENTENCES_PER_FORM_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground text-sm">
                {countCoveredForms(step3Sentences, targetSentencesPerForm)} van{' '}
                {TOTAL_VERB_FORMS} werkwoordsvormen hebben min. dit aantal zinnen.
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                type="button"
                onClick={() => {
                  setSentenceToEdit(null)
                  setSentenceDialogOpen(true)
                }}
              >
                Zin toevoegen
              </Button>
              <Link
                to={ROUTES.beheerOverzichtPerWerkwoordWithView('zinnen')}
                className="text-sm text-muted-foreground hover:underline"
              >
                Naar Zinnen beheren
              </Link>
            </div>
            <VerbSentenceTable
              sentences={step3Sentences}
              onEditSentence={(s, _e) => {
                setSentenceToEdit(s)
                setSentenceDialogOpen(true)
              }}
              onDeleteSentence={(s) => setSentenceToDelete(s)}
            />
            <div className="flex justify-end pt-2">
              <Button type="button" onClick={() => setCurrentStep(4)}>
                Ga naar stap 4: Overzicht werkwoord
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && createdVerb == null && (
        <Card className="mt-8 max-w-lg">
          <CardHeader>
            <CardTitle>Stap 3: Invulzinnen</CardTitle>
            <CardDescription>
              Ga eerst naar stap 1 om een werkwoord toe te voegen, daarna kun je
              hier invulzinnen beheren.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" onClick={() => setCurrentStep(1)}>
              Naar stap 1
            </Button>
          </CardContent>
        </Card>
      )}

      <FillInSentenceFormDialog
        open={sentenceDialogOpen}
        onOpenChange={(open) => {
          setSentenceDialogOpen(open)
          if (!open) setSentenceToEdit(null)
        }}
        sentence={sentenceToEdit}
        initialVerbId={createdVerb?.id}
        fixedVerbId={createdVerb?.id}
        verbs={verbs}
      />

      <DeleteSentenceConfirmDialog
        open={sentenceToDelete != null}
        onOpenChange={(open) => {
          if (!open) setSentenceToDelete(null)
        }}
        sentence={sentenceToDelete}
        onConfirm={() => {
          if (sentenceToDelete == null) return
          deleteSentenceMutation.mutate(sentenceToDelete.id, {
            onSuccess: () => {
              toast.success('Invulzin verwijderd.')
              setSentenceToDelete(null)
            },
            onError: (err) => {
              toast.error(
                err instanceof Error ? err.message : 'Verwijderen mislukt'
              )
            },
          })
        }}
        isPending={deleteSentenceMutation.isPending}
      />

      {/* Step 4: Werkwoord afgerond + oefening genereren */}
      {currentStep === 4 && createdVerb != null && (
        <>
          <h2 className="text-lg font-semibold mt-8">
            Stap 4: Werkwoord afgerond
          </h2>
          <div className="mt-4 max-w-4xl">
            <VerbSentenceCard
              group={{ verb: createdVerb, sentences: step3Sentences }}
              isExpanded={step4CardExpanded}
              onExpandChange={setStep4CardExpanded}
              onEditSentence={(s) => {
                setSentenceToEdit(s)
                setSentenceDialogOpen(true)
              }}
              onDeleteSentence={setSentenceToDelete}
              onAddSentence={() => setSentenceDialogOpen(true)}
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
              <form onSubmit={handleExerciseSubmit} className="flex flex-col gap-4">
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
                  <Label>Werkwoorden</Label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useAllVerbs}
                        onChange={(e) => setUseAllVerbs(e.target.checked)}
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
                                onChange={() => toggleVerb(v.id)}
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
                    onChange={(e) => setNumItems(e.target.value)}
                    aria-describedby="num-items-hint"
                  />
                  <p id="num-items-hint" className="text-muted-foreground text-sm">
                    Minimaal 1. Maximaal het aantal beschikbare werkwoorden of
                    zinnen.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={
                    createExerciseMutation.isPending ||
                    (verbsLoading && !useAllVerbs)
                  }
                >
                  {createExerciseMutation.isPending
                    ? 'Bezig…'
                    : 'Oefening toevoegen'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  )
}
