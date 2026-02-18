import type { VerbForm } from '@/lib/api'

const LABELS: Record<keyof VerbForm, string> = {
  tt_ik: 'ik (tt)',
  tt_jij: 'jij (tt)',
  tt_hij: 'hij/zij (tt)',
  vt_ev: 'hij/zij (vt)',
  vt_mv: 'zij (vt mv)',
  vd: 'voltooid deelwoord',
  vd_hulpwerkwoord: 'hulpwerkwoord',
}

const FORM_KEYS = Object.keys(LABELS) as (keyof VerbForm)[]

export function VerbFormFields({ forms }: { forms: VerbForm }) {
  return (
    <div className="grid gap-2 py-2">
      {FORM_KEYS.map((key) => {
        const value = forms[key]
        const isEmpty = typeof value === 'string' ? value.trim() === '' : value === ''
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-40 shrink-0 text-sm text-muted-foreground">{LABELS[key]}</span>
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
