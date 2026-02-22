import type { AnswerFormKey, FillInSentence, FillInSentencePayload, Verb } from '@/lib/api'
import { ApiError, getFieldErrors } from '@/lib/api'
import {
  ANSWER_FORM_KEYS,
  ANSWER_FORM_LABELS,
  getAnswerFromVerb,
} from '@/lib/verbFormConfig'
import { Badge } from '@/components/ui/badge'
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
import {
  useCreateFillInSentence,
  useUpdateFillInSentence,
} from '@/hooks/useFillInSentences'
import { useCreateTheme, useThemes } from '@/hooks/useThemes'
import { toast } from 'sonner'
import * as React from 'react'

/**
 * Bepaalt de zin met invulplek: vervang het eerste voorkomen van het antwoord in de zin door ___.
 * Als het antwoord niet in de zin voorkomt, geef een error.
 */
function deriveSentenceTemplate(
  zin: string,
  answer: string
): { template: string; error?: string } {
  const trimmedZin = zin.trim()
  const trimmedAnswer = answer.trim()
  if (!trimmedAnswer)
    return { template: trimmedZin, error: 'Kies eerst een werkwoordsvorm.' }
  const lower = trimmedZin.toLowerCase()
  const idx = lower.indexOf(trimmedAnswer.toLowerCase())
  if (idx === -1)
    return {
      template: trimmedZin,
      error: `Het antwoord "${trimmedAnswer}" komt niet voor in de zin. Pas de zin aan of kies een andere werkwoordsvorm.`,
    }
  return {
    template:
      trimmedZin.slice(0, idx) +
      '___' +
      trimmedZin.slice(idx + trimmedAnswer.length),
  }
}

export interface FillInSentenceFormProps {
  /** Existing sentence when editing; null for create. */
  sentence: FillInSentence | null
  /** Pre-filled verb id (e.g. from ?verb=). Used as initial value in create mode. */
  initialVerbId?: number
  /** When set, verb is fixed (hidden/disabled); use for wizard step 3. */
  fixedVerbId?: number
  /** Pre-filled answer form key (e.g. from ?form=). Used in create mode. */
  initialAnswerFormKey?: AnswerFormKey | ''
  verbs: Verb[]
  /** Called after successful create or update. */
  onSuccess: () => void
  /** When provided, an Annuleren button is shown and this is called on click. */
  onCancel?: () => void
}

