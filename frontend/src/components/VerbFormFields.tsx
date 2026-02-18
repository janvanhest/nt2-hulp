import type { VerbForm } from '@/lib/api'
import {
  isVerbFormValueFilled,
  VERB_FORM_KEYS,
  VERB_FORM_LABELS,
} from '@/lib/verbFormConfig'

export function VerbFormFields({ forms }: { forms: VerbForm }) {
  return (
    <div className="grid gap-2 py-2">
      {VERB_FORM_KEYS.map((key) => {
        const value = forms[key]
        const isEmpty = !isVerbFormValueFilled(value)
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-40 shrink-0 text-sm text-muted-foreground">{VERB_FORM_LABELS[key]}</span>
            {isEmpty ? (
              <span className="italic text-muted-foreground">nog in te vullen</span>
            ) : (
              <span>{String(value)}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
