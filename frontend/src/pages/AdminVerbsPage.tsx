import { ApiError } from '@/lib/api'
import type { Verb } from '@/lib/api'
import { useFillInSentences } from '@/hooks/useFillInSentences'
import { useVerbs, useDeleteVerb } from '@/hooks/useVerbs'
import { VerbFormDialog } from '@/components/VerbFormDialog'
import { VerbTableRow } from '@/components/VerbTableRow'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'
import * as React from 'react'

const TABLE_HEADERS = (
  <TableRow>
    <TableHead>Infinitief</TableHead>
    <TableHead>Aantal ingevulde vormen</TableHead>
    <TableHead>Invulzinnen</TableHead>
    <TableHead>Acties</TableHead>
  </TableRow>
)

export function AdminVerbsPage() {
  const { data, isLoading, isError, error } = useVerbs()
  const { data: sentences = [] } = useFillInSentences()
  const deleteMutation = useDeleteVerb()

  const sentenceCountByVerbId = React.useMemo(() => {
    const map = new Map<number, number>()
    for (const s of sentences) {
      const id = s.verb.id
      map.set(id, (map.get(id) ?? 0) + 1)
    }
    return map
  }, [sentences])

  const forbiddenMessage =
    isError && error instanceof ApiError && error.status === 403 ? error.message : null

  const [expandedId, setExpandedId] = React.useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedVerb, setSelectedVerb] = React.useState<Verb | null>(null)
  const [verbToDelete, setVerbToDelete] = React.useState<Verb | null>(null)

  const openCreate = () => {
    setSelectedVerb(null)
    setDialogOpen(true)
  }
  const openEdit = (verb: Verb, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVerb(verb)
    setDialogOpen(true)
  }
  const openDeleteConfirm = (verb: Verb) => {
    setVerbToDelete(verb)
  }
  const closeDeleteConfirm = () => {
    setVerbToDelete(null)
  }
  const handleConfirmDelete = () => {
    if (verbToDelete == null) return
    deleteMutation.mutate(verbToDelete.id, {
      onSuccess: () => {
        toast.success('Werkwoord verwijderd.')
        closeDeleteConfirm()
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error('Verwijderen mislukt', { description: err.message })
        } else {
          toast.error('Verwijderen mislukt', {
            description: err instanceof Error ? err.message : undefined,
          })
        }
      },
    })
  }

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vervoegingen beheren</h1>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>{TABLE_HEADERS}</TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>{TABLE_HEADERS}</TableHeader>
            <TableBody>
              {data.map((verb) => (
                <VerbTableRow
                  key={verb.id}
                  verb={verb}
                  sentenceCount={sentenceCountByVerbId.get(verb.id) ?? 0}
                  expanded={expandedId === verb.id}
                  onToggleExpand={() =>
                    setExpandedId(expandedId === verb.id ? null : verb.id)
                  }
                  onEdit={(e) => openEdit(verb, e)}
                  onDelete={openDeleteConfirm}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
      <VerbFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        verb={selectedVerb}
      />
      <AlertDialog open={verbToDelete != null} onOpenChange={(open) => !open && closeDeleteConfirm()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Werkwoord verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je <strong>{verbToDelete?.infinitive}</strong> wilt verwijderen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Bezig…' : 'Verwijderen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
