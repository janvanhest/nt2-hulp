import type { FillInSentence, FillInSentencePayload, Verb } from '@/lib/api'
import { ApiError, getFieldErrors } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { toast } from 'sonner'
import * as React from 'react'

export interface FillInSentenceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Existing sentence when editing; null for create. */
  sentence: FillInSentence | null
  /** Pre-filled verb id (e.g. from ?verb=). When set, verb select is disabled in create mode. */
  initialVerbId?: number
  verbs: Verb[]
}

export function FillInSentenceFormDialog({
  open,
  onOpenChange,
  sentence,
  initialVerbId,
  verbs,
}: FillInSentenceFormDialogProps) {
  const createMutation = useCreateFillInSentence()
  const updateMutation = useUpdateFillInSentence()
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const isCreate = sentence === null
  const isPending = createMutation.isPending || updateMutation.isPending

  const [verbId, setVerbId] = React.useState<number | ''>('')
  const [sentenceTemplate, setSentenceTemplate] = React.useState('')
  const [answer, setAnswer] = React.useState('')

  const verbSelectDisabled = isCreate && initialVerbId != null
  const displayVerbId = isCreate && initialVerbId != null ? initialVerbId : verbId

  React.useEffect(() => {
    if (!open) {
      setFieldErrors({})
      return
    }
    if (sentence) {
      setVerbId(sentence.verb.id)
      setSentenceTemplate(sentence.sentence_template)
      setAnswer(sentence.answer)
    } else {
      setVerbId(initialVerbId ?? '')
      setSentenceTemplate('')
      setAnswer('')
    }
  }, [open, sentence, initialVerbId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    const finalVerbId =
      typeof displayVerbId === 'number' ? displayVerbId : verbId !== '' ? (verbId as number) : null
    if (finalVerbId == null) {
      setFieldErrors({ verb: 'Kies een werkwoord.' })
      return
    }
    const payload: FillInSentencePayload = {
      verb: finalVerbId,
      sentence_template: sentenceTemplate.trim(),
      answer: answer.trim(),
    }
    if (!payload.sentence_template) {
      setFieldErrors({ sentence_template: 'Zin is verplicht.' })
      return
    }
    if (!payload.answer) {
      setFieldErrors({ answer: 'Antwoord is verplicht.' })
      return
    }

    if (isCreate) {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Invulzin toegevoegd.')
          onOpenChange(false)
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
            onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {isCreate ? 'Invulzin toevoegen' : 'Invulzin bewerken'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fillin-verb">Werkwoord</Label>
            <Select
              value={displayVerbId !== '' ? String(displayVerbId) : ''}
              onValueChange={(v) => setVerbId(v === '' ? '' : Number(v))}
              disabled={verbSelectDisabled}
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
          <div className="grid gap-2">
            <Label htmlFor="fillin-template">Zin (met invulplek)</Label>
            <Input
              id="fillin-template"
              value={sentenceTemplate}
              onChange={(e) => setSentenceTemplate(e.target.value)}
              placeholder="Bijv. Ik ___ elke dag naar school."
              aria-invalid={fieldErrors.sentence_template != null}
            />
            {fieldErrors.sentence_template != null && (
              <p className="text-destructive text-sm">{fieldErrors.sentence_template}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fillin-answer">Antwoord</Label>
            <Input
              id="fillin-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Bijv. fiets"
              aria-invalid={fieldErrors.answer != null}
            />
            {fieldErrors.answer != null && (
              <p className="text-destructive text-sm">{fieldErrors.answer}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Bezig…' : isCreate ? 'Toevoegen' : 'Opslaan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
