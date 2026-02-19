import type { AnswerFormKey, Verb } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { CollapsibleContent } from '@/components/ui/collapsible'
import { ROUTES } from '@/lib/routes'
import { TARGET_SENTENCES_PER_FORM, TOTAL_VERB_FORMS } from '@/lib/sentenceUtils'
import { ANSWER_FORM_KEYS, ANSWER_FORM_LABELS } from '@/lib/verbFormConfig'
import { Link } from 'react-router'

export interface VerbSentenceCardHeaderProps {
  verb: Verb
  countLabel: string
  coveredForms: number
  formsPercentage: number
  formCounts: Map<string, number>
}

export function VerbSentenceCardHeader({
  verb,
  countLabel,
  coveredForms,
  formsPercentage,
  formCounts,
}: VerbSentenceCardHeaderProps) {
  return (
    <div className="order-1 flex min-w-0 flex-col gap-1 sm:order-none sm:row-span-2">
      <CardTitle className="text-base sm:text-lg">{verb.infinitive}</CardTitle>
      <p className="text-muted-foreground text-sm">
        {countLabel} — {coveredForms}/{TOTAL_VERB_FORMS} vormen gedekt
      </p>
      <div className="-mb-0.5 w-full max-w-full sm:max-w-xs">
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-[width]"
            style={{ width: `${formsPercentage}%` }}
          />
        </div>
      </div>
      <CollapsibleContent className="min-w-0 overflow-visible">
        <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1.5 text-xs sm:gap-x-4 sm:gap-y-2">
          {ANSWER_FORM_KEYS.map((formKey) => {
            const count = formCounts.get(formKey) ?? 0
            const covered = count >= TARGET_SENTENCES_PER_FORM
            const label = ANSWER_FORM_LABELS[formKey as AnswerFormKey]
            return (
              <span key={formKey} className="inline-flex items-center gap-1.5">
                <span className="text-muted-foreground" title={label}>
                  {label}:
                </span>
                <Badge variant={covered ? 'default' : 'secondary'} className="shrink-0 font-normal">
                  {count}
                </Badge>
                {!covered && (
                  <Link
                    to={`${ROUTES.beheerZinnen}?verb=${verb.id}&form=${formKey}`}
                    className="shrink-0 text-primary hover:underline"
                  >
                    Toevoegen
                  </Link>
                )}
              </span>
            )
          })}
        </div>
      </CollapsibleContent>
    </div>
  )
}