export function FillInSentenceForm({
  sentence,
  initialVerbId,
  fixedVerbId,
  initialAnswerFormKey,
  verbs,
  onSuccess,
  onCancel,
}: FillInSentenceFormProps) {
  const createMutation = useCreateFillInSentence()
  const updateMutation = useUpdateFillInSentence()
  const { data: themes = [] } = useThemes()
  const createThemeMutation = useCreateTheme()
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const isCreate = sentence === null
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    createThemeMutation.isPending

  const [verbId, setVerbId] = React.useState<number | ''>('')
  const [sentenceTemplate, setSentenceTemplate] = React.useState('')
  const [answerFormKey, setAnswerFormKey] = React.useState<AnswerFormKey | ''>('')
  const [selectedThemeIds, setSelectedThemeIds] = React.useState<number[]>([])
  const [newThemeNaam, setNewThemeNaam] = React.useState('')
  const [addThemeId, setAddThemeId] = React.useState<string>('')

  const effectiveVerbId = fixedVerbId ?? verbId
  const verbSelectDisabled = fixedVerbId != null
  const showVerbSelect = !verbSelectDisabled
  const selectedVerb =
    effectiveVerbId !== ''
      ? verbs.find((v) => v.id === effectiveVerbId)
      : undefined
  const derivedAnswer =
    selectedVerb && answerFormKey
      ? getAnswerFromVerb(selectedVerb, answerFormKey as AnswerFormKey)
      : ''

  React.useEffect(() => {
    setFieldErrors({})
    setNewThemeNaam('')
    setAddThemeId('')
    if (sentence) {
      setVerbId(sentence.verb.id)
      setSentenceTemplate(
        sentence.sentence_template.replace('___', sentence.answer)
      )
      setAnswerFormKey(sentence.answer_form_key ?? '')
      setSelectedThemeIds((sentence.themas ?? []).map((t) => t.id))
    } else {
      setVerbId(initialVerbId ?? '')
      setSentenceTemplate('')
      setAnswerFormKey(initialAnswerFormKey ?? '')
      setSelectedThemeIds([])
    }
  }, [sentence, initialVerbId, initialAnswerFormKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    const finalVerbId =
      effectiveVerbId !== '' ? (effectiveVerbId as number) : null
    if (finalVerbId == null) {
      setFieldErrors({ verb: 'Kies een werkwoord.' })
      return
    }
    if (!answerFormKey) {
      setFieldErrors({ answer_form_key: 'Kies een werkwoordsvorm.' })
      return
    }
    const trimmedAnswer = derivedAnswer.trim()
    if (!trimmedAnswer) {
      setFieldErrors({
        answer_form_key:
          'Vul eerst de vervoeging in voor dit werkwoord (bij Vervoegingen beheren).',
      })
      return
    }
    const trimmedZin = sentenceTemplate.trim()
    if (!trimmedZin) {
      setFieldErrors({ sentence_template: 'Zin is verplicht.' })
      return
    }
    const { template, error: deriveError } = deriveSentenceTemplate(
      trimmedZin,
      trimmedAnswer
    )
    if (deriveError) {
      setFieldErrors({ sentence_template: deriveError })
      return
    }
    const payload: FillInSentencePayload = {
      verb: finalVerbId,
      sentence_template: template,
      answer: trimmedAnswer,
      answer_form_key: answerFormKey,
      thema_ids: selectedThemeIds.length > 0 ? selectedThemeIds : undefined,
    }

    if (isCreate) {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Invulzin toegevoegd.')
          onSuccess()
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            const errors = getFieldErrors(err)
            setFieldErrors(errors)
            toast.error('Fout bij opslaan', { description: err.message })
          } else {
            toast.error('Er is iets misgegaan.', {
              description: err instanceof Error ? err.message : undefined,
            })
          }
        },
      })
    } else {
      updateMutation.mutate(
        { id: sentence.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Invulzin bijgewerkt.')
            onSuccess()
          },
          onError: (err) => {
            if (err instanceof ApiError) {
              const errors = getFieldErrors(err)
              setFieldErrors(errors)
              toast.error('Fout bij opslaan', { description: err.message })
            } else {
              toast.error('Er is iets misgegaan.', {
                description: err instanceof Error ? err.message : undefined,
              })
            }
          },
        }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {showVerbSelect ? (
        <div className="grid gap-2">
          <Label htmlFor="fillin-verb">Werkwoord</Label>
          <Select
            value={verbId !== '' ? String(verbId) : ''}
            onValueChange={(v) => setVerbId(v === '' ? '' : Number(v))}
            required
          >
            <SelectTrigger id="fillin-verb" className="w-full">
              <SelectValue placeholder="Kies een werkwoord" />
            </SelectTrigger>
            <SelectContent>
              {verbs.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.infinitive}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.verb != null && (
            <p className="text-destructive text-sm">{fieldErrors.verb}</p>
          )}
        </div>
      ) : (
        effectiveVerbId !== '' && (
          <div className="grid gap-2">
            <Label>Werkwoord</Label>
            <p className="text-sm text-muted-foreground">
              {verbs.find((v) => v.id === effectiveVerbId)?.infinitive ?? '—'}
            </p>
          </div>
        )
      )}
      <div className="grid gap-2">
        <Label htmlFor="fillin-form-key">Werkwoordsvorm</Label>
        <p className="text-muted-foreground text-sm">
          Kies de vorm (bijv. ik (tt) voor &quot;loop&quot;). Het antwoord wordt
          hieruit bepaald.
        </p>
        <Select
          value={answerFormKey}
          onValueChange={(v) => setAnswerFormKey(v === '' ? '' : (v as AnswerFormKey))}
          required
        >
          <SelectTrigger id="fillin-form-key" className="w-full">
            <SelectValue placeholder="Kies werkwoordsvorm…" />
          </SelectTrigger>
          <SelectContent>
            {ANSWER_FORM_KEYS.map((key) => {
              const label = ANSWER_FORM_LABELS[key]
              const value =
                selectedVerb != null
                  ? getAnswerFromVerb(selectedVerb, key)
                  : ''
              const optionLabel =
                value !== '' ? `${label} — ${value}` : `${label} (nog niet ingevuld)`
              return (
                <SelectItem key={key} value={key}>
                  {optionLabel}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {derivedAnswer !== '' && (
          <p className="text-muted-foreground text-sm">
            Antwoord: <strong>{derivedAnswer}</strong>
          </p>
        )}
        {fieldErrors.answer_form_key != null && (
          <p className="text-destructive text-sm">{fieldErrors.answer_form_key}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="fillin-template">Zin</Label>
        <p className="text-muted-foreground text-sm">
          Vul de volledige zin in met het antwoord erin. De invulplek (___)
          wordt automatisch bepaald.
        </p>
        <Input
          id="fillin-template"
          value={sentenceTemplate}
          onChange={(e) => setSentenceTemplate(e.target.value)}
          placeholder="Bijv. Ik loop elke dag naar school."
          aria-invalid={fieldErrors.sentence_template != null}
        />
        {fieldErrors.sentence_template != null && (
          <p className="text-destructive text-sm">{fieldErrors.sentence_template}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>Thema&apos;s</Label>
        <div className="flex flex-wrap gap-2">
          {selectedThemeIds.map((id) => {
            const theme = themes.find((t) => t.id === id)
            return (
              <Badge
                key={id}
                variant="secondary"
                className="cursor-pointer gap-1 pr-1"
                onClick={() =>
                  setSelectedThemeIds((prev) => prev.filter((x) => x !== id))
                }
              >
                {theme?.naam ?? id}
                <span aria-hidden>×</span>
              </Badge>
            )
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={addThemeId}
            onValueChange={(v) => {
              if (v === '__new__') return
              setAddThemeId('')
              if (v && !selectedThemeIds.includes(Number(v))) {
                setSelectedThemeIds((prev) => [...prev, Number(v)])
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Thema toevoegen…" />
            </SelectTrigger>
            <SelectContent>
              {themes
                .filter((t) => !selectedThemeIds.includes(t.id))
                .map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.naam}
                  </SelectItem>
                ))}
              {themes.filter((t) => !selectedThemeIds.includes(t.id)).length ===
                0 && (
                <SelectItem value="__none__" disabled>
                  Geen andere thema&apos;s
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Input
              placeholder="Nieuw thema"
              className="w-[140px]"
              value={newThemeNaam}
              onChange={(e) => setNewThemeNaam(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const naam = newThemeNaam.trim()
                  if (naam) {
                    createThemeMutation.mutate(
                      { naam },
                      {
                        onSuccess: (created) => {
                          setSelectedThemeIds((prev) =>
                            prev.includes(created.id) ? prev : [...prev, created.id]
                          )
                          setNewThemeNaam('')
                          toast.success('Thema toegevoegd.')
                        },
                        onError: (err) => {
                          toast.error(
                            err instanceof Error ? err.message : 'Thema aanmaken mislukt'
                          )
                        },
                      }
                    )
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!newThemeNaam.trim() || createThemeMutation.isPending}
              onClick={() => {
                const naam = newThemeNaam.trim()
                if (!naam) return
                createThemeMutation.mutate(
                  { naam },
                  {
                    onSuccess: (created) => {
                      setSelectedThemeIds((prev) =>
                        prev.includes(created.id) ? prev : [...prev, created.id]
                      )
                      setNewThemeNaam('')
                      toast.success('Thema toegevoegd.')
                    },
                    onError: (err) => {
                      toast.error(
                        err instanceof Error ? err.message : 'Thema aanmaken mislukt'
                      )
                    },
                  }
                )
              }}
            >
              Toevoegen
            </Button>
          </div>
        </div>
        {fieldErrors.thema_ids != null && (
          <p className="text-destructive text-sm">{fieldErrors.thema_ids}</p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        {onCancel != null && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuleren
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Bezig…' : isCreate ? 'Toevoegen' : 'Opslaan'}
        </Button>
      </div>
    </form>
  )
}
