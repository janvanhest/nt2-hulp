
import { ApiError } from '@/lib/api'
import type { Verb } from '@/lib/api'
import { useVerbs } from '@/hooks/useVerbs'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { VerbFormFields } from '@/components/VerbFormFields'
import * as React from 'react'

const TABLE_HEADERS = (
  <TableRow>
    <TableHead>Infinitief</TableHead>
    <TableHead>Aantal ingevulde vormen</TableHead>
    <TableHead>Acties</TableHead>
  </TableRow>
)

function countFilledForms(forms: Verb['forms']): number {
  return Object.values(forms).filter(
    (v) => (typeof v === 'string' ? v.trim() !== '' : v !== '')
  ).length
}

export function AdminVerbsPage() {
  const { data, isLoading, isError, error } = useVerbs()

  const forbiddenMessage =
    isError && error instanceof ApiError && error.status === 403 ? error.message : null

  const [expandedId, setExpandedId] = React.useState<number | null>(null)

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Werkwoorden beheren</h1>
      {forbiddenMessage != null ? (
        <p
          className="bg-destructive/10 text-destructive mt-2 rounded-md px-3 py-2 text-sm"
          role="alert"
        >
          {forbiddenMessage}
        </p>
      ) : isLoading ? (
        <Table>
          <TableHeader>{TABLE_HEADERS}</TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : isError ? (
        <p className="text-destructive mt-1 text-sm" role="alert">
          {error instanceof Error ? error.message : 'Fout bij ophalen werkwoorden.'}
        </p>
      ) : data && data.length === 0 ? (
        <div className="text-muted-foreground mt-2">Nog geen werkwoorden. Voeg er een toe.</div>
      ) : data ? (
        <Table>
          <TableHeader>{TABLE_HEADERS}</TableHeader>
          <TableBody>
            {data.map((verb) => {
              const filledCount = countFilledForms(verb.forms)
              const totalCount = Object.keys(verb.forms).length
              const expanded = expandedId === verb.id
              return (
                <React.Fragment key={verb.id}>
                  <TableRow
                    className={expanded ? 'bg-muted/30' : ''}
                    onClick={() => setExpandedId(expanded ? null : verb.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell className="font-medium">{verb.infinitive}</TableCell>
                    <TableCell>
                      <Badge variant={filledCount === totalCount ? 'default' : 'secondary'}>
                        {filledCount} / {totalCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{expanded ? 'Sluiten' : 'Details'}</span>
                    </TableCell>
                  </TableRow>
                  {expanded && (
                    <TableRow>
                      <TableCell colSpan={3} className="bg-muted/10">
                        <VerbFormFields forms={verb.forms} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      ) : null}
    </main>
  )
}
