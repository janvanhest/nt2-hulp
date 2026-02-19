import { ApiError } from '@/lib/api'
import type { AnswerFormKey, FillInSentence } from '@/lib/api'
import { DeleteSentenceConfirmDialog } from '@/components/DeleteSentenceConfirmDialog'
import { FillInSentenceFormDialog } from '@/components/FillInSentenceFormDialog'
import { VerbSentenceCard } from '@/components/VerbSentenceCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useFillInSentences,
  useDeleteFillInSentence,
} from '@/hooks/useFillInSentences'
import { useVerbs } from '@/hooks/useVerbs'
import { ROUTES } from '@/lib/routes'
import { TARGET_SENTENCES_PER_FORM, buildGroupsByVerb } from '@/lib/sentenceUtils'
import { ANSWER_FORM_KEYS } from '@/lib/verbFormConfig'
import { toast } from 'sonner'
import * as React from 'react'
import { Link, useSearchParams } from 'react-router'

export function AdminSentencesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const verbParam = searchParams.get('verb')
  const formParam = searchParams.get('form')
  const initialVerbIdFromQuery =
    verbParam != null && /^\d+$/.test(verbParam) ? Number(verbParam) : undefined
  const initialAnswerFormKeyFromQuery =
    formParam != null && ANSWER_FORM_KEYS.includes(formParam as AnswerFormKey)
      ? (formParam as AnswerFormKey)
      : undefined

  const { data: verbs = [], isLoading: verbsLoading, isError: verbsError, error: verbsErrorObj } = useVerbs()
  const { data: sentences = [], isLoading: sentencesLoading, isError: sentencesError, error: sentencesErrorObj } = useFillInSentences()
  const deleteMutation = useDeleteFillInSentence()

  const groups = React.useMemo(
    () => buildGroupsByVerb(verbs, sentences),
    [verbs, sentences]
  )

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedSentence, setSelectedSentence] = React.useState<FillInSentence | null>(null)
  const [sentenceToDelete, setSentenceToDelete] = React.useState<FillInSentence | null>(null)
  const [hasOpenedFromQuery, setHasOpenedFromQuery] = React.useState(false)
  const [expandedVerbIds, setExpandedVerbIds] = React.useState<Set<number>>(new Set())

  const setVerbSublistOpen = (verbId: number, open: boolean) => {
    setExpandedVerbIds((prev) => {
      const next = new Set(prev)
      if (open) next.add(verbId)
      else next.delete(verbId)
      return next
    })
  }

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
  const handleAddSentence = (verbId: number) => {
    setSearchParams({ verb: String(verbId) })
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

  React.useEffect(() => {
    if (initialVerbIdFromQuery == null) setHasOpenedFromQuery(false)
  }, [initialVerbIdFromQuery])

  const hasQueryParams = initialVerbIdFromQuery != null

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
    if (!open && hasQueryParams) setSearchParams({})
  }

  const isLoading = verbsLoading || sentencesLoading
  const showCardList = !noVerbs && !isLoading && !sentencesError

  return (
    <main className="min-w-0 overflow-x-hidden p-6">
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
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sentencesError ? (
        <p className="text-destructive mt-1 text-sm" role="alert">
          {sentencesErrorObj instanceof Error ? sentencesErrorObj.message : 'Fout bij ophalen invulzinnen.'}
        </p>
      ) : showCardList ? (
        <>
          <p className="text-muted-foreground mb-4 text-sm">
            Streef: per werkwoordsvorm min. {TARGET_SENTENCES_PER_FORM} oefenzinnen.
          </p>
          <div className="space-y-4">
            {groups.map((group) => (
              <VerbSentenceCard
                key={group.verb.id}
                group={group}
                isExpanded={expandedVerbIds.has(group.verb.id)}
                onExpandChange={(open) => setVerbSublistOpen(group.verb.id, open)}
                onEditSentence={openEdit}
                onDeleteSentence={openDeleteConfirm}
                onAddSentence={handleAddSentence}
              />
            ))}
          </div>
        </>
      ) : null}

      <FillInSentenceFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        sentence={selectedSentence}
        initialVerbId={initialVerbIdFromQuery}
        initialAnswerFormKey={initialAnswerFormKeyFromQuery}
        verbs={verbs}
      />

      <DeleteSentenceConfirmDialog
        open={sentenceToDelete != null}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
        sentence={sentenceToDelete}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </main>
  )
}
