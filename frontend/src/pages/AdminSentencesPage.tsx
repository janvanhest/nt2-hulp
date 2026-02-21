import { DeleteSentenceConfirmDialog } from '@/components/DeleteSentenceConfirmDialog'
import { FillInSentenceFormDialog } from '@/components/FillInSentenceFormDialog'
import { VerbSentenceCard } from '@/components/VerbSentenceCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminSentencesPage } from '@/hooks/useAdminSentencesPage'
import { ROUTES } from '@/lib/routes'
import { TARGET_SENTENCES_PER_FORM } from '@/lib/sentenceUtils'
import { Link, useSearchParams } from 'react-router'

export function AdminSentencesPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    verbs,
    groups,
    verbsLoading,
    noVerbs,
    sentencesError,
    sentencesErrorObj,
    forbiddenMessage,
    showCardList,
    expandedVerbIds,
    dialogOpen,
    selectedSentence,
    sentenceToDelete,
    initialVerbIdFromQuery,
    initialAnswerFormKeyFromQuery,
    deletePending,
    setVerbSublistOpen,
    openCreate,
    handleAddSentence,
    openEdit,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleConfirmDelete,
    handleDialogOpenChange,
  } = useAdminSentencesPage(searchParams, setSearchParams)

  return (
    <main className="min-w-0 overflow-x-hidden p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Overzicht per werkwoord</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Vormdekking en invulzinnen per werkwoord.
          </p>
        </div>
        {!noVerbs && (
          <Button onClick={openCreate} disabled={verbsLoading}>
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
            <Link to={ROUTES.beheerWerkwoorden}>Naar Vervoegingen beheren</Link>
          </Button>
        </div>
      ) : verbsLoading ? (
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
          {sentencesErrorObj instanceof Error
            ? sentencesErrorObj.message
            : 'Fout bij ophalen invulzinnen.'}
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
        isPending={deletePending}
      />
    </main>
  )
}
