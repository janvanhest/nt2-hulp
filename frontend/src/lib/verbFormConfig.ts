import type { VerbForm } from '@/lib/api'

export const VERB_FORM_LABELS: Record<keyof VerbForm, string> = {
  tt_ik: 'ik (tt)',
  tt_jij: 'jij (tt)',
  tt_hij: 'hij/zij (tt)',
  vt_ev: 'hij/zij (vt)',
  vt_mv: 'zij (vt mv)',
  vd: 'voltooid deelwoord',
  vd_hulpwerkwoord: 'hulpwerkwoord',
}

export const VERB_FORM_KEYS = Object.keys(VERB_FORM_LABELS) as (keyof VerbForm)[]

/** Single source of truth for "is this form field value filled?". */
export function isVerbFormValueFilled(
  value: VerbForm[keyof VerbForm]
): boolean {
  return typeof value === 'string' ? value.trim() !== '' : value !== ''
}

export function countFilledForms(forms: VerbForm): number {
  return Object.values(forms).filter(isVerbFormValueFilled).length
}

const EMPTY_FORMS: VerbForm = {
  tt_ik: '',
  tt_jij: '',
  tt_hij: '',
  vt_ev: '',
  vt_mv: '',
  vd: '',
  vd_hulpwerkwoord: '',
}

export function getEmptyVerbForm(): VerbForm {
  return { ...EMPTY_FORMS }
}
