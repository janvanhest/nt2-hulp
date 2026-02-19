import type { AnswerFormKey, FillInSentence } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import {
  TARGET_SENTENCES_PER_FORM,
  TOTAL_VERB_FORMS,
  countCoveredForms,
  formatAnswerDisplay,
  getFormCounts,
  sentencePreview,
  type VerbSentenceGroup,
} from '@/lib/sentenceUtils'
import { ANSWER_FORM_KEYS, ANSWER_FORM_LABELS } from '@/lib/verbFormConfig'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Link } from 'react-router'

export interface VerbSentenceCardProps {
  group: VerbSentenceGroup
  isExpanded: boolean
  onExpandChange: (open: boolean) => void
  onEditSentence: (sentence: FillInSentence, e: React.MouseEvent) => void
  onDeleteSentence: (sentence: FillInSentence) => void
  /** Called when user clicks "Zin toevoegen"; opens dialog with this verb pre-selected. */
  onAddSentence?: (verbId: number) => void
}

export function VerbSentenceCard({
  group,
  isExpanded,
  onExpandChange,
  onEditSentence,
  onDeleteSentence,
  onAddSentence,
}: VerbSentenceCardProps) {
  const { verb, sentences: verbSentences } = group
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const sentenceCount = verbSentences.length
  const coveredForms = countCoveredForms(verbSentences, TARGET_SENTENCES_PER_FORM)
  const formsPercentage = TOTAL_VERB_FORMS > 0 ? (coveredForms / TOTAL_VERB_FORMS) * 100 : 0
  const countLabel = sentenceCount === 1 ? '1 zin' : `${sentenceCount} zinnen`
  const formCounts = getFormCounts(verbSentences)

  const showHeaderBorder = isExpanded

  const toggleButtonClass =
    'group w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground'

  return (
    <Card className="gap-2 py-2 sm:gap-3 sm:py-3">
      <Collapsible open={isExpanded} onOpenChange={onExpandChange}>
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CardHeader
            className={cn(
              'max-sm:!flex max-sm:flex-col gap-3 px-3 sm:grid sm:grid-cols-[1fr_auto] sm:gap-2 sm:px-4',
              showHeaderBorder ? 'border-b pb-3' : ''
            )}
          >
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
              <CollapsibleContent>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:grid-cols-4 sm:gap-x-4 sm:gap-y-2">
                  {ANSWER_FORM_KEYS.map((formKey) => {
                    const count = formCounts.get(formKey) ?? 0
                    const covered = count >= TARGET_SENTENCES_PER_FORM
                    const label = ANSWER_FORM_LABELS[formKey as AnswerFormKey]
                    return (
                      <span key={formKey} className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-muted-foreground">{label}:</span>
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
            <CardAction className="order-2 w-full shrink-0 sm:order-none sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:w-auto sm:min-w-[10rem] sm:justify-self-end">
              <div
                className={cn(
                  'flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-2 sm:min-w-[10rem]'
                )}
              >
                <div className="flex flex-row flex-wrap gap-1">
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(toggleButtonClass, 'min-h-9 sm:min-h-8')}
                      aria-expanded={detailsOpen}
                      aria-label="Vormen per type tonen of verbergen"
                    >
                      {detailsOpen ? (
                        <>
                          <ChevronUpIcon className="size-4 shrink-0" />
                          <span className="sm:inline">Verberg vormdetails</span>
                          <span className="sm:hidden">Vormen</span>
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon className="size-4 shrink-0" />
                          Vormen ({TOTAL_VERB_FORMS})
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(toggleButtonClass, 'min-h-9 sm:min-h-8')}
                    aria-expanded={isExpanded}
                    aria-label="Zinnen tonen of verbergen"
                    onClick={() => onExpandChange(!isExpanded)}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUpIcon className="size-4 shrink-0" />
                        <span className="sm:inline">Verberg zinnen</span>
                        <span className="sm:hidden">Zinnen</span>
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="size-4 shrink-0" />
                        Zinnen
                        {verbSentences.length > 0 && ` (${verbSentences.length})`}
                      </>
                    )}
                  </Button>
                </div>
                {onAddSentence != null ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-9 w-full sm:min-h-8"
                    onClick={() => onAddSentence(verb.id)}
                  >
                    Zin toevoegen
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="sm" className="min-h-9 w-full sm:min-h-8">
                    <Link to={`${ROUTES.beheerZinnen}?verb=${verb.id}`}>
                      Zin toevoegen
                    </Link>
                  </Button>
                )}
              </div>
            </CardAction>
          </CardHeader>
        </Collapsible>
        <CollapsibleContent>
          <CardContent className="px-3 pt-1.5 sm:px-4">
            {verbSentences.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nog geen zinnen voor dit werkwoord.
              </p>
            ) : (
              <div className="overflow-x-auto [&_tbody_tr:last-child]:border-b-0 [&_td]:px-2 [&_td]:py-1.5 [&_th]:px-2 [&_th]:py-1.5 [&_th]:h-9">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zin</TableHead>
                      <TableHead>Antwoord</TableHead>
                      <TableHead className="w-[1%]">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verbSentences.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="max-w-xs truncate" title={s.sentence_template}>
                          {sentencePreview(s.sentence_template)}
                        </TableCell>
                        <TableCell>
                          {formatAnswerDisplay(s.answer, s.answer_form_key)}
                        </TableCell>
                        <TableCell className="py-1">
                          <div className="flex flex-nowrap items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => onEditSentence(s, e)}
                            >
                              Bewerken
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => onDeleteSentence(s)}
                            >
                              Verwijderen
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
