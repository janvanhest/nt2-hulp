import type { AnswerFormKey, FillInSentence } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
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
}

export function VerbSentenceCard({
  group,
  isExpanded,
  onExpandChange,
  onEditSentence,
  onDeleteSentence,
}: VerbSentenceCardProps) {
  const { verb, sentences: verbSentences } = group
  const sentenceCount = verbSentences.length
  const coveredForms = countCoveredForms(verbSentences, TARGET_SENTENCES_PER_FORM)
  const formsPercentage = TOTAL_VERB_FORMS > 0 ? (coveredForms / TOTAL_VERB_FORMS) * 100 : 0
  const countLabel = sentenceCount === 1 ? '1 zin' : `${sentenceCount} zinnen`
  const formCounts = getFormCounts(verbSentences)

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={onExpandChange}>
        <CardHeader className="border-b">
          <div className="row-span-2 flex min-w-0 flex-col gap-2">
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
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
              {ANSWER_FORM_KEYS.map((formKey) => {
                const count = formCounts.get(formKey) ?? 0
                const covered = count >= TARGET_SENTENCES_PER_FORM
                const label = ANSWER_FORM_LABELS[formKey as AnswerFormKey]
                return (
                  <span key={formKey} className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">{label}:</span>
                    <Badge variant={covered ? 'default' : 'secondary'} className="font-normal">
                      {count}
                    </Badge>
                    {!covered && (
                      <Link
                        to={`${ROUTES.beheerZinnen}?verb=${verb.id}&form=${formKey}`}
                        className="text-primary hover:underline"
                      >
                        Toevoegen
                      </Link>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
          <CardAction>
            <div className="flex min-w-[10rem] flex-col items-stretch gap-2">
              <Button asChild size="sm" className="w-full">
                <Link to={`${ROUTES.beheerZinnen}?verb=${verb.id}`}>
                  Nieuwe zin
                </Link>
              </Button>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="group w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground"
                  aria-expanded={isExpanded}
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
              </CollapsibleTrigger>
            </div>
          </CardAction>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-4">
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
