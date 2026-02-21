import type { FillInSentence } from '@/lib/api'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import {
  TARGET_SENTENCES_PER_FORM,
  TOTAL_VERB_FORMS,
  countCoveredForms,
  getFormCounts,
  type VerbSentenceGroup,
} from '@/lib/sentenceUtils'
import * as React from 'react'
import { VerbSentenceCardActions } from '@/components/VerbSentenceCardActions'
import { VerbSentenceCardHeader } from '@/components/VerbSentenceCardHeader'
import { VerbSentenceTable } from '@/components/VerbSentenceTable'

export interface VerbSentenceCardProps {
  group: VerbSentenceGroup
  isExpanded: boolean
  onExpandChange: (open: boolean) => void
  onEditSentence: (sentence: FillInSentence, e: React.MouseEvent) => void
  onDeleteSentence: (sentence: FillInSentence) => void
  /** Called when user clicks "Zin toevoegen"; opens dialog with this verb pre-selected. */
  onAddSentence?: (verbId: number) => void
  /** When false, hide form coverage (progress, per-form counts and links). Default true. */
  showFormCoverage?: boolean
}

export function VerbSentenceCard({
  group,
  isExpanded,
  onExpandChange,
  onEditSentence,
  onDeleteSentence,
  onAddSentence,
  showFormCoverage = true,
}: VerbSentenceCardProps) {
  const { verb, sentences: verbSentences } = group
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const sentenceCount = verbSentences.length
  const coveredForms = countCoveredForms(verbSentences, TARGET_SENTENCES_PER_FORM)
  const formsPercentage = TOTAL_VERB_FORMS > 0 ? (coveredForms / TOTAL_VERB_FORMS) * 100 : 0
  const countLabel = sentenceCount === 1 ? '1 zin' : `${sentenceCount} zinnen`
  const formCounts = getFormCounts(verbSentences)

  const showHeaderBorder = isExpanded

  return (
    <Card className="min-w-0 w-full gap-2 py-2 sm:gap-3 sm:py-3">
      <Collapsible open={isExpanded} onOpenChange={onExpandChange}>
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CardHeader
            className={cn(
              'max-sm:!flex max-sm:flex-col gap-3 min-w-0 px-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-2 sm:px-4',
              showHeaderBorder ? 'border-b pb-3' : ''
            )}
          >
            <VerbSentenceCardHeader
              verb={verb}
              countLabel={countLabel}
              coveredForms={coveredForms}
              formsPercentage={formsPercentage}
              formCounts={formCounts}
              showFormCoverage={showFormCoverage}
            />
            <CardAction className="order-2 w-full shrink-0 sm:order-none sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:w-auto sm:min-w-[10rem] sm:justify-self-end">
              <VerbSentenceCardActions
                detailsOpen={detailsOpen}
                isExpanded={isExpanded}
                onExpandChange={onExpandChange}
                onAddSentence={onAddSentence}
                verbId={verb.id}
                sentenceCount={sentenceCount}
                showFormCoverage={showFormCoverage}
              />
            </CardAction>
          </CardHeader>
        </Collapsible>
        <CollapsibleContent>
          <CardContent className="px-3 pt-1.5 sm:px-4">
            <VerbSentenceTable
              sentences={verbSentences}
              onEditSentence={onEditSentence}
              onDeleteSentence={onDeleteSentence}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
