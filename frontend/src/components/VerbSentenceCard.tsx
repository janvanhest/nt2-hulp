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
import { Separator } from '@/components/ui/separator'
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

  const showHeaderBorder = isExpanded || detailsOpen

  const toggleButtonClass =
    'group w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground'

  return (
    <Card className="gap-4 py-4">
      <Collapsible open={isExpanded} onOpenChange={onExpandChange}>
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CardHeader
            className={cn(showHeaderBorder ? 'border-b pb-4' : '')}
          >
            <div className="row-span-2 flex min-w-0 flex-col gap-1.5">
              <CardTitle className="text-lg">{verb.infinitive}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {countLabel} — {coveredForms}/{TOTAL_VERB_FORMS} vormen gedekt
              </p>
              <div className="bg-muted h-2 w-full max-w-xs overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-[width]"
                  style={{ width: `${formsPercentage}%` }}
                />
              </div>
              <CollapsibleContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
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
            <CardAction>
              <div
                className={cn(
                  'flex min-w-[10rem] flex-col gap-2 rounded-lg border p-3'
                )}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={toggleButtonClass}
                    aria-expanded={detailsOpen}
                    aria-label="Vormen per type tonen of verbergen"
                  >
                    {detailsOpen ? (
                      <>
                        <ChevronUpIcon className="size-4 shrink-0" />
                        Verberg vormdetails
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="size-4 shrink-0" />
                        Vormen ({TOTAL_VERB_FORMS})
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <Separator />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={toggleButtonClass}
                  aria-expanded={isExpanded}
                  aria-label="Zinnen tonen of verbergen"
                  onClick={() => onExpandChange(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUpIcon className="size-4 shrink-0" />
                      Verberg zinnen
                    </>
                  ) : (
                    <>
                      <ChevronDownIcon className="size-4 shrink-0" />
                      Zinnen ingeklapt
                      {verbSentences.length > 0 && ` (${verbSentences.length})`}
                    </>
                  )}
                </Button>
                <Separator />
                {onAddSentence != null ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onAddSentence(verb.id)}
                  >
                    Zin toevoegen
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="sm" className="w-full">
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
          <CardContent className="pt-2">
            {verbSentences.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nog geen zinnen voor dit werkwoord.
              </p>
            ) : (
              <div className="overflow-x-auto">
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
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1">
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
