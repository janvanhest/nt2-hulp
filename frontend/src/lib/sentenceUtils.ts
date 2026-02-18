import type { AnswerFormKey, FillInSentence, Verb } from '@/lib/api'
import { ANSWER_FORM_KEYS, ANSWER_FORM_LABELS } from '@/lib/verbFormConfig'

export const TARGET_SENTENCES_PER_FORM = 2
export const TOTAL_VERB_FORMS = ANSWER_FORM_KEYS.length

export interface VerbSentenceGroup {
  verb: Verb
  sentences: FillInSentence[]
}

/** Per-form sentence counts. All ANSWER_FORM_KEYS get an entry (0 if none). */
export function getFormCounts(sentences: FillInSentence[]): Map<AnswerFormKey, number> {
  const map = new Map<AnswerFormKey, number>()
  for (const key of ANSWER_FORM_KEYS) {
    map.set(key, 0)
  }
  for (const s of sentences) {
    const key = s.answer_form_key
    if (key && ANSWER_FORM_KEYS.includes(key as AnswerFormKey)) {
      map.set(key as AnswerFormKey, (map.get(key as AnswerFormKey) ?? 0) + 1)
    }
  }
  return map
}

/** Number of verb forms that have at least minPerForm sentences. */
export function countCoveredForms(sentences: FillInSentence[], minPerForm: number): number {
  const counts = getFormCounts(sentences)
  return Array.from(counts.values()).filter((n) => n >= minPerForm).length
}

export function sentencePreview(text: string, maxLen = 50): string {
  const t = text.trim()
  return t.length <= maxLen ? t : `${t.slice(0, maxLen)}…`
}

export function formatAnswerDisplay(answer: string, answerFormKey?: AnswerFormKey | ''): string {
  if (answerFormKey && answerFormKey in ANSWER_FORM_LABELS) {
    return `${answer} (${ANSWER_FORM_LABELS[answerFormKey as AnswerFormKey]})`
  }
  return answer
}

export function buildGroupsByVerb(verbs: Verb[], sentences: FillInSentence[]): VerbSentenceGroup[] {
  const map = new Map<number, VerbSentenceGroup>()
  for (const verb of verbs) {
    map.set(verb.id, { verb, sentences: [] })
  }
  for (const s of sentences) {
    const entry = map.get(s.verb.id)
    if (entry) entry.sentences.push(s)
  }
  return Array.from(map.values()).sort((a, b) =>
    a.verb.infinitive.localeCompare(b.verb.infinitive)
  )
}
