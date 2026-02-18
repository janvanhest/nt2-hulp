import { ApiError } from '@/lib/api'
import type { Verb } from '@/lib/api'
import { useVerbs } from '@/hooks/useVerbs'
import { VerbFormDialog } from '@/components/VerbFormDialog'
import { VerbTableRow } from '@/components/VerbTableRow'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import * as React from 'react'

const TABLE_HEADERS = (
  <TableRow>
    <TableHead>Infinitief</TableHead>
    <TableHead>Aantal ingevulde vormen</TableHead>
    <TableHead>Acties</TableHead>
  </TableRow>
)

export function AdminVerbsPage() {
  const { data, isLoading, isError, error } = useVerbs()

  const forbiddenMessage =
    isError && error instanceof ApiError && error.status === 403 ? error.message : null

  const [expandedId, setExpandedId] = React.useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedVerb, setSelectedVerb] = React.useState<Verb | null>(null)

  const openCreate = () => {
    setSelectedVerb(null)
    setDialogOpen(true)
  }
  const openEdit = (verb: Verb, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVerb(verb)
    setDialogOpen(true)
  }

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Werkwoorden beheren</h1>
        <Button onClick={openCreate}>Werkwoord toevoegen</Button>
      </div>
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
        <div className="mt-2 flex flex-col items-start gap-2 text-muted-foreground">
          <p>Nog geen werkwoorden. Voeg er een toe.</p>
          <Button onClick={openCreate}>Werkwoord toevoegen</Button>
        </div>
      ) : data ? (
        <Table>
          <TableHeader>{TABLE_HEADERS}</TableHeader>
          <TableBody>
            {data.map((verb) => (
              <VerbTableRow
                key={verb.id}
                verb={verb}
                expanded={expandedId === verb.id}
                onToggleExpand={() =>
                  setExpandedId(expandedId === verb.id ? null : verb.id)
                }
                onEdit={(e) => openEdit(verb, e)}
              />
            ))}
          </TableBody>
        </Table>
      ) : null}
      <VerbFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        verb={selectedVerb}
      />
    </main>
  )
}
