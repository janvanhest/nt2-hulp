import type { AnswerFormKey, VerbForm } from '@/lib/api'

export const VERB_FORM_LABELS: Record<keyof VerbForm, string> = {
  tt_ik: 'ik (tt)',
  tt_jij: 'jij (tt)',
  tt_hij: 'hij/zij/het (tt)',
  vt_ev: 'hij/zij/het (vt)',
  vt_mv: 'wij/jullie/zij (vt mv)',
  vd: 'voltooid deelwoord',
  vd_hulpwerkwoord: 'hulpwerkwoord',
}

/** Keys for invulzin "Werkwoordsvorm" dropdown: verb forms + infinitive. */
export const ANSWER_FORM_KEYS: AnswerFormKey[] = [
  ...(Object.keys(VERB_FORM_LABELS) as (keyof VerbForm)[]),
  'infinitive',
]

/** Labels for invulzin answer form dropdown. Reuses VERB_FORM_LABELS + infinitive. */
export const ANSWER_FORM_LABELS: Record<AnswerFormKey, string> = {
  ...VERB_FORM_LABELS,
  infinitive: 'Infinitief (heel werkwoord)',
}

/** Short descriptions for form fields, shown as hints (e.g. tooltip). Single source of truth. */
export const VERB_FORM_DESCRIPTIONS: Record<keyof VerbForm, string> = {
  tt_ik: '1e persoon enkelvoud, tegenwoordige tijd (bijv. ik loop)',
  tt_jij: '2e persoon enkelvoud, tegenwoordige tijd (bijv. jij loopt)',
  tt_hij: '3e persoon enkelvoud, tegenwoordige tijd (hij/zij/het, bijv. hij loopt)',
  vt_ev: '3e persoon enkelvoud, verleden tijd (hij/zij/het, bijv. hij liep)',
  vt_mv: '3e persoon meervoud, verleden tijd (wij/jullie/zij, bijv. zij liepen)',
  vd: 'Voltooid deelwoord (bijv. gelopen, gewerkt)',
  vd_hulpwerkwoord: 'Hulpwerkwoord bij voltooid deelwoord: hebben of zijn',
}

/** Description for the infinitive field (not part of VerbForm). */
export const INFINITIVE_DESCRIPTION =
  'Hele werkwoord, onbepaalde wijs (bijv. lopen, werken)'

/** Explanation of abbreviations for the form (tt, vt, vd). Shown in a collapsible hint. */
export const VERB_FORM_ABBREVIATIONS_HELP = {
  title: 'Wat betekenen tt, vt en vd?',
  items: [
    { abbr: 'tt', meaning: 'tegenwoordige tijd (present)' },
    { abbr: 'vt', meaning: 'verleden tijd (past)' },
    { abbr: 'vd', meaning: 'voltooid deelwoord (past participle)' },
    { abbr: 'ev', meaning: 'enkelvoud' },
    { abbr: 'mv', meaning: 'meervoud' },
  ],
} as const

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
