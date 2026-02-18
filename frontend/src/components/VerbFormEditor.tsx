import type { VerbForm, VerbPayload } from '@/lib/api'
import {
  getEmptyVerbForm,
  INFINITIVE_DESCRIPTION,
  VERB_FORM_ABBREVIATIONS_HELP,
  VERB_FORM_DESCRIPTIONS,
  VERB_FORM_KEYS,
  VERB_FORM_LABELS,
} from '@/lib/verbFormConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LabelWithHint } from '@/components/LabelWithHint'
import * as React from 'react'

const VD_EMPTY_VALUE = '__empty__'
const VD_HULPWERKWOORD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: VD_EMPTY_VALUE, label: '—' },
  { value: 'hebben', label: 'hebben' },
  { value: 'zijn', label: 'zijn' },
]

export interface VerbFormEditorProps {
  initialInfinitive: string
  initialForms: VerbForm
  onSubmit: (payload: VerbPayload) => void
  isPending: boolean
  fieldErrors: Record<string, string>
}

export function VerbFormEditor({
  initialInfinitive,
  initialForms,
  onSubmit,
  isPending,
  fieldErrors,
}: VerbFormEditorProps) {
  const [infinitive, setInfinitive] = React.useState(initialInfinitive)
  const [forms, setForms] = React.useState<VerbForm>(initialForms)
  const [clientInfinitiveError, setClientInfinitiveError] = React.useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setClientInfinitiveError(null)
    const trimmed = infinitive.trim()
    if (trimmed === '') {
      setClientInfinitiveError('Infinitief is verplicht.')
      return
    }
    const payload: VerbPayload = {
      infinitive: trimmed,
      forms: { ...forms },
    }
    onSubmit(payload)
  }

  const infinitiveError = clientInfinitiveError ?? fieldErrors.infinitive

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <details className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
          {VERB_FORM_ABBREVIATIONS_HELP.title}
        </summary>
        <ul className="mt-2 list-inside list-disc space-y-0.5 text-muted-foreground">
          {VERB_FORM_ABBREVIATIONS_HELP.items.map(({ abbr, meaning }) => (
            <li key={abbr}>
              <strong className="text-foreground">{abbr}</strong> — {meaning}
            </li>
          ))}
        </ul>
      </details>

      <div className="space-y-2">
        <LabelWithHint
          htmlFor="verb-infinitive"
          label="Infinitief"
          hint={INFINITIVE_DESCRIPTION}
        />
        <Input
          id="verb-infinitive"
          value={infinitive}
          onChange={(e) => setInfinitive(e.target.value)}
          aria-invalid={!!infinitiveError}
          aria-describedby={infinitiveError ? 'verb-infinitive-error' : undefined}
        />
        {infinitiveError && (
          <p id="verb-infinitive-error" className="text-destructive text-sm" role="alert">
            {infinitiveError}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        {VERB_FORM_KEYS.map((key) => {
          if (key === 'vd_hulpwerkwoord') {
            const value = forms.vd_hulpwerkwoord
            return (
              <div key={key} className="space-y-2">
                <LabelWithHint
                  htmlFor={`verb-${key}`}
                  label={VERB_FORM_LABELS[key]}
                  hint={VERB_FORM_DESCRIPTIONS[key]}
                />
                <Select
                  value={value || VD_EMPTY_VALUE}
                  onValueChange={(v) =>
                    setForms((prev) => ({
                      ...prev,
                      vd_hulpwerkwoord: v === VD_EMPTY_VALUE ? '' : (v as 'hebben' | 'zijn'),
                    }))
                  }
                >
                  <SelectTrigger id={`verb-${key}`} className="w-full">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {VD_HULPWERKWOORD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          }
          const value = forms[key] as string
          const err = fieldErrors[key]
          return (
            <div key={key} className="space-y-2">
              <LabelWithHint
                htmlFor={`verb-${key}`}
                label={VERB_FORM_LABELS[key]}
                hint={VERB_FORM_DESCRIPTIONS[key]}
              />
              <Input
                id={`verb-${key}`}
                value={value}
                onChange={(e) => setForms((prev) => ({ ...prev, [key]: e.target.value }))}
                aria-invalid={!!err}
                aria-describedby={err ? `verb-${key}-error` : undefined}
              />
              {err && (
                <p id={`verb-${key}-error`} className="text-destructive text-sm" role="alert">
                  {err}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Opslaan…' : 'Opslaan'}
        </Button>
      </div>
    </form>
  )
}

export function getInitialVerbForm(verb: { infinitive: string; forms: VerbForm } | null): {
  infinitive: string
  forms: VerbForm
} {
  if (verb == null) {
    return { infinitive: '', forms: getEmptyVerbForm() }
  }
  return { infinitive: verb.infinitive, forms: { ...verb.forms } }
}
