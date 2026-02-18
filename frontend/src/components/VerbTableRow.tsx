import type { Verb } from '@/lib/api'
import { countFilledForms, VERB_FORM_KEYS } from '@/lib/verbFormConfig'
import * as React from 'react'
import { VerbFormFields } from '@/components/VerbFormFields'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/ui/table'

export interface VerbTableRowProps {
  verb: Verb
  expanded: boolean
  onToggleExpand: () => void
  onEdit: (e: React.MouseEvent) => void
}

/** Single responsibility: render one verb table row and its expandable detail. */
export function VerbTableRow({
  verb,
  expanded,
  onToggleExpand,
  onEdit,
}: VerbTableRowProps) {
  const filledCount = countFilledForms(verb.forms)
  const totalCount = VERB_FORM_KEYS.length

  return (
    <>
      <TableRow
        className={expanded ? 'bg-muted/30' : ''}
        onClick={onToggleExpand}
        style={{ cursor: 'pointer' }}
      >
        <TableCell className="font-medium">{verb.infinitive}</TableCell>
        <TableCell>
          <Badge variant={filledCount === totalCount ? 'default' : 'secondary'}>
            {filledCount} / {totalCount}
          </Badge>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
            Bewerken
          </Button>
          <span className="ml-2 text-xs text-muted-foreground">
            {expanded ? 'Sluiten' : 'Details'}
          </span>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={3} className="bg-muted/10">
            <VerbFormFields forms={verb.forms} />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
