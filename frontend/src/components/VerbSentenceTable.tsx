import type { FillInSentence } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatAnswerDisplay, sentencePreview } from '@/lib/sentenceUtils'
import * as React from 'react'

export interface VerbSentenceTableProps {
  sentences: FillInSentence[]
  onEditSentence: (sentence: FillInSentence, e: React.MouseEvent) => void
  onDeleteSentence: (sentence: FillInSentence) => void
}

function VerbSentenceTableRow({
  sentence,
  onEditSentence,
  onDeleteSentence,
}: {
  sentence: FillInSentence
  onEditSentence: (sentence: FillInSentence, e: React.MouseEvent) => void
  onDeleteSentence: (sentence: FillInSentence) => void
}) {
  return (
    <TableRow>
      <TableCell className="max-w-xs truncate" title={sentence.sentence_template}>
        {sentencePreview(sentence.sentence_template)}
      </TableCell>
      <TableCell>
        {formatAnswerDisplay(sentence.answer, sentence.answer_form_key)}
      </TableCell>
      <TableCell className="py-1">
        <div className="flex flex-nowrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => onEditSentence(sentence, e)}
          >
            Bewerken
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDeleteSentence(sentence)}
          >
            Verwijderen
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function VerbSentenceTable({
  sentences,
  onEditSentence,
  onDeleteSentence,
}: VerbSentenceTableProps) {
  if (sentences.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nog geen zinnen voor dit werkwoord.
      </p>
    )
  }

  return (
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
          {sentences.map((s) => (
            <VerbSentenceTableRow
              key={s.id}
              sentence={s}
              onEditSentence={onEditSentence}
              onDeleteSentence={onDeleteSentence}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
