import type { Verb } from '@/lib/api'
import { countFilledForms, VERB_FORM_KEYS } from '@/lib/verbFormConfig'
import { VerbFormFields } from '@/components/VerbFormFields'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/ui/table'
import { ROUTES } from '@/lib/routes'
import { Link } from 'react-router'
import * as React from 'react'

export interface VerbTableRowProps {
  verb: Verb
  expanded: boolean
  onToggleExpand: () => void
  onEdit: (e: React.MouseEvent) => void
  onDelete: (verb: Verb) => void
}

/** Single responsibility: render one verb table row and its expandable detail. */
export function VerbTableRow({
  verb,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
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
          <div className="flex flex-wrap items-center gap-1">
            <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
              Bewerken
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(verb)
              }}
            >
              Verwijderen
            </Button>
            <span className="ml-2 text-xs text-muted-foreground">
              {expanded ? 'Sluiten' : 'Details'}
            </span>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={3} className="bg-muted/10">
            <VerbFormFields forms={verb.forms} />
            <div className="mt-3">
              <Button variant="outline" size="sm" asChild>
                <Link to={`${ROUTES.beheerZinnen}?verb=${verb.id}`}>Oefenzinnen toevoegen</Link>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
