import { ApiError } from '@/lib/api'
import type { AnswerFormKey, FillInSentence } from '@/lib/api'
import { FillInSentenceFormDialog } from '@/components/FillInSentenceFormDialog'
import { ANSWER_FORM_LABELS } from '@/lib/verbFormConfig'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useFillInSentences,
  useDeleteFillInSentence,
} from '@/hooks/useFillInSentences'
import { useVerbs } from '@/hooks/useVerbs'
import { ROUTES } from '@/lib/routes'
import { toast } from 'sonner'
import * as React from 'react'
import { Link, useSearchParams } from 'react-router'

const TABLE_HEADERS = (
  <TableRow>
    <TableHead>Zin</TableHead>
    <TableHead>Antwoord</TableHead>
    <TableHead>Werkwoord</TableHead>
    <TableHead>Acties</TableHead>
  </TableRow>
)

function sentencePreview(text: string, maxLen = 50): string {
  const t = text.trim()
  return t.length <= maxLen ? t : `${t.slice(0, maxLen)}…`
}

function formatAnswerDisplay(answer: string, answerFormKey?: AnswerFormKey | ''): string {
  if (answerFormKey && answerFormKey in ANSWER_FORM_LABELS) {
    return `${answer} (${ANSWER_FORM_LABELS[answerFormKey as AnswerFormKey]})`
  }
  return answer
}

export function AdminSentencesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const verbParam = searchParams.get('verb')
  const initialVerbIdFromQuery =
    verbParam != null && /^\d+$/.test(verbParam) ? Number(verbParam) : undefined

  const { data: verbs = [], isLoading: verbsLoading, isError: verbsError, error: verbsErrorObj } = useVerbs()
  const { data: sentences = [], isLoading: sentencesLoading, isError: sentencesError, error: sentencesErrorObj } = useFillInSentences()
  const deleteMutation = useDeleteFillInSentence()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedSentence, setSelectedSentence] = React.useState<FillInSentence | null>(null)
  const [sentenceToDelete, setSentenceToDelete] = React.useState<FillInSentence | null>(null)
  const [hasOpenedFromQuery, setHasOpenedFromQuery] = React.useState(false)

  const forbiddenMessage =
    (verbsError && verbsErrorObj instanceof ApiError && verbsErrorObj.status === 403
      ? verbsErrorObj.message
      : null) ??
    (sentencesError && sentencesErrorObj instanceof ApiError && sentencesErrorObj.status === 403
      ? sentencesErrorObj.message
      : null)

  const noVerbs = !verbsLoading && verbs.length === 0
  const openCreate = () => {
    setSelectedSentence(null)
    setDialogOpen(true)
  }
  const openEdit = (sentence: FillInSentence, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSentence(sentence)
    setDialogOpen(true)
  }
  const openDeleteConfirm = (sentence: FillInSentence) => setSentenceToDelete(sentence)
  const closeDeleteConfirm = () => setSentenceToDelete(null)

  React.useEffect(() => {
    if (noVerbs || hasOpenedFromQuery || initialVerbIdFromQuery == null) return
    setHasOpenedFromQuery(true)
    setSelectedSentence(null)
    setDialogOpen(true)
  }, [initialVerbIdFromQuery, noVerbs, hasOpenedFromQuery])

  const handleConfirmDelete = () => {
    if (sentenceToDelete == null) return
    deleteMutation.mutate(sentenceToDelete.id, {
      onSuccess: () => {
        toast.success('Invulzin verwijderd.')
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

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open && initialVerbIdFromQuery != null) {
      setSearchParams({})
    }
  }

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invulzinnen beheren</h1>
        {!noVerbs && (
          <Button onClick={() => openCreate()} disabled={verbsLoading}>
            Nieuwe zin
          </Button>
        )}
      </div>

      {forbiddenMessage != null ? (
        <p
          className="bg-destructive/10 text-destructive mt-2 rounded-md px-3 py-2 text-sm"
          role="alert"
        >
          {forbiddenMessage}
        </p>
      ) : noVerbs ? (
        <div className="mt-2 flex flex-col items-start gap-2 text-muted-foreground">
          <p>Voeg eerst werkwoorden toe om oefenzinnen te kunnen koppelen.</p>
          <Button asChild variant="default">
            <Link to={ROUTES.beheerWerkwoorden}>Naar Werkwoorden beheren</Link>
          </Button>
        </div>
      ) : verbsLoading || sentencesLoading ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>{TABLE_HEADERS}</TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : sentencesError ? (
        <p className="text-destructive mt-1 text-sm" role="alert">
          {sentencesErrorObj instanceof Error ? sentencesErrorObj.message : 'Fout bij ophalen invulzinnen.'}
        </p>
      ) : sentences.length === 0 ? (
        <div className="mt-2 flex flex-col items-start gap-2 text-muted-foreground">
          <p>Nog geen invulzinnen. Voeg er een toe.</p>
          <Button onClick={() => openCreate()}>Nieuwe zin</Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>{TABLE_HEADERS}</TableHeader>
            <TableBody>
              {sentences.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="max-w-xs truncate" title={s.sentence_template}>
                    {sentencePreview(s.sentence_template)}
                  </TableCell>
                  <TableCell>{formatAnswerDisplay(s.answer, s.answer_form_key)}</TableCell>
                  <TableCell>{s.verb.infinitive}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      <Button type="button" variant="ghost" size="sm" onClick={(e) => openEdit(s, e)}>
                        Bewerken
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => openDeleteConfirm(s)}
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

      <FillInSentenceFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        sentence={selectedSentence}
        initialVerbId={initialVerbIdFromQuery}
        verbs={verbs}
      />

      <AlertDialog
        open={sentenceToDelete != null}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invulzin verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je deze invulzin wilt verwijderen?
              {sentenceToDelete && (
                <span className="mt-2 block text-muted-foreground">
                  {sentencePreview(sentenceToDelete.sentence_template, 80)}
                </span>
              )}
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
